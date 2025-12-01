export type Count = { count: number };
export type Exists = { exists: boolean };

export class DatabaseHelpers {
	public static GetRow(rows: object[]) {
		if (rows.length === 0) return undefined;

		return DatabaseHelpers.MakeRowCamelcase(rows[0]);
	}

	public static GetRows(rows: object[]) {
		const modifiedRows = [];

		for (const row of rows) {
			modifiedRows.push(DatabaseHelpers.MakeRowCamelcase(row));
		}

		return modifiedRows;
	}

	private static MakeRowCamelcase(row: object) {
		const modifiedRow: { [name: string]: any } = {};

		for (const [columnName, value] of Object.entries(row)) {
			const name = columnName
				.split("_")
				.reduce(
					(acc, cur, index) =>
						(acc += DatabaseHelpers.MakeWordCamelcase(cur, index)),
					""
				);

			modifiedRow[name] = value;
		}

		return modifiedRow;
	}

	private static MakeWordCamelcase(word: string, index: number) {
		return index === 0
			? word.toLowerCase()
			: DatabaseHelpers.CapitalizeFirstLetter(word);
	}

	private static CapitalizeFirstLetter(word: string) {
		return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	}
}
