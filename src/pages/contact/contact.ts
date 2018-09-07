import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { RelatedListsDataProvider } from '../../providers/related-lists-data/related-lists-data';
import { DataService } from 'forcejs';
import Strapi from 'strapi-sdk-javascript/build/main';

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

  async getContactDetails(contactUrl: string) {
    const oauth = await this.oauth.getOAuthCredentials();
    console.log("oauth contact page", oauth);
    return await (oauth.isSF) ? this.getContactDetails_SF(oauth, contactUrl) : this.getContactDetails_Strapi(oauth, contactUrl);
  }
  async getContactDetails_SF(oauth, contactUrl: string) {
    const service = await DataService.createInstance(oauth, {useProxy:false});
    this.contact = contactUrl ? await service.apexrest(contactUrl) : await service.apexrest("/services/data/v37.0/sobjects/Contact/"+this.id);
  }
  async getContactDetails_Strapi(oauth, contactUrl: string) {
    this.contact = await oauth.strapi.getEntry('contact', this.id);
  }

  async getRelatedData() {
    let oauth = await this.oauth.getOAuthCredentials();
    let whereCond: string = `WHERE ContactId = '${this.id}'`;
    this.relDataService.getRelatedCases(oauth, this.id).then(result => { this.relatedData.push({"name": "Cases", "elements": result.records, "size": result.records.length}); });
    whereCond =  `WHERE UH__Contact__c = '${this.id}'`;
    this.relDataService.getRelatedWOs(oauth, whereCond).then(result => { this.relatedData.push({"name": "Workorders", "elements": result.records, "size": result.records.length}); });
  }
}