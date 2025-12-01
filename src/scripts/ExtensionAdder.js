import glob from "glob";
import fs from "fs";
import readline from "readline";
import { readFile } from "fs/promises";

const packageJSON = JSON.parse(
	await readFile(new URL("../../package.json", import.meta.url))
);

const strongDependencies = Object.keys(packageJSON.dependencies);
let weakDependencies = [];

function GetDirectories(src, callback) {
	glob(src + "/**/*.js", callback);
}

async function HandleFiles(err, files) {
	if (err) {
		throw new Error("Failed to glob the files in the public folder.");
	}

	for (const file of files) {
		const filename = file.split("/").slice(-1)[0].split(".js")[0];
		weakDependencies.push(filename);
	}

	for (const filename of files) {
		fs.readFile(filename, "utf8", (err, data) => {
			if (err) {
				throw new Error(`Failed to read from file named '${filename}.'`);
			}

			ProcessFile(filename, data);
		});
	}
}

async function ProcessFile(filename, data) {
	const fileStream = fs.createReadStream(filename);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	for await (const importLine of rl) {
		if (!importLine.includes("import")) break;

		// import x "./public/database/helloWorld.js";
		// ./public/database/helloWorld.js
		// helloWorld.js
		const importedFile = importLine.split('"')[1].split("/").slice(-1)[0];

		const bRequiresCorrection = IsImportIncorrect(importedFile);

		if (!bRequiresCorrection) {
			// console.log(`File named '${importedFile}' with line '${importLine}' does not require correction.`);

			continue;
		}

		data = FixImport(data, importLine);
	}

	FixFile(filename, data);
}

function IsImportIncorrect(importedFile) {
	if (importedFile.includes(".js")) {
		return false;
	}

	if (strongDependencies.includes(importedFile)) {
		return false;
	}

	if (!weakDependencies.includes(importedFile)) {
		const msg = `File named ${importedFile} not among strong or weak dependencies.`;

		throw new Error(msg);
	}

	return true;
}

function FixImport(data, importLine) {
	const sFixedImport = CreateFixedImport(importLine);

	// console.log(`Import corrected from '${importLine}' to '${sFixedImport}.'`)

	return data.replace(importLine, sFixedImport);
}

function FixFile(filename, data) {
	fs.writeFile(filename, data, "utf8", (err) => {
		if (err) {
			throw new Error(`Failed to write to file name '${filename}.'`);
		}
	});
}

function CreateFixedImport(importLine) {
	return importLine.split('"')[0] + '"' + importLine.split('"')[1] + '.js";';
}

function Main() {
	GetDirectories("./public", HandleFiles);
}

Main();
