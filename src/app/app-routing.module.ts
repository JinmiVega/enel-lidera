import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'admin', component: AdminComponent,
  	children: [
  	{ path: '', redirectTo: 'home', pathMatch: 'full'},
	{ path: 'home', component: HomeAdminComponent},
	{ path: 'fechas', component: FechasAdminComponent},
	{ path: 'usuarios', component: UsuariosAdminComponent},
	{ path: 'colaboradores', component: ColaboradoresAdminComponent},
  { path: 'areas', component: AreasAdminComponent},
  { path: 'formaciones', component: FormacionesAdminComponent},
  { path: 'planes', component: PlanesAdminComponent}
  	]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
