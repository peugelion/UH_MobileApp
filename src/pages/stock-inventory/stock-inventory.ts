import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  segment: 'stockInventory'
})
@Component({
  selector: 'page-stock-inventory',
  templateUrl: 'stock-inventory.html',
})
export class StockInventoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {}

}
