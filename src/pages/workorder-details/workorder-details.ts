import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { WorkordersServiceProvider } from '../../providers/workorders-service/workorders-service';

@IonicPage()
@Component({
  selector: 'page-workorder-details',
  templateUrl: 'workorder-details.html',
})
export class WorkorderDetailsPage {

  tab: string = "details";
  currWO: any;
  woParts: any;
  woExpenses: any;
  woLabors: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private oauth : OAuthServiceProvider, private woService: WorkordersServiceProvider) {
  }

  ionViewDidLoad() {
    this.getWODetails(this.navParams.data['woId']);
  }

  getWODetails(woID) {
    this.oauth.getOAuthCredentials()
      .then(oauth => {
        this.woService.getWODetails(oauth, woID)
          .then(result => {
            console.log("result = ", result);
            this.currWO = result.currWO;
            this.woParts = result.woParts;
            this.woExpenses = result.woExpenses;
            this.woLabors = result.woLabors;
          });
      });
  }
}