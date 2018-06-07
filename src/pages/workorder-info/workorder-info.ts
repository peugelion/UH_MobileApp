import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'workorder-info',
  templateUrl: 'workorder-info.html',
})
export class WorkorderInfoPage {
  @Input() workorder: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkorderInfoPage');
  }

}