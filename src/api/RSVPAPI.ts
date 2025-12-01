import { RSVPDetails } from "../shared/RSVPDetails";
import { Route } from "./Route";

interface FetchRSVPRequest {
	name: string;
}

interface PostRSVPRequest {
	rsvp: RSVPDetails;
}

interface DeleteRSVPRequest {
	name: string;
}

export class RSVPAPI extends Route {
	protected override async Fetch(req: FetchRSVPRequest) {
		if (req.name) 
		{
			const rsvp = await this.FetchRSVP(req.name);

			return {
				status: 200,
				content: {
					rsvp,
				},
			};
		}

		const rsvps = await this.FetchRSVPs();

		return {
			status: 200,
			content: {
				rsvps,
			},
		};
	}

	protected override async Post(req: PostRSVPRequest) {
		const rsvp = await this.FetchRSVP(req.rsvp.name);

		if (rsvp) {
			return {
				status: 200,
				content: {
					error: true,
					message: "The Provided RSVP Already Exists.",
				},
			};
		}

		await this.CreateRSVP(req.rsvp);

		return {
			status: 200,
			content: {
				error: false,
				message: "",
			},
		};
	}

	protected override async Delete(req: DeleteRSVPRequest) {
		await this.DeleteRSVP(req.name);

		return {
			status: 200,
			content: {
				error: false,
				message: "",
			},
		};
	}

	/* _______________________________________________________________________________________ */

	public async FetchRSVP(name: string): Promise<RSVPDetails | undefined> {
		return await this.DB.FetchOneOrZero(
			`
            SELECT
				*
            FROM
                rsvp
            WHERE
                name = $1`,
			[name]
		);
	}

	public async FetchRSVPs(): Promise<RSVPDetails[]> {
		return await this.DB.FetchMany(
			`
				SELECT
					*
				FROM
					rsvp`
		);
	}

	public async CreateRSVP(rsvp: RSVPDetails) {
		return await this.DB.Query(
			`
            INSERT INTO rsvp
                (name, phone_number, dietary_restrictions, special_notes, attendence)
            VALUES
                ($1, $2, $3, $4, $5)`,
			[rsvp.name, rsvp.phoneNumber, rsvp.dietaryRestrictions, rsvp.specialNotes, rsvp.attendence]
		);
	}

	public async DeleteRSVP(name: string) {
		return await this.DB.Query(
			`
			DELETE FROM
				rsvp
			WHERE
				name = $1
			`,
			[name]
		)
	}

	////////////////////////////////////////////////////////////
	//														  //
	//					Getters and Setters                   //
	//														  //
	////////////////////////////////////////////////////////////

	public override get Route() {
		return "rsvp";
	}
}
