import { NgModule } from "@angular/core";
import { AuthGuard, AuthPipeGenerator, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from "@angular/router";
import { ShellComponent } from "./shell/shell.component";

const redirectUnauthorizedToHome: AuthPipeGenerator = () => redirectUnauthorizedTo('/');

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
            path: 'clip',
            loadChildren: () => import('@clipz/clip')
                .then((m: typeof import('@clipz/clip')) => m.ClipzClipModule)
        },
        {
            path: 'manage',
            canActivate: [AuthGuard],
            loadChildren: () => import('@clipz/manage')
                .then((m: typeof import('@clipz/manage')) => m.ClipzManageModule),
            data: { authOnly: true, authGuardPipe: redirectUnauthorizedToHome }
        },
        {
            path: 'upload',
            loadChildren: () => import('@clipz/upload')
                .then((m: typeof import('@clipz/upload')) => m.ClipzUploadModule),
            data: { authOnly: true, authGuardPipe: redirectUnauthorizedToHome }
        },
        { path: '**', redirectTo: '' }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClipzShellRoutingModule { }