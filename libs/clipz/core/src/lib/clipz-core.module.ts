import { NgModule, Optional, SkipSelf } from '@angular/core';
import { provideFirebaseApp, getApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { devtoolsModules } from './devtools-modules';

@NgModule({
  imports: [
    provideFirebaseApp(() => getApp()),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    StoreModule.forRoot({ router: routerReducer }),
    provideStorage(() => getStorage()),
    StoreRouterConnectingModule.forRoot(),
    devtoolsModules,
  ],
})
export class ClipzCoreModule {
  constructor(@Optional() @SkipSelf() module: ClipzCoreModule) {
    if (module) {
      throw new Error('ClipzCoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
