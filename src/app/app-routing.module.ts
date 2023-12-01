import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UsuariosConsComponent} from './usuarios/usuarios-cons/usuarios-cons.component';
import {UsuariosEditComponent} from './usuarios/usuarios-edit/usuarios-edit.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth-guard.service';
import {GmdirComponent} from './shared/gmdir/gmdir.component';
import {PersonalEditComponent} from './corporacion/personal/personal-edit/personal-edit.component';
import {PersonalConsComponent} from './corporacion/personal/personal-cons/personal-cons.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'users-cons', component: UsuariosConsComponent, canActivate: [AuthGuard]  },
  { path: 'personal-edit', component: PersonalEditComponent, canActivate: [AuthGuard]},
  // { path: 'personal-edit', component: PersonaEditComponent, canActivate: [AuthGuard]},
  { path: 'users-edit/:id', component: UsuariosEditComponent, canActivate: [AuthGuard]  },
  { path: 'login', component: LoginComponent },
  { path: 'maptest', component: GmdirComponent, canActivate: [AuthGuard]},
  { path: 'personal-edit', component: PersonalEditComponent, canActivate: [AuthGuard]},
  // { path: 'persona-edit', component: PersonaEditComponent, canActivate: [AuthGuard]},
  { path: 'personal-cons', component: PersonalConsComponent, canActivate: [AuthGuard]},
  { path: 'personal/:id', component: PersonalEditComponent, canActivate: [AuthGuard]},
  // { path: 'persona/:id', component: PersonaEditComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
