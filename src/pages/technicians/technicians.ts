import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TechniciansServiceProvider } from '../../providers/technicians-service/technicians-service';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private techService: TechniciansServiceProvider, private oauth : OAuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TechniciansPage');
    this.loadTechnicians();
  }

  loadTechnicians() {
    this.oauth.getOAuthCredentials().
      then(oauth => {
        this.techService.loadTechnicians(oauth)
          .then(results => {
            console.log(results);
            this.technicians = results.records;
          });
      });
  }
}
