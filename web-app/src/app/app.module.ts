import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import {AuthTokenInterceptor} from './core/auth-token-interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule} from "@angular/material/dialog";
import {SoryPipe} from "./norm/sory.pipe";
import { MatSelect, MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    WelcomeComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSelectModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
