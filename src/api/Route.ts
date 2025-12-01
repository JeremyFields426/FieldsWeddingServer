import dotenv from "dotenv";
import express, {
	Request as ExpressRequest,
	Response as ExpressResponse,
} from "express";
import { Database } from "../database/Database";
import { Logger } from "../logs/Logger";

dotenv.config({ path: `${process.cwd()}/.env` });

export type Request<T = any> = ExpressRequest<{}, {}, T, T>;
export type Response<T = any> = ExpressResponse<T>;

export interface Message {
	status: number;
	content: any;
}

export abstract class Route {
	private readonly m_Router = express.Router();
	private readonly m_Database;

	public constructor(database: Database) {
		this.m_Database = database;

		this.FetchWrapper = this.FetchWrapper.bind(this);
		this.PostWrapper = this.PostWrapper.bind(this);
		this.PatchWrapper = this.PatchWrapper.bind(this);
		this.DeleteWrapper = this.DeleteWrapper.bind(this);

		this.m_Router
			.route(this.GetRoute())
			.get(this.FetchWrapper)
			.post(this.PostWrapper)
			.put(this.PatchWrapper)
			.patch(this.PatchWrapper)
			.delete(this.DeleteWrapper);
	}

	private async FetchWrapper(req: Request, res: Response) {
		try {
			const { status, content } = await this.Fetch(req.query);

			if (status !== 200) {
				const sMessage =
					`Received Status ${status}` +
					"\n" +
					`Fetch to route ${
						this.Route
					} FAILED with the following request: ${JSON.stringify(req.query)}` +
					"\n" +
					`Sending status ${status} back to the caller.`;

				Logger.Error(sMessage);
			}

			res.status(status).send(content);
		} catch (err) {
			const sMessage =
				`Received Database ${err}` +
				"\n" +
				`Fetch to route ${
					this.Route
				} FAILED with the following request: ${JSON.stringify(req.query)}` +
				"\n" +
				`Sending status 500 (Internal Server Error) back to the caller.`;

			Logger.Error(sMessage);

			res.status(500).send(sMessage);
		}
	}

	protected async Fetch(req: any) {
		return {
			status: 404,
			content: {},
		};
	}

	private async PostWrapper(req: Request, res: Response) {
		try {
			const { status, content } = await this.Post(req.body);

			if (status !== 200) {
				const sMessage =
					`Received Status ${status}` +
					"\n" +
					`Post to route ${
						this.Route
					} FAILED with the following request: ${JSON.stringify(req.body)}` +
					"\n" +
					`Sending status ${status} back to the caller.`;

				Logger.Error(sMessage);
			}

			res.status(status).send(content);
		} catch (err) {
			const sMessage =
				`Received Database ${err}` +
				"\n" +
				`Post to route ${
					this.Route
				} FAILED with the following request: ${JSON.stringify(req.body)}` +
				"\n" +
				`Sending status 500 (Internal Server Error) back to the caller.`;

			Logger.Error(sMessage);

			res.status(500).send(sMessage);
		}
	}

	protected async Post(req: any) {
		return {
			status: 404,
			content: {},
		};
	}

	private async PatchWrapper(req: Request, res: Response) {
		try {
			const { status, content } = await this.Patch(req.body);

			if (status !== 200) {
				const sMessage =
					`Received Status ${status}` +
					"\n" +
					`Patch to route ${
						this.Route
					} FAILED with the following request: ${JSON.stringify(req.body)}` +
					"\n" +
					`Sending status ${status} back to the caller.`;

				Logger.Error(sMessage);
			}

			res.status(status).send(content);
		} catch (err) {
			const sMessage =
				`Received Database ${err}` +
				"\n" +
				`Patch to route ${
					this.Route
				} FAILED with the following request: ${JSON.stringify(req.body)}` +
				"\n" +
				`Sending status 500 (Internal Server Error) back to the caller.`;

			Logger.Error(sMessage);

			res.status(500).send(sMessage);
		}
	}

	protected async Patch(req: any) {
		return {
			status: 404,
			content: {},
		};
	}

	private async DeleteWrapper(req: Request, res: Response) {
		try {
			const { status, content } = await this.Delete(req.query);

			if (status !== 200) {
				const sMessage =
					`Received Status ${status}` +
					"\n" +
					`Delete to route ${
						this.Route
					} FAILED with the following request: ${JSON.stringify(req.query)}` +
					"\n" +
					`Sending status ${status} back to the caller.`;

				Logger.Error(sMessage);
			}

			res.status(status).send(content);
		} catch (err) {
			const sMessage =
				`Received Database ${err}` +
				"\n" +
				`Delete to route ${
					this.Route
				} FAILED with the following request: ${JSON.stringify(req.query)}` +
				"\n" +
				`Sending status 500 (Internal Server Error) back to the caller.`;

			Logger.Error(sMessage);

			res.status(500).send(sMessage);
		}
	}

	protected async Delete(req: any) {
		return {
			status: 404,
			content: {},
		};
	}

	public GetRoute() {
		return `/${this.Route}`;
	}

	////////////////////////////////////////////////////////////
	//														  //
	//					Getters and Setters                   //
	//														  //
	////////////////////////////////////////////////////////////

	public abstract get Route(): string;

	public get Router() {
		return this.m_Router;
	}

	protected get DB() {
		return this.m_Database;
	}
}
