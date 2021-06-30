import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule, MatDatepickerModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule, MatOptionModule, MatProgressBarModule, MatSelectModule,
  MatSidenavModule, MatSnackBarModule, MatTabsModule,
  MatToolbarModule, MatAutocompleteModule, MatChipsModule, MatProgressSpinnerModule, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetModule
} from '@angular/material';
import { SideNavComponent } from './shared/side-nav/side-nav.component';
import { ActionBarComponent } from './shared/action-bar/action-bar.component';
import {AgGridModule} from 'ag-grid-angular';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InstitucionesEditComponent } from './instituciones/instituciones-edit/instituciones-edit.component';
import { InstitucionesConsComponent } from './instituciones/instituciones-cons/instituciones-cons.component';
import {LoaderService} from './services/loader.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LoaderInterceptor} from './interceptors/loader.interceptor';
import {LoaderComponent} from './shared/loader/loader.component';
import {BlobStorageService} from './services/blob-storage.service';
import {BLOB_STORAGE_TOKEN, IAzureStorage, IBlobStorage} from '../assets/azure-storage/azureStorage';
import { FileitemComponent } from './shared/fileitem/fileitem.component';
import { InstitucionesEditcontComponent } from './instituciones/instituciones-editcont/instituciones-editcont.component';
import { EtiquetasDocumentoConsComponent } from './etiquetasDocumento/etiquetas-documento-cons/etiquetas-documento-cons.component';
import { EtiquetasDocumentoEditComponent } from './etiquetasDocumento/etiquetas-documento-edit/etiquetas-documento-edit.component';
import { DlgIntegranteComponent } from './Integrantes/dlg-integrante/dlg-integrante.component';
import { ListadosEditComponent } from './Integrantes/listados/listados-edit/listados-edit.component';
import { UsuariosConsComponent } from './usuarios/usuarios-cons/usuarios-cons.component';
import { StdGridComponent } from './shared/std-grid/std-grid.component';
import { UsuariosEditComponent } from './usuarios/usuarios-edit/usuarios-edit.component';
import { UsuariosSetpwdComponent } from './usuarios/usuarios-setpwd/usuarios-setpwd.component';
import { StdGrid2Component } from './shared/std-grid2/std-grid2.component';
import { ActionBar2Component } from './shared/action-bar2/action-bar2.component';
import { GridDeleteCell } from './shared/grid-button-cells/grid-delete-cell';

// tslint:disable-next-line: max-line-length
import { LoginComponent } from './login/login.component';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { ConsultaComponent } from './consulta/consulta.component';
import { ExcelService } from './services/excel.service';
import { EventoEditComponent } from './eventos/evento-edit/evento-edit.component';
import { EventoConsComponent } from './eventos/evento-cons/evento-cons.component';

import { AgmCoreModule } from '@agm/core';
import { GmdirComponent } from './shared/gmdir/gmdir.component';
import { DlgGmdirComponent } from './shared/dlg-gmdir/dlg-gmdir.component';
import { TimeInputComponent } from './shared/time-input/time-input.component';
import { OnlyNumberDirective } from './shared/only-number.directive';
import { MinuteNumberDirective } from './shared/minute-number.directive';
import { ControlPersonalEditComponent } from './organizacion/control-personal/control-personal-edit/control-personal-edit.component';
import { ControlPersonalConsComponent } from './organizacion/control-personal/control-personal-cons/control-personal-cons.component';
import { PersonalEditComponent } from './corporacion/personal/personal-edit/personal-edit.component';
import { PersonalConsComponent } from './corporacion/personal/personal-cons/personal-cons.component';
import {VehiculosEditComponent} from './corporacion/vehiculos/vehiculos-edit/vehiculos-edit.component';
import {VehiculosConsComponent} from './corporacion/vehiculos/vehiculos-cons/vehiculos-cons.component';
import {CertificadoEditComponent} from './certificado/certificado-edit/certificado-edit.component';
import {DactiloscopiaEditComponent} from './dactiloscopia/dactiloscopia-edit/dactiloscopia-edit.component';
import { DlgDetenidoComponent } from './primer-resp/iphad/dlg-detenido/dlg-detenido.component';
import { DlgPrVehiculoComponent } from './primer-resp/iphad/dlg-pr-vehiculo/dlg-pr-vehiculo.component';
import { DlgPrPrimerrespComponent } from './primer-resp/iphad/dlg-pr-primerresp/dlg-pr-primerresp.component';
import { PrPrimerrespFormComponent } from './primer-resp/iphad/pr-primerresp-form/pr-primerresp-form.component';
import { PrVehiculoFormComponent } from './primer-resp/iphad/pr-vehiculo-form/pr-vehiculo-form.component';
import { IphadEditComponent } from './primer-resp/iphad/iphad-edit/iphad-edit.component';
import { EventoFormComponent } from './primer-resp/iphad/evento-form/evento-form.component';
import { IphadmFormComponent } from './primer-resp/iphad/iphadm-form/iphadm-form.component';
import { DentencionFormComponent } from './primer-resp/iphad/dentencion-form/dentencion-form.component';
import { DireccionFormComponent } from './primer-resp/iphad/direccion-form/direccion-form.component';
import {UppercaseDirective} from './uppercase.directive';
import { DlgAsignarComponent } from './eventos/dlg-asignar/dlg-asignar.component';
import { IphadEvenConsComponent } from './primer-resp/iphad/iphad-even-cons/iphad-even-cons.component';
import { IphadPuestaComponent } from './primer-resp/iphad/iphad-puesta/iphad-puesta.component';
import {DetdactiConsComponent} from './primer-resp/iphad/detdacti-cons/detdacti-cons.component';
import {DetenidosConsComponent} from './primer-resp/iphad/detenidos-cons/detenidos-cons.component';
import { IncEditComponent } from './corporacion/incidentes/inc-edit/inc-edit.component';
import { IncConsComponent } from './corporacion/incidentes/inc-cons/inc-cons.component';
import { DlgUsuariosComponent } from './usuarios/dlg-usuarios/dlg-usuarios.component';
import { TerminalEditComponent } from './terminales/terminal-edit/terminal-edit.component';
import { TerminalConsComponent } from './terminales/terminal-cons/terminal-cons.component';
import { DlgTerminalesComponent } from './terminales/dlg-terminales/dlg-terminales.component';
import { IphadDetenidoInfoCardComponent } from './primer-resp/iphad-detenido-info-card/iphad-detenido-info-card.component';
import { IphadVehiculoInfoCardComponent } from './primer-resp/iphad-vehiculo-info-card/iphad-vehiculo-info-card.component';
import { RegistroComponent } from './registro/registro.component';
import { DetRegistroConsComponent } from './primer-resp/iphad/detregistro-cons/detregistro-cons.component';


export function azureBlobStorageFactory(): IBlobStorage {
  return window['AzureStorage'].Blob;
}

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    ActionBarComponent,
    InstitucionesEditComponent,
    InstitucionesConsComponent,
    LoaderComponent,
    FileitemComponent,
    InstitucionesEditcontComponent,
    EtiquetasDocumentoConsComponent,
    EtiquetasDocumentoEditComponent,
    DlgIntegranteComponent,
    ListadosEditComponent,
    UsuariosConsComponent,
    StdGridComponent,
    UsuariosEditComponent,
    UsuariosSetpwdComponent,
    StdGrid2Component,
    ActionBar2Component,
    LoginComponent,
    GridDeleteCell,
    ConsultaComponent,
    EventoEditComponent,
    EventoConsComponent,
    GmdirComponent,
    DlgGmdirComponent,
    TimeInputComponent,
    OnlyNumberDirective,
    MinuteNumberDirective,
    ControlPersonalEditComponent,
    ControlPersonalConsComponent,
    PersonalEditComponent,
    PersonalConsComponent,
    VehiculosEditComponent,
    VehiculosConsComponent,
    CertificadoEditComponent,
    DactiloscopiaEditComponent,
    DlgDetenidoComponent,
    PrVehiculoFormComponent,
    DlgPrVehiculoComponent,
    PrPrimerrespFormComponent,
    DlgPrPrimerrespComponent,
    IphadEditComponent,
    EventoFormComponent,
    IphadmFormComponent,
    DentencionFormComponent,
    DireccionFormComponent,
    DlgDetenidoComponent,
    PrVehiculoFormComponent,
    DlgPrVehiculoComponent,
    PrPrimerrespFormComponent,
    DlgPrPrimerrespComponent,
    UppercaseDirective,
    DlgAsignarComponent,
    IphadEvenConsComponent,
    IphadPuestaComponent,
    DetdactiConsComponent,
    DetenidosConsComponent,
    IncEditComponent,
    IncConsComponent,
    DlgUsuariosComponent,
    TerminalEditComponent,
    TerminalConsComponent,
    DlgTerminalesComponent,
    IphadDetenidoInfoCardComponent,
    IphadVehiculoInfoCardComponent,
    RegistroComponent,
    DetRegistroConsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    AgGridModule.withComponents([]),
    MatCardModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatProgressBarModule,
    MatTabsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatBottomSheetModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyACOXGkOq_0Iopu9nwbcM7xnEuXoGHc5SA',
      //apiKey: 'AIzaSyBWTnkj1VNKsaN00767CcdrJNbhBgY8ubo',

      libraries: ['places']
    })
  ],
  entryComponents: [
    DlgIntegranteComponent,
    DlgDetenidoComponent,
    DlgPrVehiculoComponent,
    DlgPrPrimerrespComponent,
    DlgAsignarComponent,
    UsuariosSetpwdComponent,
    UsuariosEditComponent,
    DlgUsuariosComponent,
    TerminalEditComponent,
    DlgTerminalesComponent,
  ],
  providers: [
    ExcelService, LoaderService, AuthGuard, AuthService, LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    BlobStorageService,
    {
      provide: BLOB_STORAGE_TOKEN,
      useValue: window['AzureStorage'].Blob
    },
    {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
