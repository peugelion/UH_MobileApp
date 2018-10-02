import { Component, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { ServicePlacesServiceProvider } from '../../providers/service-places-service/service-places-service';

/**
 * Generated class for the ServicePlacesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'ServicePlacesPage',
  segment: 'service-places'
})
@Component({
  selector: 'page-service-places',
  templateUrl: 'service-places.html',
})
export class ServicePlacesPage {

  toptabs: string = "details";

  listLabel: string;
  items: Array<{Id: string, Name: any}>; // service places
  filter: boolean;

  onItemClicked: EventEmitter<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private spService: ServicePlacesServiceProvider, private oauth : OAuthServiceProvider, private loadingCtrl: LoadingController) {}

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading, please wait...'
    });
    loading.present();
    this.loadSPs(false)   // load recent SPs
      .then(r => loading.dismiss())
      .then(r => console.dir(this));
  }

  doRefresh(refresher) {
    this.loadSPs(this.filter).
      then(refresher.complete())
  }

  async loadSPs(filter) {
    let oauth = await this.oauth.getOAuthCredentials();
    this.listLabel = (filter ? "All" : "Recently Viewed") + " Service Places";
    this.filter = filter;
    return this.items = await this.spService.loadServicePlaces(oauth, filter);
  }

  itemClicked(event: any, page: string, id: string): void {
    event.stopPropagation();
    if (page == "tel") 
      document.location.href="tel:"+id;
    else
      this.navCtrl.push(page, {id: id});
  }

  // gotoSP(spId) {
  //   this.navCtrl.push('ServicePlaceDetailsPage', {"id": spId});
  // }
}
