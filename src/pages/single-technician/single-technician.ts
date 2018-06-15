import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { SobjectServiceProvider } from '../../providers/sobject-service/sobject-service';
//import { PipeTransform, Pipe } from '@angular/core';
import { DataService } from 'forcejs';

@IonicPage()
@Component({
  selector: 'page-single-technician',
  templateUrl: 'single-technician.html',
})

export class SingleTechnicianPage {

  toptabs: string = "details";

  Id: string;
  technician: {
    // Id: string,
    // Name: any,
    // Active: boolean,
    // UH__User__c: any,
    // UH__username__c: any
    // UH__defaultDepartment__r: any
  };
  defaultDepartment: {};
  department: {};
  user: {};

  error: any;

  //@Input dataObject;
  constructor(public navCtrl: NavController, public navParams: NavParams, private oauth : OAuthServiceProvider, private soService: SobjectServiceProvider) {
    //this.Id = navParams.get("Id");
    this.Id = this.navParams.data['techId']
  }

  ionViewDidLoad(id) {
   console.log('ionViewDidLoad SingleTechnicianPage, id : ', id);

    // let loading = this.loadingCtrl.create({
    //   spinner: 'bubbles',
    //   content: 'Loading, please wait...'
    // });
    // loading.present();
    this.loadTechnician()
      // .then(r => {
      //   loading.dismiss();
      // });
  }

  loadTechnician() {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthCredentials().
        then(oauth => {

          let service = DataService.createInstance(oauth, {useProxy:false});
          let techPromise = this.soService.getSobject(service, 'UH__Technician__c', this.Id, '');
          let defDeptPromise = this.soService.getSobject(service, 'UH__Technician__c', this.Id, 'UH__defaultDepartment__r');
          let userPromise = this.soService.getSobject(service, 'UH__Technician__c', this.Id, 'UH__User__r');
          console.log("techPromise:, ", techPromise);

          Promise.all([techPromise, userPromise, defDeptPromise])
            .then((arrayOfResults) => {
              console.log('arrayOfResults', arrayOfResults);
              this.technician = arrayOfResults[0];              console.log("this.technician", this.technician);
              this.user = arrayOfResults[1];                    console.log("this.user", this.user);
              this.defaultDepartment = arrayOfResults[2];       console.log("this.defDeptPromise", this.defaultDepartment);

              //this.department = {};
              let departmentId = this.defaultDepartment['UH__Department__c'];
              this.soService.getSobject(service, 'UH__Department__c', departmentId, '')
                .then(r => {
                  this.department = r;                          console.log("this.department", this.department);
                  //resolve(this.department);
                });

              
              resolve(arrayOfResults); // !!!
          });
          //resolve(userPromise);

      });
    });
  }

  loadDepartmentDetails(id, department) {
    id ? this.navCtrl.push('DepartmentDetailsPage', {"deptId": id, "dept" : department}) : console.log(' no dept. id yet, try again');
  }

  // loadTechnician(){
  //   return new Promise((resolve, reject) => {
  //     this.oauth.getOAuthCredentials().
  //       then(oauth => {
  //         resolve(this.soService.getTechnician(oauth, this.Id, 'UH__Technician__c'))
  //           .then(results => {
  //             this.technician = results;
  //             resolve(results);
  //           })
  //           .catch(error => console.log(error));
  //       })
  //       .catch(error => console.log(error));
  //   });
  // }

  // loadTechnicianDepartment(){
  //   return new Promise((resolve, reject) => {
  //     this.oauth.getOAuthCredentials().
  //       then(oauth => {
  //         this.soService.getTechnicianDepartment(oauth, this.Id, 'UH__Technician__c')
  //           .then(results => {
  //             this.technician = results;
  //             resolve(results);
  //             console.log("this.technician id: ", this.Id, "this.technician obj : ", this.technician);
  //             console.log("this.technician id: ", this.Id, "this.technician obj['UH__defaultDepartment__r'] : ", this.technician['UH__defaultDepartment__r']);
  //           })
  //           .catch(error => console.log(error));
  //       })
  //       .catch(error => console.log(error));
  //   });
  // }
  
  // https://blog.ionicframework.com/pull-to-refresh-directive/
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.loadTechnician().
      then(r => {
        console.log(" refresher resolve : ", r);
        refresher.complete();
        console.log(" refresher.complete! ");
      })
  }

}
