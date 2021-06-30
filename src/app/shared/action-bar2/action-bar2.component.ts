import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActionBarItemModel, ActionBarModel} from './action-bar-model';

@Component({
  selector: 'app-action-bar2',
  templateUrl: './action-bar2.component.html',
  styleUrls: ['./action-bar2.component.scss']
})
export class ActionBar2Component implements OnInit {
  @Input() titles: Array<string> = [];
  @Input() showActions: Array<number>;
  @Output() actionClicked: EventEmitter<ActionBarItemModel> = new EventEmitter<ActionBarItemModel>();

  abm: ActionBarModel = new ActionBarModel();

  constructor() {
  }

  ngOnInit() {
    this.setActions(this.showActions);
  }

  onActionClicked(item) {
    this.actionClicked.emit(item);
  }

  setActions(actions: Array<number>) {
    let newAbm = new ActionBarModel();
    // console.log(this.abm.actions);
    if (actions) {
      actions.forEach(item => {
        console.log(item);
        console.log(newAbm.getById(item));
        newAbm.getById(item).show = true;
      });
    }
    this.abm = newAbm;
  }

  setShowActions(data) {
    this.showActions = data;
    this.setActions(this.showActions);
  }

}
