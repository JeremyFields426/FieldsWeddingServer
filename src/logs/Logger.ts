import { promises } from "fs";

export class Logger {
	private static m_LogFilePath: string = "./src/logs";
	private static m_LogFileName: string = "";

	private static async CreateLogFileName() {
		const files = await promises.readdir(Logger.m_LogFilePath);

		Logger.m_LogFileName = `Logs_${files.length + 1}.log`;
	}

	private static async Write(log: string) {
		if (this.m_LogFileName.length === 0) {
			await this.CreateLogFileName();
		}

		log += "\n";

		promises.appendFile(`${Logger.m_LogFilePath}/${Logger.m_LogFileName}`, log);
	}

	public static Info(log: string) {
		console.info(log);

		Logger.Write(log);
	}

	public static Error(log: string) {
		console.error(log);

		Logger.Write(log);
	}
}
