import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InstitucionesConsComponent} from './instituciones/instituciones-cons/instituciones-cons.component';
import {InstitucionesEditComponent} from './instituciones/instituciones-edit/instituciones-edit.component';
import { InstitucionesEditcontComponent } from './instituciones/instituciones-editcont/instituciones-editcont.component';
import {EtiquetasDocumentoConsComponent} from './etiquetasDocumento/etiquetas-documento-cons/etiquetas-documento-cons.component';
import {EtiquetasDocumentoEditComponent} from './etiquetasDocumento/etiquetas-documento-edit/etiquetas-documento-edit.component';
import {UsuariosConsComponent} from './usuarios/usuarios-cons/usuarios-cons.component';
import {UsuariosEditComponent} from './usuarios/usuarios-edit/usuarios-edit.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth-guard.service';
import { ConsultaComponent } from './consulta/consulta.component';
import {EventoEditComponent} from './eventos/evento-edit/evento-edit.component';
import {EventoConsComponent} from './eventos/evento-cons/evento-cons.component';
import {GmdirComponent} from './shared/gmdir/gmdir.component';
import {PersonalEditComponent} from './corporacion/personal/personal-edit/personal-edit.component';
import {PersonalConsComponent} from './corporacion/personal/personal-cons/personal-cons.component';
import {VehiculosEditComponent} from './corporacion/vehiculos/vehiculos-edit/vehiculos-edit.component';
import {VehiculosConsComponent} from './corporacion/vehiculos/vehiculos-cons/vehiculos-cons.component';
import {CertificadoEditComponent} from './certificado/certificado-edit/certificado-edit.component';
import {DactiloscopiaEditComponent} from './dactiloscopia/dactiloscopia-edit/dactiloscopia-edit.component';
import {IphadEditComponent} from './primer-resp/iphad/iphad-edit/iphad-edit.component';
import {IphadEvenConsComponent} from './primer-resp/iphad/iphad-even-cons/iphad-even-cons.component';
import {DetenidosConsComponent} from './primer-resp/iphad/detenidos-cons/detenidos-cons.component';
import {DetdactiConsComponent} from './primer-resp/iphad/detdacti-cons/detdacti-cons.component';
import {IncEditComponent} from './corporacion/incidentes/inc-edit/inc-edit.component';
import {IncConsComponent} from './corporacion/incidentes/inc-cons/inc-cons.component';
import { TerminalEditComponent } from './terminales/terminal-edit/terminal-edit.component';
import { TerminalConsComponent } from './terminales/terminal-cons/terminal-cons.component';
import {IphadDetenidoInfoCardComponent} from './primer-resp/iphad-detenido-info-card/iphad-detenido-info-card.component';
import { RegistroComponent } from './registro/registro.component';
import { DetRegistroConsComponent } from './primer-resp/iphad/detregistro-cons/detregistro-cons.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'instituciones', component: InstitucionesConsComponent, canActivate: [AuthGuard]  },
  { path: 'institucion-form', component: InstitucionesEditComponent, canActivate: [AuthGuard]  },
  { path: 'instituciones-cons', component: InstitucionesConsComponent, canActivate: [AuthGuard]  },
  { path: 'instituciones-edit/:id', component: InstitucionesEditcontComponent, canActivate: [AuthGuard]  },
  { path: 'etiquetasdoc-cons', component: EtiquetasDocumentoConsComponent, canActivate: [AuthGuard]  },
  { path: 'etiquetasdoc-edit/:id', component: EtiquetasDocumentoEditComponent, canActivate: [AuthGuard]  },
  { path: 'users-cons', component: UsuariosConsComponent, canActivate: [AuthGuard]  },
  { path: 'users-edit/:id', component: UsuariosEditComponent, canActivate: [AuthGuard]  },
  { path: 'login', component: LoginComponent },
  { path: 'consulta', component: ConsultaComponent, canActivate: [AuthGuard] },
  { path: 'evento-edit', component: EventoEditComponent, canActivate: [AuthGuard]},
  { path: 'evento-cons', component: EventoConsComponent, canActivate: [AuthGuard]},
  { path: 'evento-edit/:id', component: EventoEditComponent, canActivate: [AuthGuard]},
  { path: 'maptest', component: GmdirComponent, canActivate: [AuthGuard]},
  { path: 'personal-edit', component: PersonalEditComponent, canActivate: [AuthGuard]},
  { path: 'personal-cons', component: PersonalConsComponent, canActivate: [AuthGuard]},
  { path: 'personal/:id', component: PersonalEditComponent, canActivate: [AuthGuard]},
  { path: 'vehiculos', component: VehiculosEditComponent, canActivate: [AuthGuard]},
  { path: 'vehiculos-cons', component: VehiculosConsComponent, canActivate: [AuthGuard]},
  { path: 'vehiculos/:id', component: VehiculosEditComponent, canActivate: [AuthGuard]},
  { path: 'preiph-edit/:idPreIph', component: IphadEditComponent, canActivate: [AuthGuard]},
  { path: 'preiph-cons', component: IphadEvenConsComponent, canActivate: [AuthGuard]},
  { path: 'detenidos-cons', component: DetenidosConsComponent, canActivate: [AuthGuard]},
  { path: 'detdacti-cons', component: DetdactiConsComponent, canActivate: [AuthGuard]},
  { path: 'certificado-edit', component: CertificadoEditComponent, canActivate: [AuthGuard]},
  { path: 'certificado-edit/:id', component: CertificadoEditComponent, canActivate: [AuthGuard]},
  { path: 'dactiloscopia-edit', component: DactiloscopiaEditComponent, canActivate: [AuthGuard]},
  { path: 'dactiloscopia-edit/:id', component: DactiloscopiaEditComponent, canActivate: [AuthGuard]},
  { path: 'incidente-edit', component: IncEditComponent, canActivate: [AuthGuard]},
  { path: 'incidente-edit/:id', component: IncEditComponent, canActivate: [AuthGuard]},
  { path: 'incidente-cons', component: IncConsComponent, canActivate: [AuthGuard]},
  { path: 'terminal-edit', component: TerminalEditComponent, canActivate: [AuthGuard]},
  { path: 'terminal-cons', component: TerminalConsComponent, canActivate: [AuthGuard]},
  { path: 'terminal/:id', component: TerminalEditComponent, canActivate: [AuthGuard]},
  { path: 'registro', component: RegistroComponent, canActivate: [AuthGuard]},
  { path: 'TEST', component: IphadDetenidoInfoCardComponent, canActivate: [AuthGuard]},
  { path: 'detregistro-cons', component: DetRegistroConsComponent, canActivate: [AuthGuard]},
  { path: 'registro/:id', component: RegistroComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
