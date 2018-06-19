import { Component } from '@angular/core';
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

@IonicPage()
@Component({
  selector: 'page-department-details',
  templateUrl: 'department-details.html',
})
export class DepartmentDetailsPage {

  Id: string;
  department: {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private oauth: OAuthServiceProvider, private soService: SobjectServiceProvider, private loadingCtrl: LoadingController) {
    this.Id         = this.navParams.data['deptId'];
    this.department = this.navParams.data['dept'];
//    this.department = this.navParams.get('dept');
    console.log('this.navParams', this.navParams);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepartmentDetailsPage');

    if (this.department) return;
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
          let service = DataService.createInstance(oauth, {useProxy:false});
          //let departmentPromise = this.soService.getSobject(service, 'UH__Department__c', this.Id, '')
          this.soService.getSobject(service, 'UH__Department__c', this.Id, '') //
            .then(results => {
              console.log(results);
              this.department = results;
              resolve(this.department);
            });
        });
      });
  }

}
