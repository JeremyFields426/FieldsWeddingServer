import { Request, Response } from "../api/Route";

export function APIKeyChecker(
	req: Request,
	res: Response,
	next: () => void,
	API_KEY: string
) {
	const RECEIVED_API_KEY = req.headers.apikey;

	if (!RECEIVED_API_KEY || RECEIVED_API_KEY !== API_KEY) {
		return res.sendStatus(401);
	}

	next();
}
