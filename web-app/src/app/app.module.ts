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
import { PersonalCenterComponent } from './personal-center/personal-center.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RolePipe} from './norm/role.pipe';
import {StatePipe} from './norm/state.pipe';
import {SexPipe} from './norm/sex.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    WelcomeComponent,
    LoginComponent,
    PersonalCenterComponent,
    RolePipe,
    StatePipe,
    SexPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  exports: [RolePipe, StatePipe, SexPipe],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
