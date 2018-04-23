import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OAuth, DataService } from 'forcejs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  workOrders: any;

  constructor(public navCtrl: NavController) {
    this.loadWOs();
  }

  loadWOs() {
    let oauth = OAuth.createInstance();
    oauth.login()
      .then(oauthResult => {
        let service = DataService.createInstance(oauthResult);
        service.query(
          `SELECT id, name, uh__status__c, uh__servicePlace__r.Name 
          FROM uh__workOrder__c limit 10`)
          .then(response => {
            this.workOrders = response.records;
          });
      });
  }

  // public showTechs() {
  //   this.navCtrl.push('TechniciansPage');
  // }
}
