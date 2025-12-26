import { PhotoDetails } from "../shared/PhotoDetails";
import { Route } from "./Route";

interface FetchPhotoRequest {
    
}

interface PostPhotoRequest {
    photos: PhotoDetails[];
}

interface DeletePhotoRequest {
    id: string
}

export class PhotoAPI extends Route {
    protected override async Fetch(req: FetchPhotoRequest) {
		const photos = await this.FetchPhotos();

		return {
			status: 200,
			content: {
				photos,
			},
		};
	}

    protected override async Post(req: PostPhotoRequest) {
        for (const photo of req.photos) {
            await this.CreatePhoto(photo);
        }

        return {
            status: 200,
            content: {
                error: false,
                message: "",
            },
        };
    }

    protected override async Delete(req: DeletePhotoRequest) {
        await this.DeletePhoto(req.id);

        return {
            status: 200,
            content: {
                error: false,
                message: "",
            },
        };
    }

    /* _______________________________________________________________________________________ */

    public async FetchPhotos(): Promise<PhotoDetails[]> {
        return await this.DB.FetchMany(
            `
                SELECT
                    *
                FROM
                    photo`
        );
    }

    public async CreatePhoto(photo: PhotoDetails) {
        return await this.DB.Query(
            `
            INSERT INTO photo
                (id, title, date, image_url, is_accepted)
            VALUES
                ($1, $2, $3, $4, $5)`,
            [photo.id, photo.title, photo.date, photo.imageUrl, photo.isAccepted]
        );
    }

    public async DeletePhoto(id: string) {
        return await this.DB.Query(
            `DELETE FROM 
                photo 
            WHERE 
                id = $1`,
            [id]
        )
    }

    ////////////////////////////////////////////////////////////
    //														  //
    //					Getters and Setters                   //
    //														  //
    ////////////////////////////////////////////////////////////

    public override get Route() {
        return "photo";
    }
}
