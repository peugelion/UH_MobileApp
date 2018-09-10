import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { DataService } from 'forcejs';

@IonicPage({
  segment: 'contacts'
})
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  listLabel: string;
  contacts: Array<{Id: string, Name: string, Title: string, Phone: string, Email: string, AccountId: object}>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private oauth: OAuthServiceProvider,
    private loadingCtrl: LoadingController) {}

  async showListContacts(listName: string) {
    let oauth = await this.oauth.getOAuthCredentials();
    let selectCond;
    switch(listName) {
      case 'All Contacts without email':
        selectCond = (oauth.isSF) ? "WHERE Email = '' OR Email = NULL" : {Email_ne:null}; 
        break;
      case 'Recently Viewed':
        selectCond = (oauth.isSF) ? "WHERE LastViewedDate >= LAST_WEEK AND LastViewedDate <= THIS_WEEK": {}; // TODO localstorage recent views
        break;
      case 'New Last Week':
        let weekAgoDate = new Date(new Date().setDate(new Date().getDate() - 7) ).toISOString();
        let twoWeksAgoDate = new Date(new Date().setDate(new Date().getDate() - 14) ).toISOString();
        selectCond = (oauth.isSF) ? "WHERE CreatedDate = LAST_WEEK" : {createdAt_gte: weekAgoDate, createdAt_lt: twoWeksAgoDate}; 
        break;
      case 'New This Week':
        selectCond = (oauth.isSF) ? "WHERE CreatedDate = THIS_WEEK" : {createdAt_gte: new Date(new Date().setDate(new Date().getDate() - 7) ).toISOString()}; 
        break;
      default: break;
    }
    if (oauth.isSF) {
      let service = DataService.createInstance(oauth, {useProxy:false});
      let result = await service.query(`SELECT Id, Name, Title, Phone, MobilePhone, Email, AccountId, Account.Name
                        FROM Contact ${selectCond}`);
      this.contacts = result.records;
    } else {
        let weksAgoDate = new Date(new Date().setDate(new Date().getDate() - 7) ).toISOString();
      //let params = all ? {} : {_UH__startTime__c_gt: twoWeksAgoDate}
      this.contacts = await oauth.strapi.getEntries('contact', selectCond);   console.log("selectCond", selectCond)
    }
    this.listLabel = listName;
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
    await this.showListContacts('Recently Viewed');
    loading.dismiss();
  }

}