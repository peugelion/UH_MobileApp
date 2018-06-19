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

  map;

  // RELATED TAB
  //WOs; pips; AOs; AHs; NandAs: {}
  WOs; PIPs: {}
  active: number = -1 // (click) WOs or PIPs: 0 or 1
  //activeObj: {}


  constructor(public navCtrl: NavController, public navParams: NavParams, private oauth : OAuthServiceProvider, private soService: SobjectServiceProvider, private spService: ServicePlacesServiceProvider) {
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

  // BEGIN map

  initmap() {
    // fetch lat\lng from sp address, if no lat\lng is set
    if (!this.lat) {
      this.getLatLong().
        then(r => {
          console.log(" getLatLong resolve : ", r);
          this.lat = r["lat"];
          this.lng = r["lng"];
          this.drawmap();       //
        })
    } else {
      this.drawmap();           // 
    }
  }

  getLatLong(){
    return new Promise((resolve, reject) => {
      // this.spService.getLatLong("Bulevar umetnosti, 33, Novi Beograd").subscribe(
      this.spService.getLatLong(this.addr).subscribe(
        data => {
          let latLng = data["results"][0]["locations"][0]["latLng"]; // 1st out of all the results
          resolve(latLng);
        },
        err => console.error(err),
        //() => console.log('error loading lat/long')
      );
    });
  }

  drawmap() {

    //let map = this.map;
    //let plotlist;
    //let plotlayers=[];

    //console.log('lat, lng', this.lat, this.lng);
    
    // init map
    if (this.map) this.map.remove();   // tab reload fix
    this.map = new L.Map('map_sp');    // attach to 'map_sp' element

    // create the tile layer with correct attribution
    var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 9, maxZoom: 18, attribution: osmAttrib});		

    //this.map.setView(new L.LatLng(51.3, 0.7),9);
    this.map.setView(new L.LatLng(this.lat, this.lng), 16);
    this.map.addLayer(osm);

    
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
      .addTo(this.map)
      .bindPopup(popup);
  }
  // END map


  onSegmentChanged(toptabs) {
    if (toptabs === 'details') {
      window.setTimeout(
        this.drawmap.bind(this), 0
      );
    } else {
      this.loadRelated();
    }
  }

  doRefresh(refresher) {
    let reloadPromise = (this.toptabs == "details") ? this.loadServicePlace() : this.loadRelated();
    reloadPromise.
      then(r => {
        refresher.complete();
      });
  }


  // RELATED TAB/SEGMENT
  
  loadRelated() {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthCredentials().
        then(oauth => {

          let service = DataService.createInstance(oauth, {useProxy:false});

          let wosPromise  = this.spService.getRelated(service, this.Id, 'UH__WorkOrder__c');
          let pipsPromise = this.spService.getRelated(service, this.Id, 'UH__ProductInPlace__c');

          wosPromise.
            then(r => {
              console.log(" wosPromise resolve : ", r);
              this.WOs = r;
              resolve(r);
            });
          pipsPromise.
            then(r => {
              console.log(" pipPromise resolve : ", r);
              this.PIPs = r;
              resolve(r);
            });

            /* Attachment pokusaj (ContentDocument) */

            //this.spService.getRelated(service, '0691C000003yzzUQAQ', 'ContentDocument');
            // let xxPromise = this.soService.getSobject(service, 'ContentDocument', '0691C000003yzzUQAQ', '');
            // xxPromise.
            // then(r => {
            //   console.log(" xxPromise resolve : ", r);
            //   resolve(r);
            // });

      });
    });
  }

  toggleSection(i) {
    this.active = (this.active != i) ?  i : -1; // WO (0), PiP (1), or none (-1)
  }

  gotoItemPage(itemId) {
    if (this.active) // 1 or 0 (pip or wo)
      this.navCtrl.push('ProductInPlaceDetailsPage', {"id": itemId});
    else
      this.navCtrl.push('WorkorderDetailsPage', {"woId": itemId});
  }

}