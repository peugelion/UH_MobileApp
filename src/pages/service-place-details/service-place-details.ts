import { Component, /*ViewChild,*/ AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { SobjectServiceProvider } from '../../providers/sobject-service/sobject-service';
import { ServicePlacesServiceProvider } from '../../providers/service-places-service/service-places-service';
import { DataService } from 'forcejs';
import { MapComponent } from '../../components/map/map';
import { WorkorderFormComponent } from '../../components/workorder-form/workorder-form';

/**
 * Generated class for the ServicePlaceDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage({
  segment: 'sp/:id',                 // https://ionicframework.com/docs/api/navigation/IonicPage/
  defaultHistory: ['ServicePlacesPage']
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
  accountId: string;

  contact: {};
  //city: {};
  cityName: string;
  countryName: string;

  //map;

  // RELATED TAB
  labels = [];                  // labele
  clickPages = []               // click funkcije za otvaranje pojdinacne stavke... stringovi
  relatedArr: Array<any> = [];  // [ WOsArray, PIPsArray ] podaci, niz treceg reda


  //@ViewChild(MapComponent) mapCmp;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private oauth : OAuthServiceProvider,
    private soService: SobjectServiceProvider,
    private spService: ServicePlacesServiceProvider,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    this.Id = this.navParams.data['id']
  }

  ngAfterViewInit() {
    //console.log("ngAfterViewInit - this.map", this.mapCmp);
  }

  // ionViewDidLoad() {
  //   this.loadServicePlace();
  // }
  ngOnInit() {
    this.loadServicePlace();
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

  //

  loadServicePlace() {
    return new Promise((resolve, reject) => {

      this.oauth.getOAuthCredentials().
        then(oauth => {

          let service = DataService.createInstance(oauth, {useProxy:false});

          this.spPromise      = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, '');
          let cityPromise     = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, 'UH__City__r');
          let countryPromise  = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, 'UH__City__r/UH__Country__r');
          let contactPromise  = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, 'UH__Contact__r');

          this.spPromise.
            then(r => {
              //console.log(" spPromise resolve : ", r);
              this.tel  = r["UH__Phone__c"];
              this.name = r["Name"];
              this.addr = r["UH__Address__c"];
              this.lat  = r["UH__position__Latitude__s"];
              this.lng  = r["UH__position__Longitude__s"];
              this.accountId = r["UH__Account__c"];

              //this.map.initmap();

              resolve(r);   // !!!
            });

          cityPromise.then(r => {
            this.cityName = r["Name"];    //
          });
          countryPromise.then(r => {
            this.countryName = r["Name"]; //
          });

          contactPromise.then(r => {
            this.contact = r;             //
          }).catch( reason => {
            console.warn( 'contactPromise: onRejected function called: ', reason );
            this.contact = null;
          });

      });
    });
  }


  // RELATED TAB/SEGMENT
  
  loadRelated() {
    return new Promise((resolve, reject) => {

      this.labels = [
        [
          ['Work Orders', 'WorkorderDetailsPage'],
          ["Product in Place", "Description", "Estimated completion date", "Status"],
        ],
        [
          ['Products in Place', 'ProductInPlacePage'],
          ["Contact", "Product code", "Install Date"]
        ]
      ];

      this.oauth.getOAuthCredentials().
        then(oauth => {

          let service = DataService.createInstance(oauth, {useProxy:false});

          this.spService.getRelatedWOs(service, this.Id).
            then(r => {
              this.relatedArr[0] = r.map(item => (
                [
                  item["Id"],
                  item["Name"],
                  item["UH__productInPlace__r"] ? item["UH__productInPlace__r"]["Name"] : null,
                  item["UH__Description__c"],
                  item["UH__Deadline__c"],
                  item["UH__Status__c"]
                ]
              ));
            });

          this.spService.getRelatedPiPs(service, this.Id).
            then(r => {
              this.relatedArr[1] = r.map(item => (
                [
                  item["Id"],
                  item["Name"],
                  item["UH__Contact__r"] ? item["UH__Contact__r"]["Name"] : null,
                  item["UH__Description__c"],
                  item["UH__Product__r"]["ProductCode"]
                ]
              ));
            })

          resolve(this.relatedArr);

      });
    });
  }

  createWO(spId: string, spName: string, accountId: string): void {
    let createWOModal = this.modalCtrl.create(WorkorderFormComponent, { id: spId, spName: spName, accId: accountId });
    createWOModal.onDidDismiss(data => {
      if(!data.isCanceled) {
        // present the message from a addExpense modal
        let toast = this.toastCtrl.create({
          message: data.message,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    });
    createWOModal.present();
  }

}