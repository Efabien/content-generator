import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GeneratorModule } from './pages/generator/generator.module';
import { HomeModule } from './pages/home/home.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    GeneratorModule,
    CommonModule,
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useFactory: provideHttpClient(withFetch()),
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
