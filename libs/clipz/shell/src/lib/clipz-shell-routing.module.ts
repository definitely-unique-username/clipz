import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ShellComponent } from "./shell/shell.component";

const routes: Routes = [{
    path: '',
    component: ShellComponent,
    children: [
        {
            path: '',
            loadChildren: () => import('@clipz/home')
                .then((m: typeof import('@clipz/home')) => m.ClipzHomeModule)
        },
        {
            path: 'about',
            loadChildren: () => import('@clipz/about')
                .then((m: typeof import('@clipz/about')) => m.ClipzAboutModule)
        },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClipzShellRoutingModule { }