import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {FileData} from '../../models/file-data.model';
import {concatMap, map, switchMap} from 'rxjs/operators';
import {ISasToken} from '../../../assets/azure-storage/azureStorage';
import {BlobStorageService} from '../../services/blob-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FileitemService {
  uri = environment.APIEndpoint;
  blobStorageContName = 'acrds';
  storageUri = 'https://devenvfs.blob.core.windows.net';



  constructor(
    private http: HttpClient,
    private blobStorage: BlobStorageService
  ) { }


  uploadFile (fileData: FileData) {
    console.log('init service uploadFile');
    // Convertir etiquetas en array de ids de etiquetas
    const tagsIdArray: string[] = [];
    fileData.etiquetas.forEach((item) => {
      tagsIdArray.push(item._id);
    });

    console.log('end service uploadFile');
    return this.http.post(`${this.uri}/docs/reqnew`, {
      doc: {
        nombre: fileData.nombre,
        tipo: fileData.tipo,
        etiquetas: tagsIdArray,
        estdoc: false,
        isActive : true
      },
      st: null
    }).pipe(
      concatMap( (data:any) => {
        // Obtienen información de la base de datos y el token
        const accessToken: ISasToken = {
          container: this.blobStorageContName,
          filename: data.doc._id,
          storageAccessToken:
            `?${data.st.token}`,
          storageUri: this.storageUri
        };

        fileData._id = data.doc._id;

        return this.blobStorage
          .uploadToBlobStorage(accessToken, fileData.obj);
        }
      )
    );
  }//uploadFile <<

  updateDoc(fileData:FileData) {
    return this.http.post(`${this.uri}/docs/update/${fileData._id}`, {
      estdoc: true
    });
  }//updateDoc <<

  downloadFile(fileData:FileData) {
    return this.http.get(`${this.uri}/docs/downloadlink/${fileData._id}`)
      .pipe(
        switchMap( (data:any) => {
          return this.http.get(data.downloadLink, { headers: new HttpHeaders({
            }), responseType: 'blob'});
        })
      );

  }

}
