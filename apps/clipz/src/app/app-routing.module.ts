import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('@clipz/shell')
            .then((m: typeof import('@clipz/shell')) => m.ClipzShellModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {enableTracing: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }