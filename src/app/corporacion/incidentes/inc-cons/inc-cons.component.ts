import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {StdGrid2Component} from '../../../shared/std-grid2/std-grid2.component';
import {Router} from '@angular/router';
import {IncidenteEvents, IncService} from '../inc.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-inc-cons',
  templateUrl: './inc-cons.component.html',
  styleUrls: ['./inc-cons.component.scss']
})
export class IncConsComponent implements OnInit, OnDestroy, AfterViewInit {
  // Grid Acciones ================================================
  @ViewChild('grid1', {static: false}) public  grid1: StdGrid2Component;
  grid1ColConfig = {
    edit: true,
    remove: true,
  };
  grid1SourceData = [];
  grid1ColDefs = [
    {headerName: 'Clave', field: 'cve'},
    {headerName: 'Incidente', field: 'incidente'},
    {headerName: 'Nombre corto', field: 'nomCort'},
    {headerName: 'descripcion', field: 'descripcion'}
  ];

  grid1EditRow($event) {
    const id = $event.data._id;
    this.router.navigate(['incidente-edit', id]);
  }
  grid1RemoveRow($event) {
    //
  }

  private subs: Subscription = new Subscription();

  constructor(
    private router: Router,
    private incSrv: IncService,
  ) {
    this.subs.add(
      this.incSrv.eventSource$.subscribe((data) => {
          this.dispatchEvents(data);
        }
      ));
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    setTimeout( ()=> {
      this.incSrv.getAll();
    }, 500);
  }

  onActualizar() {
    this.incSrv.getAll();
  }

  onNuevo() {
    this.router.navigate(['incidente-edit']);
  }

  // SERVICE EVENTS =======================================================================
  dispatchEvents(data) {
    console.log('dispatchEvents');
    //   Evento para el catáogo de Reportas
    if (data.event === IncidenteEvents.GetAll) {
      console.log(data);
      this.grid1.setDataSource(data.data);
    }
  }
}
