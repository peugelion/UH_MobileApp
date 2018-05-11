import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TechniciansServiceProvider } from '../../providers/technicians-service/technicians-service';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';

/**
 * Generated class for the SingleTechnicianPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-single-technician',
  templateUrl: 'single-technician.html',
})
export class SingleTechnicianPage {
  Id: string;
  technician: {
    Id: string,
    Name: any,
    Active: boolean,
    User: any,
    UH__username__c: any
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private techService: TechniciansServiceProvider, private oauth : OAuthServiceProvider) {
    this.Id = navParams.get("Id");
  }

  ionViewDidLoad(id) {
    console.log('ionViewDidLoad SingleTechnicianPage');
    this.loadTechnician();
  }

  loadTechnician() {
    this.oauth.getOAuthCredentials().
      then(oauth => {
        console.log("uso ... id: " +this.Id);
        this.techService.getTechnicianById(oauth, this.Id)
          .then(results => {
            console.log("results");
            console.log(results);
            this.technician = results.records[0];
            console.log("this.technician");
            console.log(this.technician);
            console.log(this.Id);
          });
      });
  }

}
