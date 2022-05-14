import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClipComponent } from "./clip/clip.component";

const routes: Routes = [
    { path: ':clipId', component: ClipComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClipzClipRoutingModule { }