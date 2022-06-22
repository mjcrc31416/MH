import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { add } from 'lodash';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if(!navigator.geolocation) {
  alert("Navegador no soporta la Geolocation");
  throw new Error("Navegador no soporta la Geolocation");
}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
