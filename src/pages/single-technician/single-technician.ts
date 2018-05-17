import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TechniciansServiceProvider } from '../../providers/technicians-service/technicians-service';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
//import { PipeTransform, Pipe } from '@angular/core';

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

  toptabs: string = "details";

  Id: string;
  technician: {
    Id: string,
    Name: any,
    Active: boolean,
    UH__User__c: any,
    UH__username__c: any
  };

  //@Input dataObject;
  constructor(public navCtrl: NavController, public navParams: NavParams, private techService: TechniciansServiceProvider, private oauth : OAuthServiceProvider) {
    this.Id = navParams.get("Id");
  }

  ionViewDidLoad(id) {
    console.log('ionViewDidLoad SingleTechnicianPage');
    this.loadTechnician();
  }

  loadTechnician(){
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthCredentials().
        then(oauth => {
          this.techService.getTechnicianById(oauth, this.Id)
            .then(results => {
              console.log("results", results);
              this.technician = results.records[0];
              resolve(this.technician);
              console.log("this.technician id: ", this.Id, "this.technician obj : ", this.technician,);
            });
        });
    });
  }
  
  // https://blog.ionicframework.com/pull-to-refresh-directive/
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.loadTechnician().
      then(r => {
        console.log(" resolve ", r);
        refresher.complete();
        console.log(" refresher.complete ");
      })

    // setTimeout(() => {
      // console.log('Async operation has ended');
      // refresher.complete();
    // }, 2000);
  }

}
