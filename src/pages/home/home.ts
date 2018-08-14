import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { WorkordersServiceProvider } from '../../providers/workorders-service/workorders-service';
import { ActionSheetController } from 'ionic-angular'

// @IonicPage({
//   name: 'HomePage',
//   priority: 'high',
//   //segment: '#'
// })
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  //@ViewChild('deptStock') deptStock;

  workOrders : any;
  oauthCreds : any; 

  techLat: string;
  techLng: string;

  constructor(
    private woService: WorkordersServiceProvider,
    public navCtrl: NavController,
    private oauth : OAuthServiceProvider,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform) {}

  initPage(){
    this.oauth.getOAuthCredentials().
      then((oauth) => {
        //this.deptStock.getWarehouseAndStock();
        this.showListWOs(oauth);
      });
  }

  showListWOs(oauth) {
    let selectCond = 'WHERE UH__startTime__c = LAST_WEEK OR UH__startTime__c = THIS_WEEK';
    this.woService.showListWOs(oauth, selectCond)
      .then(results => {
        console.log("showListWOs results", results);
        console.log(results);
        //this.workOrders = results["records"];
        this.workOrders = results;
      });
  }
  
  // https://blog.ionicframework.com/pull-to-refresh-directive/
  doRefresh(refresher) {
    this.oauth.getOAuthCredentials().
      then(oauth => {
        this.showListWOs(oauth);
        refresher.complete();
      });
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