import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClipComponent } from "./clip/clip.component";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('@clipz/404')
            .then((m: typeof import('@clipz/404')) => m.Clipz404Module)
    },
    { path: ':clipId', component: ClipComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClipzClipRoutingModule { }