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
import {LoaderService} from './services/loader.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LoaderInterceptor} from './interceptors/loader.interceptor';
import {LoaderComponent} from './shared/loader/loader.component';
import {BlobStorageService} from './services/blob-storage.service';
import {BLOB_STORAGE_TOKEN, IAzureStorage, IBlobStorage} from '../assets/azure-storage/azureStorage';
import { FileitemComponent } from './shared/fileitem/fileitem.component';
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
import { ExcelService } from './services/excel.service';

import { AgmCoreModule } from '@agm/core';
import { GmdirComponent } from './shared/gmdir/gmdir.component';
import { DlgGmdirComponent } from './shared/dlg-gmdir/dlg-gmdir.component';
import { TimeInputComponent } from './shared/time-input/time-input.component';
import { OnlyNumberDirective } from './shared/only-number.directive';
import { MinuteNumberDirective } from './shared/minute-number.directive';
import { PersonalEditComponent } from './corporacion/personal/personal-edit/personal-edit.component';
import { PersonalConsComponent } from './corporacion/personal/personal-cons/personal-cons.component';
import {UppercaseDirective} from './uppercase.directive';
import { DlgUsuariosComponent } from './usuarios/dlg-usuarios/dlg-usuarios.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

export function azureBlobStorageFactory(): IBlobStorage {
  return window['AzureStorage'].Blob;
}

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    ActionBarComponent,
    LoaderComponent,
    FileitemComponent,
    UsuariosConsComponent,
    StdGridComponent,
    UsuariosEditComponent,
    UsuariosSetpwdComponent,
    StdGrid2Component,
    ActionBar2Component,
    LoginComponent,
    GridDeleteCell,
    GmdirComponent,
    DlgGmdirComponent,
    TimeInputComponent,
    OnlyNumberDirective,
    MinuteNumberDirective,
    PersonalEditComponent,
    PersonalConsComponent,
    UppercaseDirective,
    DlgUsuariosComponent,
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
    MatPaginatorModule,
    MatTableModule,
    HttpClientModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatBottomSheetModule,
    AgmCoreModule.forRoot({
      //apiKey: 'AIzaSyACOXGkOq_0Iopu9nwbcM7xnEuXoGHc5SA',
      //apiKey: 'AIzaSyACOXGkOq_0Iopu9nwbcM7xnEuXoGHc5SA',
      apiKey: 'AIzaSyBWTnkj1VNKsaN00767CcdrJNbhBgY8ubo',

      libraries: ['places']
    })
  ],
  entryComponents: [
    UsuariosSetpwdComponent,
    UsuariosEditComponent,
    DlgUsuariosComponent,
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
