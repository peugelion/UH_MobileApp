import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { WorkordersServiceProvider } from '../../providers/workorders-service/workorders-service';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';

/**
 * Generated class for the WorkordersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-workorders',
  templateUrl: 'workorders.html',
})
export class WorkordersPage {

  listLabel: string;
  workorders: Array<{Id: string, Name: string, UH__Status__c: string, UH__ServicePlace__r: object, UH__productInPlace__r: object, UH__Description__c:string, UH__Deadline__c: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private oauth: OAuthServiceProvider, private woService: WorkordersServiceProvider, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkordersPage');
    this.showListWOs('Recently assigned WOs');
  }

  loadWOs() {
    this.oauth.getOAuthCredentials().
      then(oauth => {
        this.woService.loadWOs(oauth)
          .then(results => {
            console.log(results);
            this.workorders = results.records;
          });
      });
  }

  showListWOs(listName) {
    let selectCond: string = '';
    switch(listName) {
      case 'Recently assigned WOs': 
        selectCond = 'WHERE UH__startTime__c = LAST_WEEK OR UH__startTime__c = THIS_WEEK'; 
        break;
      case 'All opened workorders': 
        selectCond = "WHERE UH__Status__c = 'Opened'"; 
        break;
      case 'Todays workorders':
        selectCond = 'WHERE UH__startTime__c = TODAY'; 
        break;
    }
    this.oauth.getOAuthCredentials().
      then(oauth => {
        let loading = this.loadingCtrl.create({
          spinner: 'bubbles',
          content: 'Loading, please wait...'
        });
        loading.present();
        this.woService.showListWOs(oauth, selectCond)
          .then(results => {
            console.log(results);
            this.workorders = results.records;
            this.listLabel = listName;
            loading.dismiss();
          });
      });
  }
}
