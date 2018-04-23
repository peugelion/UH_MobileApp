import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TechniciansServiceProvider } from '../../providers/technicians-service/technicians-service';
/**
 * Generated class for the TechniciansPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-technicians',
  templateUrl: 'technicians.html',
})
export class TechniciansPage {
  technicians: Array<{Id: string, Name: any}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private techService: TechniciansServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TechniciansPage');
    this.loadTechnicians();
  }

  loadTechnicians() {
    this.techService.loadTechnicians()
      .then(results => {
        console.log(results);
        this.technicians = results.records;
      });
  }
}
