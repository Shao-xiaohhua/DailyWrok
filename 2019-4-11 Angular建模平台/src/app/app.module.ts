import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HomoloFrameworkModule } from 'homolo-framework';
import { HomoloDatamodelModule } from 'homolo-datamodel';
import { StartupService } from 'homolo-framework';
import { MetaLoader, loadMetaData } from 'homolo-datamodel';
import { TestpageComponent } from './testpage/testpage.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationInterceptor } from 'homolo-framework';

export function startupServiceFactory(startupService: StartupService) {
  return () => startupService.load();
}

@NgModule({
  declarations: [AppComponent, TestpageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomoloFrameworkModule.forRoot(environment),
    HomoloDatamodelModule.forRoot(environment)
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [StartupService],
      multi: true
    }, {
      provide: APP_INITIALIZER,
      useFactory: loadMetaData,
      deps: [MetaLoader],
      multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
