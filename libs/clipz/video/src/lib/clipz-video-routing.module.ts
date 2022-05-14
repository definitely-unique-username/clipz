import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VideoComponent } from "./video/video.component";

const routes: Routes = [
    // { path: '', pathMatch: 'full' },
    { path: ':videoId', pathMatch: 'full', component: VideoComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClipzVideoRoutingModule { }