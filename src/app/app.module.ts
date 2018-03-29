import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpModule} from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

import { AdminComponent } from './components/admin/admin.component';
import { HomeAdminComponent } from './components/admin/home-admin/home-admin.component';
import { FechasAdminComponent } from './components/admin/fechas-admin/fechas-admin.component';
import { UsuariosAdminComponent } from './components/admin/usuarios-admin/usuarios-admin.component';
import { ColaboradoresAdminComponent } from './components/admin/colaboradores-admin/colaboradores-admin.component';
import { AreasAdminComponent } from './components/admin/areas-admin/areas-admin.component';
import { FormacionesAdminComponent } from './components/admin/formaciones-admin/formaciones-admin.component';
import { PlanesAdminComponent } from './components/admin/planes-admin/planes-admin.component';

import { ColaboradorService } from './services/colaborador.service';
import { ComportamientoService } from './services/comportamiento.service';

import { EmailService } from './services/email.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    AdminComponent,
    HomeAdminComponent,
    FechasAdminComponent,
    UsuariosAdminComponent,
    ColaboradoresAdminComponent,
    AreasAdminComponent,
    FormacionesAdminComponent,
    PlanesAdminComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [
    ColaboradorService,
    ComportamientoService,
    EmailService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
