import { Component, ViewChild, Input } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DataService } from 'forcejs';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { WorkordersServiceProvider } from '../../providers/workorders-service/workorders-service';
import { SobjectServiceProvider } from '../../providers/sobject-service/sobject-service';

import { ActionSheetController } from 'ionic-angular'

declare var $Lightning:any;
declare var $A:any;

// @IonicPage({
//   name: 'HomePage',
//   segment: '#'
// })
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  @ViewChild('deptStock') deptStock;

  workOrders : any;
  oauthCreds : any; 

  techLat: string;
  techLng: string;

  //@Input()
  //userId: string; // loggedin user: map componnet input(to fetch technician -> wos -> nearby service places)

  constructor(
    private woService: WorkordersServiceProvider,
    public navCtrl: NavController,
    private oauth : OAuthServiceProvider,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    private soService: SobjectServiceProvider) {}

  initPage(){
    this.oauth.getOAuthCredentials().
      then((oauth) => {
        this.initMap(oauth);
        this.deptStock.getWarehouseAndStock();
        this.showListWOs(oauth);
        this.loadLtngApp(oauth.accessToken);
      });
  }



  initMap(oauth) {

    let service = DataService.createInstance(oauth, {useProxy:false});
    //console.log("oauth", oauth, oauth["userId"]);
    //console.log("loadWOsSPs", this.loadWOsSPs(oauth) );

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( position => {
        //console.log("position", position, position.coords.latitude, position.coords.longitude);
        this.techLat = position.coords.latitude.toString();
        this.techLng = position.coords.longitude.toString();
        //console.log(this.techLat, this.techLng, this);
      });
    } else {
      alert('Geolocation is not supported.');
    }
  }

  showListWOs(oauth) {
    let selectCond = 'WHERE UH__startTime__c = LAST_WEEK OR UH__startTime__c = THIS_WEEK';
    this.woService.showListWOs(oauth, selectCond)
      .then(results => {
        this.workOrders = results.records;
      });
  }
  
  // https://blog.ionicframework.com/pull-to-refresh-directive/
  doRefresh(refresher) {
    this.oauth.getOAuthCredentials().
      then((oauth) => {
        this.showListWOs(oauth);
        refresher.complete();
      });
  }

  loadLtngApp(accessToken) {
    $Lightning.use(
      "c:LtngOutDependencyApp",
      this.createLtngCmps,
      "https://simple-urbanhawks.lightning.force.com",
      accessToken
    );
  }

  createLtngCmps() {
    if (!document.getElementById('mapComponent')) {
      console.log('  #mapComponent || #myWarehouseDiv missing, prekini ucitavanje LtngCmps za homepage');
      return;
    }

    // $Lightning.createComponent(
    //   "c:showMyWarehouses",
    //   {},
    //   "myWarehouseDiv", // this.myWarehouse.nativeElement
    //   function(component) {
    //     console.log("Added component = ", component);
    //     console.log("component attr = ", component.get("v.stockUnits"));
    //     console.log("is defined v.stockUnits = ", $A.util.isUndefined(component.get("v.stockUnits")));
    //   }
    // );

    $Lightning.createComponent(
      "c:smallWosMapLightening",
      {},
      "mapComponent",
      function(component) {}
    );
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      enableBackdropDismiss: true,
      cssClass: '.action-sheets-basic-page',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'Share',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'File',
          icon: !this.platform.is('ios') ? 'paper' : null,
          handler: () => {
            console.log('Play clicked');
          }
        },
        {
          text: 'Favorite',
          icon: !this.platform.is('ios') ? 'heart-outline' : null,
          handler: () => {
            console.log('Favorite clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  ionViewDidLoad() {
    this.initPage();
  }

  gotoWO(woId) {
    this.navCtrl.push('WorkorderDetailsPage', {"id": woId});
  }
}