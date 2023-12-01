import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service'

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  public menu = [];

  constructor(
    private router: Router,
    private _log: LoginService
  ) { }

  ngOnInit() {
    this.getMenu();
  }

  getMenu() {
    let user = this._log.getUser();

    if (user.tusuario) {
      if (user.tusuario.tusuario == 'ADMINISTRADOR') {
        this.menu = [
          
          {
            label: 'SISTEMA ADMINISTRACIÓN DE PERSONAL',
            submenus: [
              // {
              //   label: 'Captura de Eventos',
              //   componentLink: 'evento-cons',
              //   isSelected: false
              // },
              {
                label: 'Alta de Personal',
                componentLink: 'personal-cons',
                isSelected: false
              },
              // {
              //   label: 'Alta de Vehiculos',
              //   componentLink: 'vehiculos-cons',
              //   isSelected: false
              // },
              {
                label: 'Usuarios',
                componentLink: 'users-cons',
                isSelected: false
              },
              // {
              //   label: 'Terminales',
              //   componentLink: 'terminal-cons',
              //   isSelected: false
              // }
            ]
          },
          // {
          //   label: 'REGISTRO DE JUSTICIA CÍVICA',
          //   submenus: [
          //     {
          //       label: 'Consulta del Detenido',
          //       componentLink: 'personal-cons',
          //       isSelected: false
          //     }
          //   ]
          // }
      //   ];
      // } else if (user.tusuario.tusuario == 'MÉDICO') {
      //   this.menu = [
      //     {
      //       label: 'JUSTICIA CÍVICA',
      //       submenus: [
      //         {
      //           label: 'Certificado Médico',
      //           componentLink: 'detenidos-cons',
      //           isSelected: false
      //         },
      //       ]
      //     }
      //   ];
      // } else if (user.tusuario.tusuario == 'CENTRAL DE RADIO') {
      //   this.menu = [
      //     {
      //       label: 'JUSTICIA CÍVICA',
      //       submenus: [
      //         {
      //           label: 'Captura de Eventos',
      //           componentLink: 'evento-cons',
      //           isSelected: false
      //         },
      //         {
      //           label: 'Primer Respondiente',
      //           componentLink: 'preiph-cons',
      //           isSelected: false
      //         }
      //       ]
      //     },
      //   ];
      // } else if (user.tusuario.tusuario == 'PRIMER RESPONDIENTE') {
      //   this.menu = [
      //     {
      //       label: 'JUSTICIA CÍVICA',
      //       submenus: [
      //         {
      //           label: 'Registro Objetos Personales',
      //           componentLink: 'detregistro-cons',
      //           isSelected: false
      //         }
      //       ]
      //     },
      //   ];
      // } else if (user.tusuario.tusuario == 'MEDIAFILIACIÓN') {
      //   this.menu = [
      //     {
      //       label: 'JUSTICIA CÍVICA',
      //       submenus: [
      //         {
      //           label: 'MediaFiliación',
      //           componentLink: 'detdacti-cons',
      //           isSelected: false
      //         },
      //         {
      //           label: 'Registro Objetos Personales',
      //           componentLink: 'detregistro-cons',
      //           isSelected: false
      //         }
      //       ]
      //     },
        ];
      }
    }
  }

  setSel(obj: any) {
    // Reset all items
    for (let i of this.menu) {
      for (let j of i.submenus) {
        j.isSelected = false;
      }
    }

    obj.isSelected = true;
    this.router.navigate([obj.componentLink]);
  }
}
