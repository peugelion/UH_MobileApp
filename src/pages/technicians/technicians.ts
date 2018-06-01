import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { TechniciansServiceProvider } from '../../providers/technicians-service/technicians-service';
//import { SingleTechnicianPage } from '../single-technician/single-technician';

@IonicPage()
@Component({
  selector: 'page-technicians',
  templateUrl: 'technicians.html',
  //entryComponents:[ SingleTechnicianPage ]
})
export class TechniciansPage {
  items: Array<{Id: string, Name: any}>;  // Technicians

  constructor(public navCtrl: NavController, public navParams: NavParams, private techService: TechniciansServiceProvider, private oauth : OAuthServiceProvider, private loadingCtrl: LoadingController) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TechniciansPage');

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading, please wait...'
    });
    loading.present();
    this.loadTechnicians()
      .then(r => {
        loading.dismiss();
      });
  }

  loadTechnicians() {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthCredentials().
        then(oauth => {
          this.techService.loadTechnicians(oauth)   //
            .then(results => {
              console.log(results);
              this.items = results;
              resolve(this.items);
            });
        });
      });
  }

  // loadTechnicians() {
  //   this.oauth.getOAuthCredentials().
  //     then(oauth => {
  //       this.techService.loadTechnicians(oauth)
  //         .then(results => {
  //           console.log(results);
  //           this.technicians = results.records;
  //         });
  //     });
  // }

  // loadTechnicians(){
  //   return new Promise((resolve, reject) => {
  //     this.oauth.getOAuthCredentials().
  //       then(oauth => {
  //         let loading = this.loadingCtrl.create({
  //           spinner: 'bubbles',
  //           content: 'Loading, please wait...'
  //         });
  //         loading.present();
  //         this.techService.loadTechnicians(oauth)
  //           .then(results => {
  //             console.log(results);
  //             this.technicians = results.records;
  //             loading.dismiss();
  //             resolve(this.technicians);
  //           });
  //       });
  //   });
  // }

  loadSingleTechnician(id) {
    //this.navCtrl.push(SingleTechnicianPage, {Id: id});
    //this.navCtrl.push('SingleTechnicianPage', {Id: id})
    this.navCtrl.push('SingleTechnicianPage', {"techId": id});
  }

  
  
  // https://blog.ionicframework.com/pull-to-refresh-directive/
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.loadTechnicians().
      //then(refresher.complete());
      then(r => {
        console.log(" refresher resolve : ", r);
        refresher.complete();
      })
  }
}
