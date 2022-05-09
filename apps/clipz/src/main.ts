import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, Unsubscribe } from 'firebase/auth';

if (environment.production) {
  enableProdMode();
}

export const app: FirebaseApp = initializeApp(environment.firebase);

const unsubscribe: Unsubscribe = onAuthStateChanged(getAuth(app), () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(() => unsubscribe())
    .catch((err) => console.error(err));
});

