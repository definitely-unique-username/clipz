import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ShellComponent } from "./shell/shell.component";

const routes: Routes = [
    {
        path: '',
        component: ShellComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'manage'
            },
            {
                path: 'manage',
                loadChildren: () => import('@clipz/video/manage')
                    .then((m: typeof import('@clipz/video/manage')) => m.ClipzVideoFeatureManageModule),
                data: { authOnly: true }
            },
            { path: '**', redirectTo: '' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClipzVideoFeatureShellRoutingModule { }