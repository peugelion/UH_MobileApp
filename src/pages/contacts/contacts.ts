import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { DataService } from 'forcejs';

@IonicPage()
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

  showListContacts(listName: string) : void {
    let selectCond: string = '';
    switch(listName) {
      case 'All Contacts without email':
        selectCond = "WHERE Email = '' OR Email = NULL"; 
        break;
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
    this.oauth.getOAuthCredentials().
      then(oauth => {
        let loading = this.loadingCtrl.create({
          spinner: 'bubbles',
          content: 'Loading, please wait...'
        });
        loading.present();
        let service = DataService.createInstance(oauth, {useProxy:false});
        service.query(`SELECT Id, Name, Title, Phone, MobilePhone, Email, Account.Name
                       FROM Contact ${selectCond}`)
        .then(result => {
            this.contacts = result.records;
            this.listLabel = listName;
            loading.dismiss();
          });
      });
  }

  gotoRecord(event: any, page: string, id: string, url: string): void {
    event.stopPropagation();
    this.navCtrl.push(page, {"id": id, "url": url});
  }

  ionViewDidLoad() {
    this.showListContacts('Recently Viewed');
  }

}