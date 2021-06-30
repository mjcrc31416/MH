import {AfterContentInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileData} from '../../models/file-data.model';
import {FileitemService} from './fileitem.service';
import {combineAll, concatMap, endWith, exhaustMap, flatMap, map, switchMap, takeLast, tap} from 'rxjs/operators';
import {from, Observable, of} from 'rxjs';
import * as fileSaver from 'file-saver';

interface IUploadProgress {
  filename?: string;
  progress: number;
}

@Component({
  selector: 'app-fileitem',
  templateUrl: './fileitem.component.html',
  styleUrls: ['./fileitem.component.scss']
})
export class FileitemComponent implements OnInit, AfterContentInit {

  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isFileDownloading = false;
  isFileUploading = true;

  @Output() fileUploaded = new EventEmitter<any>();

  @Input() fileData: FileData;
  uploadProgress;

  constructor(
    public fileSrv: FileitemService
  ) {
  }

  ngAfterContentInit() {

  }

  ngOnInit(): void {
    if (this.fileData) {
      if (this.fileData.load) {
        console.log('cargar archvio');
        this.isFileUploading = true;
        this.uploadFile();
      } else {
        this.isFileUploading = false;
        console.log('archivo no se cargara');
      }
    } else {
      this.isFileUploading = false;
    }
  }

  public uploadFile() {
    console.log('init upload file');
    this.fileSrv.uploadFile(this.fileData)
      .pipe(
        tap(progress => this.mapProgress(progress)),
        takeLast(1),
        concatMap( (data:any) => {
          console.log('concatMap ini');
          this.fileData.load = false;
          this.isFileUploading = false;
          this.fileData.estdoc = true;
          return this.fileSrv.updateDoc(this.fileData);
        })
      ).subscribe( (data) => {
        console.log('subscribe');
        console.log(data);
        this.fileUploaded.emit(this.fileData);
      });
    console.log('end upload file');
  }

  public mapProgress(progress: number): any {
    console.log(progress);
    this.uploadProgress = progress;
    return {
      progress: progress
    };
  }

  public joinTags(tagArray) {
    if(tagArray) {
      const strArray: string[] = [];
      tagArray.forEach( (item) => {
        strArray.push(item.nombre);
      });
      return strArray.join(',');
    }
    return '';
  }

  public downloadFile() {
    this.isFileDownloading = true;
    this.fileSrv.downloadFile(this.fileData)
      .subscribe( response => {
        fileSaver.saveAs(response, this.fileData.nombre);
        this.isFileDownloading = false;
      });
  }

  public delete(data) {
    let res = confirm('¿Desea eliminar el document? Una vez eliminado, no podrá tener acceso al mismo');
    if (res) {
      this.fileData.isActive = false;
    }
  }

}
