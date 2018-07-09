import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { RelatedListsDataProvider } from '../../providers/related-lists-data/related-lists-data';
import { DataService } from 'forcejs';

@IonicPage({
  segment: 'account/:id'
})
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  tab: string = "details";
  private id: string;
  private account: any;
  relatedData: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private oauth : OAuthServiceProvider,
    private relDataService: RelatedListsDataProvider) 
  {
    let accountUrl = this.navParams.data['url'];
    this.id = this.navParams.data['id'];

    this.getAccountDetails(accountUrl);
    this.getRelatedData();
  }

  getAccountDetails(accountUrl: string) {
    this.oauth.getOAuthCredentials()
      .then(oauth => DataService.createInstance(oauth, {useProxy:false}).apexrest(accountUrl))
      .then(result => {
        this.account = result;
      });
  }

  getRelatedData() {
    this.oauth.getOAuthCredentials().then(oauth => {
      let whereCond: string = `WHERE AccountId = '${this.id}'`;
      this.relDataService.getRelatedCases(oauth, whereCond).then(result => { this.relatedData.push({"name": "Cases", "elements": result.records, "size": result.records.length}); });
      this.relDataService.getRelatedContacts(oauth, whereCond).then(result => { this.relatedData.push({"name": "Contacts", "elements": result.records, "size": result.records.length}); });
      whereCond =  `WHERE UH__Account__c = '${this.id}'`;
      this.relDataService.getRelatedSP(oauth, whereCond).then(result => { this.relatedData.push({"name": "Service Places", "elements": result.records, "size": result.records.length}); });
    }); 
  }
}
