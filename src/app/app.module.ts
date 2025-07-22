import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { navComponent } from "./nav/nav.component";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routes';
import { CommonModule } from "@angular/common";
import { AuthInterceptor } from "./auth.interceptor";
import { ChatBoxComponent } from "./chat-box/chat-box.component";
import { TailorsListComponent } from "./tailors-list/tailors-list.component";

@NgModule({
 declarations:[
    AppComponent,
    LoginComponent,
     ChatBoxComponent,
    TailorsListComponent
],
imports:[
   
   BrowserModule,
   ReactiveFormsModule,
   FormsModule,
   HttpClientModule,
   AppRoutingModule,
   CommonModule
],
providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
bootstrap:[
    AppComponent
]
})
export class AppModule{

}
