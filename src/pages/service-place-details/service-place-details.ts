import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { SobjectServiceProvider } from '../../providers/sobject-service/sobject-service';
import { ServicePlacesServiceProvider } from '../../providers/service-places-service/service-places-service';
import { DataService } from 'forcejs';
import { MapComponent } from '../../components/map/map';

/**
 * Generated class for the ServicePlaceDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage({
  segment: 'ServicePlace/:spId',                 // https://ionicframework.com/docs/api/navigation/IonicPage/
  //defaultHistory: ['sp-list']
  //defaultHistory: ['ServicePlaceDetailsPage']
})
@Component({
  selector: 'page-service-place-details',
  templateUrl: 'service-place-details.html',
})

export class ServicePlaceDetailsPage implements AfterViewInit {

  toptabs: string = "details";

  Id: string;
  sp: {
    // "Name"  : string,
    // "UH__position__Latitude__s"  : string,
    // "UH__position__Longitude__s" : string,
    // "UH__Address__c" : string,
  };
  
  spPromise: Promise<any>;

  name: string;
  tel: string;
  addr: string;
  lat: string;
  lng: string;

  contact: {};
  city: {};

  //map;

  // RELATED TAB
  //WOs; pips; AOs; AHs; NandAs: {}
  WOs: Array<any>; PIPs: Array<any>;
  woLabels = [];
  PIPsLabels = [];
  active: number = -1 // (click) WOs or PIPs: 0 or 1
  //activeObj: {}

  asd;
  @ViewChild(MapComponent) mapCmp;

  constructor(public navCtrl: NavController, public navParams: NavParams, private oauth : OAuthServiceProvider, private soService: SobjectServiceProvider, private spService: ServicePlacesServiceProvider) {
    this.Id = this.navParams.data['spId']
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit - this.map", this.mapCmp);
  }

  // ionViewDidLoad() {
  //   this.loadServicePlace();
  // }
  ngOnInit() {
    this.loadServicePlace();
  }

  loadServicePlace() {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthCredentials().
        then(oauth => {

          let service = DataService.createInstance(oauth, {useProxy:false});

          this.spPromise      = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, '');
          let cityPromise     = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, 'UH__City__r');
          let contactPromise  = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, 'UH__Contact__r');

          this.spPromise.
            then(r => {
              console.log(" spPromise resolve : ", r);

              this.tel  = r["UH__Phone__c"];
              this.name = r["Name"];
              this.addr = r["UH__Address__c"];
              this.lat  = r["UH__position__Latitude__s"];
              this.lng  = r["UH__position__Longitude__s"];

              //this.initmap();
              //this.map.initmap();
              //let map = MapComponent.initmap(oauth, {useProxy:false});

              // window.setTimeout(
              //   function(){
              //     this.mapCmp.initmap();
              //   }.bind(this), 0
              // );

              resolve(r);   // !!!
            });

          cityPromise.
            then(r => {
              // console.log(" cityDeptPromise resolve : ", r);
              this.city = r;
            });

          contactPromise.
            then(r => {
              // console.log(" contactPromise resolve : ", r);
              this.contact = r;
            }).
            catch( reason => {
              console.error( 'contactPromise: onRejected function called: ', reason );
              this.contact = null;
            });

      });
    });
  }



  onSegmentChanged(toptabs) {
    (this.toptabs == "details") ? this.loadServicePlace() : this.loadRelated();
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

          let wosPromise  = this.spService.getRelatedWOs(service, this.Id);
          let pipsPromise = this.spService.getRelated(service, this.Id, 'UH__ProductInPlace__c');

          wosPromise.
            then(r => {
              console.log(" wosPromise resolve : ", r);
              this.WOs = r;

              let tmpArr = [];
              r.forEach(item => {
                console.log("el", item);
                let tmp = [];
                // tmp["Product in Place"]          = item["UH__productInPlace__r"] ? item["UH__productInPlace__r"]["Name"] : null
                // tmp["Description"]               = item["UH__Description__c"]
                // tmp["Estimated completion date"] = item["UH__Deadline__c"]
                // tmp["Status"]                    = item["UH__Status__c"]
                
                tmp.push( item["UH__productInPlace__r"] ? item["UH__productInPlace__r"]["Name"] : null );
                tmp.push( item["UH__Description__c"] );
                tmp.push( item["UH__Deadline__c"] );
                tmp.push( item["UH__Status__c"] );
                tmpArr.push(tmp);
              });

              this.WOs = tmpArr;
              this.woLabels = ["Product in Place", "Description", "Estimated completion date", "Status"];

              console.log("     this.tmpArr", tmpArr);

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