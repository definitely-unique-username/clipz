import { ActivatedRoute, Data, RouterState } from "@angular/router";

export function getData(routerState: RouterState): Data {
    let rout: ActivatedRoute = routerState.root;

    while (rout.firstChild) {
        rout = rout.firstChild
    }

    return rout.snapshot.data;
}