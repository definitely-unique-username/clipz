import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageComponent } from "./manage/manage.component";

const routes: Routes = [
    { path: '', pathMatch: 'full', component: ManageComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClipzManageRoutingModule { }