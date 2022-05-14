import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UploadComponent } from "./upload/upload.component";

const routes: Routes = [
    { path: '', pathMatch: 'full', component: UploadComponent },
    { path: '**', redirectTo: '' }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClipzVideoFeatureShellRoutingModule { }