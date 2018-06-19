import { Component } from '@angular/core';
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
  segment: 'ServicePlaces/',
  //name: 'sp-list'
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private spService: ServicePlacesServiceProvider, private oauth : OAuthServiceProvider, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicePlacesPage');

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading, please wait...'
    });
    loading.present();
    this.loadSPs(false) // load recent SPs
    .then(r => {loading.dismiss()});
  }


  loadSPs(filter) {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthCredentials().
        then(oauth => {
          this.spService.loadServicePlaces(oauth, filter)   //
            .then(results => {
              console.log(results);
              this.items = results;
              this.listLabel = (filter ? "All" : "Recently Viewed") + " Service Places";
              this.filter = filter;
              resolve(this.items);
            });
        });
      });
  }

  gotoSP(spId) {
    //console.log("sp id : ", spId);
    this.navCtrl.push('ServicePlaceDetailsPage', {"spId": spId});
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.loadSPs(this.filter).
    // then(r => {      console.log(" refresher resolve : ", r);
    //   refresher.complete();
    // })
    then(refresher.complete())
  }
}
