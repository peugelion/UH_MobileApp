import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { SobjectServiceProvider } from '../../providers/sobject-service/sobject-service';
import { DataService } from 'forcejs';

/**
 * Generated class for the DepartmentDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'department/:id',                 // https://ionicframework.com/docs/api/navigation/IonicPage/
  defaultHistory: ['TechniciansPage']
})
@Component({
  selector: 'page-department-details',
  templateUrl: 'department-details.html',
})
export class DepartmentDetailsPage {

  @ViewChild('deptStock') deptStock;

  Id: string;
  department: {};
  companyName: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private oauth: OAuthServiceProvider, private soService: SobjectServiceProvider, private loadingCtrl: LoadingController) {
    this.Id         = this.navParams.data['id'];
    this.department = this.navParams.data['dept'];
//    this.department = this.navParams.get('dept');
    console.table(this.navParams.data['id']);
    console.table(this.navParams.data['dept']);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepartmentDetailsPage');

    if (this.department) {
      this.loadCompany();
      return;
    }
    console.log("department ? ", this.department);

    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading, please wait...'
    });
    loading.present();
    this.loadDepartment()
      .then(r => {
        loading.dismiss();
      });
  }

  loadDepartment() {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthCredentials().
        then(oauth => {
          //this.deptStock.getWarehouseAndStock();
          let service = DataService.createInstance(oauth, {useProxy:false});
          this.soService.getSobject(service, 'UH__Department__c', this.Id, '').then(r => {
            this.department = r;    console.table(this.department);
            resolve(this.department);
          });
        });
      this.loadCompany();
      });
  }

  loadCompany() {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthCredentials().
        then(oauth => {
          let service = DataService.createInstance(oauth, {useProxy:false});
          this.soService.getSobject(service, 'UH__Department__c', this.Id, 'UH__Company__r').then(r => {
            this.companyName = r["Name"];    console.table(this.companyName);
          }).catch( reason => {
            this.companyName = null;
          });
        });
      });
  }

}
