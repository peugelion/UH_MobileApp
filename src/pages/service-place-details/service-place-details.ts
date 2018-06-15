import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { SobjectServiceProvider } from '../../providers/sobject-service/sobject-service';
import { ServicePlacesServiceProvider } from '../../providers/service-places-service/service-places-service';
import { DataService } from 'forcejs';

/**
 * Generated class for the ServicePlaceDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var L:any;

@IonicPage({
  segment: 'ServicePlace/:spId',                 // https://ionicframework.com/docs/api/navigation/IonicPage/
  //defaultHistory: ['sp-list']
  //defaultHistory: ['ServicePlaceDetailsPage']
})
@Component({
  selector: 'page-service-place-details',
  templateUrl: 'service-place-details.html',
})

export class ServicePlaceDetailsPage {

  toptabs: string = "details";

  Id: string;
  sp: {
    // "Name"  : string,
    // "UH__position__Latitude__s"  : string,
    // "UH__position__Longitude__s" : string,
    // "UH__Address__c" : string,
  };
  tel: string;
  name: string;
  addr: string;
  lat: string;
  lng: string;

  contact: {};
  city: {};


  constructor(public navCtrl: NavController, public navParams: NavParams, private spService: ServicePlacesServiceProvider, private oauth : OAuthServiceProvider, private soService: SobjectServiceProvider) {
    this.Id = this.navParams.data['spId']
  }

  ionViewDidLoad() {
    this.loadServicePlace();
  }

  loadServicePlace() {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthCredentials().
        then(oauth => {

          let service = DataService.createInstance(oauth, {useProxy:false});

          let spPromise       = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, '');
          let cityPromise     = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, 'UH__City__r');
          let contactPromise  = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, 'UH__Contact__r');

          spPromise.
            then(r => {
              console.log(" spPromise resolve : ", r);
              //this.sp = r;

              this.tel  = r["UH__Phone__c"];
              this.name = r["Name"];
              this.addr = r["UH__Address__c"];
              this.lat  = r["UH__position__Latitude__s"];
              this.lng  = r["UH__position__Longitude__s"];

              this.initmap(); 
              resolve(r);   // !!!
            });

          cityPromise.
            then(r => {
              console.log(" cityDeptPromise resolve : ", r);
              this.city = r;
            });

          contactPromise.
            then(r => {
              console.log(" contactPromise resolve : ", r);
              this.contact = r;
            }).
            catch( reason => {
              console.error( 'contactPromise: onRejected function called: ', reason );
              this.contact = null;
            });

      });
    });
  }

  initmap() {
    // if no lat/lng is set, fetch from sp address
    if (!this.lat) {
      this.getLatLong().
        then(r => {
          console.log(" getLatLong resolve : ", r);
          this.lat = r["lat"];
          this.lng = r["lng"];
          this.drawmap();       //
        })
    } else {
      this.drawmap();       // 
    }
  }

  getLatLong(){
    return new Promise((resolve, reject) => {
      // this.spService.getLatLong("Bulevar umetnosti, 33, Novi Beograd").subscribe(
      this.spService.getLatLong(this.addr).subscribe(
        data => {
          let latLng = data["results"][0]["locations"][0]["latLng"];
          resolve(latLng);
        },
        err => console.error(err),
        //() => console.log('error loading lat/long')
      );
    });
  }

  drawmap() {

    let map;
    //let plotlist;
    //let plotlayers=[];

    console.log('lat, lng', this.lat, this.lng);


    document.getElementById('map_sp');
    // set up the map
    if (map) map.remove(); // tab reload fix
    //if (this.map) this.map = null;
    map = new L.Map('map_sp');

    // create the tile layer with correct attribution
    var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 9, maxZoom: 18, attribution: osmAttrib});		

    //this.map.setView(new L.LatLng(51.3, 0.7),9);
    map.setView(new L.LatLng(this.lat, this.lng), 16);
    map.addLayer(osm);

    
    // marker - ikonica
    var popupContent = '<div class="spPopupContent"><h2>'+name+'</h2> <br />'+this.addr+'</div>';
    var popup = L.popup()
      .setLatLng([this.lat, this.lng])
      .setContent(popupContent);
    
    var spIcon = L.icon({
        // iconUrl: "/resource/1500293185000/uh__jsAndStyles/images/mapPinStar.png",
        iconUrl: "https://unpkg.com/leaflet@1.3.1/dist/images/marker-icon.png",
        iconSize: [25,41],
        iconAnchor: [15,35],
        popupAnchor: [0,-18]
    });
    //let spMarker = L.marker([lat, lng], {riseOnHover:true, riseOffset: 30, icon: spIcon})
    L.marker([this.lat, this.lng], {riseOnHover:true, riseOffset: 30, icon: spIcon})
      .addTo(map)
      .bindPopup(popup);
  }

  onSegmentChanged(toptabs) {
    if (toptabs === 'details') {
      window.setTimeout(
        this.drawmap.bind(this), 0
      );
    }
  }

  doRefresh(refresher) {
    this.loadServicePlace().
      then(r => {
        refresher.complete();
      })
  }

}