import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { RelatedListsDataProvider } from '../../providers/related-lists-data/related-lists-data';
import { DataService } from 'forcejs';

@IonicPage({
  segment: 'contact/:id'
})
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  tab: string = "details";
  private id: string;
  private contact: any;
  relatedData: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private oauth : OAuthServiceProvider,
    private relDataService: RelatedListsDataProvider) 
  {
    let contactUrl = this.navParams.data['url'];
    this.id = this.navParams.data['id'];

    this.getContactDetails(contactUrl);
    this.getRelatedData();
  }

  getContactDetails(contactUrl: string) {
    this.oauth.getOAuthCredentials()
      .then(oauth => DataService.createInstance(oauth, {useProxy:false}).apexrest(contactUrl))
      .then(result => {
        this.contact = result;
      });
  }

  getRelatedData() {
    this.oauth.getOAuthCredentials().then(oauth => {
      let whereCond: string = `WHERE ContactId = '${this.id}'`;
      this.relDataService.getRelatedCases(oauth, whereCond).then(result => { this.relatedData.push({"name": "Cases", "elements": result.records, "size": result.records.length}); });
      whereCond =  `WHERE UH__Contact__c = '${this.id}'`;
      this.relDataService.getRelatedWOs(oauth, whereCond).then(result => { this.relatedData.push({"name": "Workorders", "elements": result.records, "size": result.records.length}); });
    }); 
  }
}