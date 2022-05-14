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
        {
            path: 'manage',
            loadChildren: () => import('@clipz/manage')
                .then((m: typeof import('@clipz/manage')) => m.ClipzManageModule),
            data: { authOnly: true }
        },
        {
            path: 'upload',
            loadChildren: () => import('@clipz/upload')
                .then((m: typeof import('@clipz/upload')) => m.ClipzUploadModule),
            data: { authOnly: true }
        },
        { path: '**', redirectTo: '' }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClipzShellRoutingModule { }