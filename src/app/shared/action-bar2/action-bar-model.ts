
export enum barActions {
  save = 1,
  refresh = 2,
  new = 3,
  exit = 4,
  send = 5,
  check = 6,
  reject = 7,
  show = 8,
  report = 9,
  finish =10
}

export class ActionBarModel {
  save: boolean;
  refresh: boolean;
  new: boolean;
  exit: boolean;
  send: boolean;
  check: boolean;
  reject: boolean;
  show: boolean;
  report: boolean;
  finish: boolean;

  actions: ActionBarItemModel[] = [];

  constructor() {
    this.actions.push(new ActionBarItemModel({label: 'Guardar', iconName: 'save', id: barActions.save}));
    this.actions.push(new ActionBarItemModel({label: 'Actualizar', iconName: 'refresh', id: barActions.refresh}));
    this.actions.push(new ActionBarItemModel({label: 'Nuevo', iconName: 'add', id: barActions.new}));
    this.actions.push(new ActionBarItemModel({label: 'Salir', iconName: 'exit_to_app', id: barActions.exit}));
    this.actions.push(new ActionBarItemModel({label: 'Enviar', iconName: 'send', id: barActions.send}));
    this.actions.push(new ActionBarItemModel({label: 'Aprobar', iconName: 'check', id: barActions.check}));
    this.actions.push(new ActionBarItemModel({label: 'Rechazar', iconName: 'close', id: barActions.reject}));
    this.actions.push(new ActionBarItemModel({label: 'Generar PIN', iconName: 'inbox', id: barActions.show}));
    this.actions.push(new ActionBarItemModel({label: 'Reporte', iconName: 'assignment', id: barActions.report}));
    this.actions.push(new ActionBarItemModel({label: 'Finalizar', iconName: 'message', id: barActions.finish}));
  }

  getById(id: number): ActionBarItemModel {
    let response = null;
    this.actions.forEach(item => {
      if (item.id === id) {
        response = item;
      }
    });

    return response;
  }
}

export class ActionBarItemModel {
  label: string = '';
  iconName: string = '';
  id: number = 0;
  show: boolean = false;

  constructor(data: any) {
    Object.keys(this).forEach(key => {
      if (data.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    });
  }
}
