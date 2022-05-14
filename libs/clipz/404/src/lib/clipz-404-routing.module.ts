import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Clipz404Component } from "./404/404.component";

const routes: Routes = [
    { path: '', pathMatch: 'full', component: Clipz404Component },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class Clipz404RoutingModule { }