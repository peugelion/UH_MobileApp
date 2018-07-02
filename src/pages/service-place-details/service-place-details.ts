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
  labels = [
    [
      ['Work Orders'],
      ["Product in Place", "Description", "Estimated completion date", "Status"],
    ],
    [
      ['Products in Place'],
      ["Contact", "Product code", "Install Date"]
    ]
  ];
  clickPages = ['WorkorderDetailsPage', 'ProductInPlacePage' ]
  //WOs; pips; AOs; AHs; NandAs: {}
  //WOs: Array<any>; PIPs: Array<any>;
  relatedArr: Array<any> = [];


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
              //console.log(" cityDeptPromise resolve : ", r);
              //this.city = r;
              this.cityName = r["Name"];
            });
          countryPromise.then(r => {
              //console.log(" countryPromise resolve : ", r);
              //this.city = r;
              this.countryName = r["Name"];
            });

          contactPromise.
            then(r => {
              // console.log(" contactPromise resolve : ", r);
              this.contact = r;
            }).
            catch( reason => {
              console.warn( 'contactPromise: onRejected function called: ', reason );
              this.contact = null;
            });

      });
    });
  }


  // RELATED TAB/SEGMENT
  
  loadRelated() {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthCredentials().
        then(oauth => {

          let service = DataService.createInstance(oauth, {useProxy:false});

          let wosPromise  = this.spService.getRelatedWOs(service, this.Id);
          //let pipsPromise = this.spService.getRelated(service, 'UH__ProductInPlace__c', this.Id);
          let pipsPromise = this.spService.getRelatedPiPs(service, this.Id);

          //let pipsPromise = this.soService.getSobject(service, 'UH__ProductInPlace__c', this.Id, '');

          wosPromise.
            then(r => {
              //console.log(" wosPromise resolve : ", r);

              let tmpArr = [];
              r.forEach(item => {
                //console.log("el", item);
                let tmp = [];
                // tmp["Product in Place"]          = item["UH__productInPlace__r"] ? item["UH__productInPlace__r"]["Name"] : null
                // tmp["Description"]               = item["UH__Description__c"]
                // tmp["Estimated completion date"] = item["UH__Deadline__c"]
                // tmp["Status"]                    = item["UH__Status__c"]
                
                tmp.push( item["Id"] );
                tmp.push( item["Name"] );

                tmp.push( item["UH__productInPlace__r"] ? item["UH__productInPlace__r"]["Name"] : null );
                tmp.push( item["UH__Description__c"] );
                tmp.push( item["UH__Deadline__c"] );
                tmp.push( item["UH__Status__c"] );
                tmpArr.push(tmp);
              });

              //this.WOs = tmpArr;
              this.relatedArr[0] = tmpArr;

              //resolve(r);
            });
          pipsPromise.
            then(r => {
              //console.log(" pipPromise resolve : ", r);
                
              let tmpArr = [];
              r.forEach(item => {
                //console.log("el", item);
                let tmp = [];
                
                tmp.push( item["Id"] );
                tmp.push( item["Name"] );

                tmp.push( item["UH__Contact__r"] ? item["UH__Contact__r"]["Name"] : null );
                tmp.push( item["UH__Product__r"]["ProductCode"] );
                
                tmpArr.push(tmp);

              });

              //this.PIPs = tmpArr;
              this.relatedArr[1] = tmpArr;
              
              //resolve(r);
            })

            /* Attachment pokusaj (ContentDocument) */

            //this.spService.getRelated(service, '0691C000003yzzUQAQ', 'ContentDocument');
            // let xxPromise = this.soService.getSobject(service, 'ContentDocument', '0691C000003yzzUQAQ', '');
            // xxPromise.
            // then(r => {
            //   console.log(" xxPromise resolve : ", r);
            //   resolve(r);
            // });

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

  // gotoItemPage(itemId) {
  //   if (this.active) // 1 or 0 (pip or wo)
  //     this.navCtrl.push('ProductInPlaceDetailsPage', {"id": itemId});
  //   else
  //     this.navCtrl.push('WorkorderDetailsPage', {"id": itemId});
  // }

}