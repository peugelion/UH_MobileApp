import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { WorkordersServiceProvider } from '../../providers/workorders-service/workorders-service';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';

@IonicPage({
  segment: 'workorders'
})
@Component({
  selector: 'page-workorders',
  templateUrl: 'workorders.html',
})
export class WorkordersPage {

  listLabel: string;
  //workorders: Array<{Id: string, Name: string, UH__Status__c: string, UH__ServicePlace__r: object, UH__productInPlace__r: object, UH__Description__c:string, UH__Deadline__c: string}>;
  workorders: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private oauth: OAuthServiceProvider, private woService: WorkordersServiceProvider, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.showListWOs('Recently assigned WOs');
  }

  // async loadWOs() {
  //   let oauth = await this.oauth.getOAuthCredentials();
  //   this.workorders = this.woService.loadWOs(oauth);
  //   this.workorders = this.workorders.records;
  // }

  async showListWOs(listName: string) {
    let selectCond: string = '';
    switch(listName) {
      case 'Recently assigned WOs': 
        selectCond = "WHERE UH__Status__c <> 'Reject' AND (UH__startTime__c = LAST_WEEK OR UH__startTime__c = THIS_WEEK)"; 
        break;
      case 'All opened workorders': 
        selectCond = "WHERE UH__Status__c = 'Opened'"; 
        break;
      case 'Todays workorders':
        selectCond = "WHERE UH__startTime__c = TODAY AND UH__Status__c <> 'Reject'"; 
        break;
      default: selectCond = "WHERE UH__Status__c <> 'Reject'";
    }
    let oauth = await this.oauth.getOAuthCredentials();
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading, please wait...'
    });
    loading.present();
    console.log("selectCond", selectCond);
    this.workorders = await this.woService.showListWOs(oauth, selectCond);
    console.log("showListWOs results", this.workorders);
    this.listLabel = listName;
    loading.dismiss();
  }
}