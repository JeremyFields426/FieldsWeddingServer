import pg, { PoolConfig } from "pg";
import { Logger } from "../logs/Logger";
import { DatabaseHelpers } from "./DatabaseHelpers";

export class Database {
	private readonly m_Pool: pg.Pool;

	private readonly database = process.env.DATABASE_NAME;
	private readonly port = Number.parseInt(process.env.DATABASE_PORT || "");
	private readonly user = process.env.DATABASE_USER;
	private readonly host = process.env.DATABASE_HOST;
	private readonly password = process.env.DATABASE_PASSWORD;

	public constructor() {
		if (!this.port) {
			throw new Error("The port is not defined.");
		}

		if (!this.database) {
			throw new Error("The database is not defined.");
		}

		if (!this.user) {
			throw new Error("The user is not defined.");
		}

		if (!this.host) {
			throw new Error("The host is not defined.");
		}

		if (!this.password) {
			throw new Error("The password is not defined.");
		}

		const config: PoolConfig = {
			port: this.port,
			database: this.database,
			user: this.user,
			host: this.host,
			password: this.password,
		};

		this.m_Pool = new pg.Pool(config);

		Logger.Info("The Database has been created.");

		Logger.Info(
			`The user named '${this.user}' has connected to the database named '${this.database}' at the address '${this.host}' on port '${this.port}' with password '${this.password}.'`
		);
	}

	public async Query(sql: string, params: any[] = []): Promise<void> {
		await this.m_Pool.query(sql, params);
	}

	public async FetchOneOrZero<T>(
		sql: string,
		params: any[] = []
	): Promise<T | undefined> {
		const { rows } = await this.m_Pool.query(sql, params);

		const row = DatabaseHelpers.GetRow(rows);

		return row as T;
	}

	public async FetchOne<T>(sql: string, params: any[] = []): Promise<T> {
		const { rows } = await this.m_Pool.query(sql, params);

		const row = DatabaseHelpers.GetRow(rows);

		if (!row) {
			throw new Error(
				"Expected at least one row from the database. Received zero..."
			);
		}

		return row as T;
	}

	public async FetchMany<T>(sql: string, params: any[] = []): Promise<T[]> {
		const { rows } = await this.m_Pool.query(sql, params);

		const list = DatabaseHelpers.GetRows(rows);

		if (!list) {
			throw new Error(
				"Expected at least one row from the database. Received zero..."
			);
		}

		return list as T[];
	}
}
