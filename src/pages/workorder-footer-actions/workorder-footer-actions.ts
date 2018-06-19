import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';

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
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform) 
  {
    this.onActionDispatch = new EventEmitter();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkorderFooterActionsPage');
  }

  dispatchAction(actionName) {
    this.onActionDispatch.emit(actionName);
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: true,
      cssClass: '.action-sheets-basic-page',
      buttons: [
        {
          text: 'WO report',
          icon: !this.platform.is('ios') ? 'pie' : null,
          handler: () => {
            this.dispatchAction('woReport');
          }
        },
        {
          text: 'Print invoice',
          icon: !this.platform.is('ios') ? 'print' : null,
          handler: () => {
            this.dispatchAction('printInvoice');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }
}
