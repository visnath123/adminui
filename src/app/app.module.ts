import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { allIcons, NgxBootstrapIconsModule } from "ngx-bootstrap-icons";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FooterComponent } from "./components/commons/footer/footer.component";
import { HeaderComponent } from "./components/commons/header/header.component";
import { DashboardComponent } from "./components/user/dashboard/dashboard.component";
import { DeleteUserComponent } from "./components/user/deleteuser/deleteuser.component";
import { EditUserComponent } from "./components/user/edituser/edituser.component";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    EditUserComponent,
    DeleteUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    NgxBootstrapIconsModule.pick(allIcons) 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
