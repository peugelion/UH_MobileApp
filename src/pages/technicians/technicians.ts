import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TechniciansServiceProvider } from '../../providers/technicians-service/technicians-service';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { SingleTechnicianPage } from '../single-technician/single-technician';

@IonicPage()
@Component({
  selector: 'page-technicians',
  templateUrl: 'technicians.html',
  entryComponents:[ SingleTechnicianPage ]
})
export class TechniciansPage {
  technicians: Array<{Id: string, Name: any}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private techService: TechniciansServiceProvider, private oauth : OAuthServiceProvider) {
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad TechniciansPage');
    this.loadTechnicians();
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
  loadTechnicians(){
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthCredentials().
        then(oauth => {
          this.techService.loadTechnicians(oauth)
            .then(results => {
              console.log(results);
              this.technicians = results.records;
              resolve(this.technicians);
            });
        });
    });
  }

  loadTechnician(id) {
    console.log(" xxx id : " +id);
    this.navCtrl.push(SingleTechnicianPage, {
      Id: id
    });
  }

  
  
  // https://blog.ionicframework.com/pull-to-refresh-directive/
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.loadTechnicians().
      then(r => {
        console.log(" refresher resolve : ", r);
        refresher.complete();
        console.log(" refresher.complete ! ");
      })
  }
}
