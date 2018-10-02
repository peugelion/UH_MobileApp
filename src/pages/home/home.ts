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

  showBtn: boolean = false; // PWA prompt
  deferredPrompt;           // PWA prompt

  constructor(
    private woService: WorkordersServiceProvider,
    public navCtrl: NavController,
    private oauth : OAuthServiceProvider,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform) {}

  async initPage(){
    this.oauthCreds = await this.oauth.getOAuthCredentials();
    //this.deptStock.getWarehouseAndStock();
    await this.showListWOs();
  }

  async showListWOs() {
    let selectCond = 'WHERE UH__startTime__c = LAST_WEEK OR UH__startTime__c = THIS_WEEK';
    this.workOrders = await this.woService.showListWOs(this.oauthCreds, selectCond);
  }
  
  // https://blog.ionicframework.com/pull-to-refresh-directive/
  async doRefresh(refresher) {
      await this.showListWOs();
      await refresher.complete();
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

  /* PWA prompt 2018.10.02 */
  ionViewWillEnter(){
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later on the button event.
      this.deferredPrompt = e;
       
    // Update UI by showing a button to notify the user they can add to home screen
      this.showBtn = true;
    });
     
    //button click event to show the promt
    window.addEventListener('appinstalled', (event) => {
      console.log('pwa app already installed');
    });
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('display-mode is standalone - pwa app launched from the home screen ANDROID');
    }
    // if (window.navigator.standalone === true) {
    //   console.log('display-mode is standalone - pwa app launched from the home screen SAFARI');
    // }
  }
 
  add_to_home(e){
    debugger
    // hide our user interface that shows our button
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          alert('User accepted the prompt');
        } else {
          alert('User dismissed the prompt');
        }
        this.deferredPrompt = null;
      });
  };
}