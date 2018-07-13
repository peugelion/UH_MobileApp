import { Component, /*ViewChild,*/ AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { SobjectServiceProvider } from '../../providers/sobject-service/sobject-service';
import { ServicePlacesServiceProvider } from '../../providers/service-places-service/service-places-service';
import { DataService } from 'forcejs';
//import { MapComponent } from '../../components/map/map';
import { WorkorderFormComponent } from '../../components/workorder-form/workorder-form';
import { RelatedListsDataProvider } from '../../providers/related-lists-data/related-lists-data';

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
  sp: {};

  //spPromise: Promise<any>;

  name: string;
  tel: string;
  addr: string;
  lat: string;
  lng: string;
  accountId: string;

  cityName: string;
  countryName: string;
  contact: {};

  // RELATED TAB
  relatedData: Array<any> = [];

  //@ViewChild(MapComponent) mapCmp;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private oauth : OAuthServiceProvider,
    private soService: SobjectServiceProvider,
    private spService: ServicePlacesServiceProvider,
    public modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private relDataService: RelatedListsDataProvider
  ) {
    this.Id = this.navParams.data['id']
  }

  ngAfterViewInit() {
    //console.log("ngAfterViewInit - this.map", this.mapCmp);
  }
  ionViewDidLoad() {}
  ngOnInit() {
    this.loadServicePlace()
      .then(r => console.dir(this));
    this.getRelatedData();
  }

  // onSegmentChanged() {
  //   if (this.toptabs != "details" && !this.relatedData.length)
  //     this.loadRelated();
  // }

  // doRefresh(refresher) {
  //   ((this.toptabs == "details") ? this.loadServicePlace() : this.loadRelated())
  //     .then(r => refresher.complete());
  // }

  doRefresh(refresher) {
    if (this.toptabs == "details") this.loadServicePlace()
      .then(r => refresher.complete());
  }

  // DETAILS TAB

  loadServicePlace() {
    return new Promise((resolve, reject) => 

      this.oauth.getOAuthCredentials()
      .then( oauth => DataService.createInstance(oauth, {useProxy:false}) )
      .then( service => {
        let spPromise       = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, '');
        let cityPromise     = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, 'UH__City__r');
        let countryPromise  = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, 'UH__City__r/UH__Country__r');
        let contactPromise  = this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, 'UH__Contact__r');

        spPromise.then(r => {
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
        cityPromise.then( r => this.cityName = r["Name"] );
        countryPromise.then( r => this.countryName = r["Name"] );
        contactPromise.then( r => this.contact = r, err => this.contact = null )
        //.catch( r => this.contact = null );
      })

    );
  }

  // RELATED TAB

  // loadRelated() {
  //   return new Promise((resolve, reject) =>
  //     this.oauth.getOAuthCredentials()
  //     .then( oauth => DataService.createInstance(oauth, {useProxy:false}) )
  //     .then( service => {
  //       this.spService.getRelatedWOs(service, this.Id).then( r => this.relatedData[0] = r );
  //       this.spService.getRelatedPiPs(service, this.Id).then( r => this.relatedData[1] = r );
  //       resolve(this.relatedData); //console.log("relatedArr", this.relatedArr);
  //     })
  //   );
  // }

  getRelatedData() {
    this.oauth.getOAuthCredentials().then(oauth => {
      let whereCond: string = `WHERE UH__ServicePlace__c = '${this.Id}'`;
      this.relDataService.getRelatedWOs(oauth, whereCond).then(result => { this.relatedData.push({"name": "Workorders", "elements": result.records, "size": result.records.length}); });
      this.relDataService.getRelatedPIPs(oauth, whereCond).then(result => { this.relatedData.push({"name": "Products in Place", "elements": result.records, "size": result.records.length}); });
    }); 
  }

  // FOOTER ACTIONS

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
        this.navCtrl.push('WorkorderDetailsPage', {id: data.woId});
      }
    });
    createWOModal.present();
  }

}