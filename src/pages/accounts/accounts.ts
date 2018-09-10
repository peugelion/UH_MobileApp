import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { DataService } from 'forcejs';

@IonicPage({
  segment: 'accounts'
})
@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html',
})
export class AccountsPage {

  listLabel: string;
  accounts: Array<{
    Id: string,
    Name: string,
    Type: string,
    Phone: string,
    Fax: string,
    Website: string,
    UH__NumberofLocations__c: string,
    UH__preferredTech__c: string, 
    UH__preferredTech__r: object }>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private oauth: OAuthServiceProvider,
    private loadingCtrl: LoadingController) {}

    async showListAccounts(listName: string) {
      let selectCond: string = '';
      switch(listName) {
        case 'Recently Viewed':
          selectCond = "WHERE LastViewedDate >= LAST_WEEK AND LastViewedDate <= THIS_WEEK"; 
          break;
        case 'New Last Week':
          selectCond = "WHERE CreatedDate = LAST_WEEK"; 
          break;
        case 'New This Week':
          selectCond = "WHERE CreatedDate = THIS_WEEK"; 
          break;
        default: break;
      }
      let oauth = await this.oauth.getOAuthCredentials();
      if (oauth.isSF) {
        let service = DataService.createInstance(oauth, {useProxy:false});
        service.query(`SELECT Id, Name, Type, Phone, Fax, Website, UH__NumberofLocations__c, UH__preferredTech__c, UH__preferredTech__r.Name
                        FROM Account ${selectCond}`)
        .then(result => {
            this.accounts = result.records;
            this.listLabel = listName;
          });
      } else {
        console.log("TODO accounts");
      }
    }
  
    gotoRecord(event: any, page: string, id: string, url: string): void {
      event.stopPropagation();
      this.navCtrl.push(page, {"id": id, "url": url});
    }
  
    async ionViewDidLoad() {
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Loading, please wait...'
      });
      loading.present();
      await this.showListAccounts('Recently Viewed');
      loading.dismiss();
    }
}
