import { Component, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DataService } from 'forcejs';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';

import { ActionSheetController } from 'ionic-angular'

declare var $Lightning:any;
declare var $A:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  @ViewChild('myWarehouse') myWarehouse: any;

  workOrders : any;
  oauthCreds : any; 

  constructor(public navCtrl: NavController, private oauth : OAuthServiceProvider, public actionSheetCtrl: ActionSheetController, public platform: Platform) {}

  initPage(){
    this.oauth.getOAuthCredentials().
      then((oauth) => {
        this.loadWOs(oauth);
        this.loadLtngApp(oauth.accessToken);
      });
  }

  loadWOs(oauth) {
    let service = DataService.createInstance(oauth, {useProxy:false});
    service.query(
      `SELECT id, name, uh__status__c, uh__servicePlace__r.Name, uh__productInPlace__r.Name, uh__description__c, UH__Deadline__c
      FROM uh__workOrder__c WHERE UH__startTime__c = LAST_WEEK OR UH__startTime__c = THIS_WEEK`)
      .then(response => {
        this.workOrders = response.records.map(wo => {
          let obj = {};
          obj["workorderName"] = wo.Name;
          obj["status"] = wo.UH__Status__c;
          obj["servicePlace"] = (wo.UH__ServicePlace__r) ? wo.UH__ServicePlace__r.Name : "";
          obj["productInPlace"] = (wo.UH__productInPlace__r) ? wo.UH__productInPlace__r.Name : "";
          obj["description"] = wo.UH__Description__c;
          obj["deadline"] = (wo.UH__Deadline__c) ? new Date(wo.UH__Deadline__c).toDateString() : "";
          return obj;
        });
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
    $Lightning.createComponent(
      "c:showMyWarehouses",
      {},
      "myWarehouseDiv", // this.myWarehouse.nativeElement
      function(component) {
        console.log("Added component = ", component);
        console.log("component attr = ", component.get("v.stockUnits"));
        console.log("is defined v.stockUnits = ", $A.util.isUndefined(component.get("v.stockUnits")));
      }
    );

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

  // public showTechs() {
  //   this.navCtrl.push('TechniciansPage');
  // }
}