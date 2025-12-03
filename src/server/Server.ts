import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import { Server } from "http";
import { Database } from "../database/Database.js";
import { RSVPAPI } from "../api/RSVPAPI.js";
import { APIKeyChecker } from "./APIKeyChecker.js";
import { Logger } from "../logs/Logger.js";
import { PhotoAPI } from "../api/PhotoAPI.js";
import { HealthAPI } from "../api/HealthAPI.js";

dotenv.config({ path: `${process.cwd()}/.env` });

export class App {
	private static readonly PORT = process.env.SERVER_PORT as string;
	private static readonly API_KEY = process.env.SERVER_API_KEY as string;

	private static readonly HEADERS = {
		APIKey: this.API_KEY,
		"Access-Control-Allow-Credentials": "true",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
		"Access-Control-Allow-Headers":
			"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
	};

	private readonly m_Database: Database;

	private m_App;

	private m_Http: Server | undefined;

	public constructor() {
		this.m_App = express();
		this.m_Database = new Database();

		if (!App.PORT) {
			throw new Error("The Server Port is not defined.");
		}

		if (!App.API_KEY) {
			throw new Error("The Server API Key is not defined.");
		}

		this.BeginHealthCheck();

		process.on("uncaughtException", (error) => {
			Logger.Error(`Express experienced an UNCAUGHT and UNHANDLED ${error}`);
		});
	}

	public Start() {
		this.Setup();

		this.Listen();
	}

	public Setup() {
		this.m_App = express();

		this.m_App.use((_, res, next) => {
			res.setHeader("crossorigin", "true");
			res.setHeader("Access-Control-Allow-Credentials", "true");

			res.setHeader("Access-Control-Allow-Origin", "*");

			res.setHeader(
				"Access-Control-Allow-Methods",
				"GET,OPTIONS,PATCH,DELETE,POST,PUT"
			);

			res.setHeader(
				"Access-Control-Allow-Headers",
				"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
			);

			// Pass to next layer of middleware
			next();
		});

		this.m_App.use(cors());
		this.m_App.use(bodyParser.json());
		this.m_App.use(bodyParser.urlencoded({ extended: false }));
		// this.m_App.use((req, res, next) =>
		// 	APIKeyChecker(req, res, next, App.API_KEY)
		// );

		this.m_App.use(new RSVPAPI(this.m_Database).Router);
		this.m_App.use(new PhotoAPI(this.m_Database).Router);
		this.m_App.use(new HealthAPI(this.m_Database).Router);
	}

	private Listen() {
		this.m_Http = this.m_App.listen(App.PORT, () => {
			Logger.Info(`The Server is listening on port ${App.PORT}.`);
		});
	}

	private BeginHealthCheck() {
		const nLogTime = 1 * 60 * 1000;
		const nMinutesPerHealthCheck = 5;

		let nUptime = 0;

		setInterval(async () => {
			nUptime++;

			Logger.Info(`The server has been up for ${nUptime} minutes.`);

			if (nUptime % nMinutesPerHealthCheck != 0) {
				return;
			}

			try {
				const { data } = await axios.get(
					`https://localhost/ping`,
					{
						headers: App.HEADERS,
					}
				);

				Logger.Info(
					`The health check with the server SUCCEEDED! Received '${data}.'`
				);
			} catch (exception) {
				Logger.Error(`Server ${exception}`);
				Logger.Error(
					"The health check with the express server FAILED! Restarting..."
				);

				if (this.m_Http) {
					if (this.m_Http.listening) {
						Logger.Error(
							"The health check FAILED, but the HTTP server still says that it is LISTENING?"
						);
					}

					this.m_Http.close(() => {
						this.Start();
					});
				} else {
					this.Start();
				}
			}
		}, nLogTime);
	}
}
