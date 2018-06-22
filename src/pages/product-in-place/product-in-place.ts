import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProductInPlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'product-in-place',
  templateUrl: 'product-in-place.html',
})
export class ProductInPlacePage {
  tab: string = "details";
  private recordObj: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.recordObj = this.navParams.data['recordObj'];
  }

  ionViewDidLoad() {
    console.log("recordObj === ", this.navParams.data['recordObj']);
  }
}
