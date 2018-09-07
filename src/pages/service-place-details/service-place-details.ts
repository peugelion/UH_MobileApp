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

  //sp: Promise<any>;

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

  // loadServicePlace() {
  //   return new Promise((resolve, reject) => {
  //     this.oauth.getOAuthCredentials().then( oauth => ((oauth.isSF) ? this.loadServicePlace_SF() : this.loadServicePlace_Strapi()) )
  //   });
  // }
  async loadServicePlace() {
    const oauth = await this.oauth.getOAuthCredentials();
    //return await (oauth.isSF) ? this.loadServicePlace_SF(oauth) : this.loadServicePlace_Strapi(oauth);
    ( (oauth.isSF) ? this.fetchData(oauth) : this.fetchData_Strapi(oauth) )
    .then( sp => {      //console.log("sp main", sp);
      this.name = sp["Name"];
      this.tel  = sp["UH__Phone__c"];
      this.addr = sp["UH__Address__c"];      //console.log("this.addr", this.addr);
      this.lat  = sp["UH__position__Latitude__s"];
      this.lng  = sp["UH__position__Longitude__s"];
      this.accountId = sp["UH__Account__c"];
    });
    return this.sp;
  }
  
  async fetchData(oauth) {
    const service = await DataService.createInstance(oauth, {useProxy:false});
    //this.sp          = await this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, '');
    let cityPromise    = await this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, 'UH__City__r');
    let countryPromise = await this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, 'UH__City__r/UH__Country__r');
    try {
      this.contact = await this.soService.getSobject(service, 'UH__ServicePlace__c', this.Id, 'UH__Contact__r');      //console.log(this.contact);
    } catch(e) {
      this.contact = null
    }
    this.cityName     = await cityPromise["Name"];
    this.countryName  = await countryPromise["Name"];
    return await service.apexrest("/services/data/v37.0/sobjects/UH__ServicePlace__c/"+this.Id);
  }
  async fetchData_Strapi(oauth) {
    let spPromise = await oauth.strapi.getEntry('serviceplace', this.Id);  //console.log("spPromise", spPromise);
    this.contact  = await spPromise["UH__Contact__r"];                     //console.log("this.contact strapi", this.contact);
    this.cityName     = "Belgrade" // TODO //this.cityName     = await cityPromise["Name"];
    this.countryName  = "Serbia";  // TODO //this.countryName  = await countryPromise["Name"];    
    return await spPromise;
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

  async getRelatedData() {
    let oauth = await this.oauth.getOAuthCredentials();
    let whereCond: string = `WHERE UH__ServicePlace__c = '${this.Id}'`;
    let relatedWOs = await this.relDataService.getRelatedWOs(oauth, whereCond);  console.log("relatedWOs", relatedWOs);
    this.relatedData.push({"name": "Workorders", "elements": relatedWOs, "size": relatedWOs.length});
    let relatedPIPs = await this.relDataService.getRelatedPIPs(oauth, this.Id);
    this.relatedData.push({"name": "Products in Place", "elements": relatedPIPs, "size": relatedPIPs.length});
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