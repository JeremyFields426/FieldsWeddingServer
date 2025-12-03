import { Route } from "./Route";

export class HealthAPI extends Route {
    protected override async Fetch(req: {}) {
        return {
            status: 200,
            content: {
                error: false,
                message: "",
            },
        };
    }

    ////////////////////////////////////////////////////////////
    //														  //
    //					Getters and Setters                   //
    //														  //
    ////////////////////////////////////////////////////////////

    public override get Route() {
        return "ping";
    }
}
