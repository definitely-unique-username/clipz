import { NgModule, Optional, SkipSelf } from '@angular/core';
import { provideFirebaseApp, getApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

@NgModule({
  imports: [
    provideFirebaseApp(() => getApp()),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ],
})
export class ClipzCoreModule {
  constructor(@Optional() @SkipSelf() module: ClipzCoreModule) {
    if (module) {
      throw new Error('ClipzCoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
