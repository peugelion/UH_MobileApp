import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the WorkorderFooterActionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'workorder-footer-actions',
  templateUrl: 'workorder-footer-actions.html',
})
export class WorkorderFooterActionsPage {
  @Input() woStatus: string;
  @Output() onActionDispatch: EventEmitter<string>;

  // button colors
  addExpanseColor: string = '#37474F';
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.onActionDispatch = new EventEmitter();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkorderFooterActionsPage');
  }

  dispatchAction(actionName) {
    this.onActionDispatch.emit(actionName);
  }
}
