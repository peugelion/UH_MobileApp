import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { SobjectServiceProvider } from '../../providers/sobject-service/sobject-service';
import { TechniciansServiceProvider } from '../../providers/technicians-service/technicians-service';
//import { PipeTransform, Pipe } from '@angular/core';
import { DataService } from 'forcejs';

@IonicPage({
  segment: 'tech/:id',                 // https://ionicframework.com/docs/api/navigation/IonicPage/
  defaultHistory: ['TechniciansPage']
})
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
  //defaultDepartment: {};
  department: {};
  user: {};

  error: any;

  // RELATED TAB
  relatedData: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private oauth : OAuthServiceProvider, private soService: SobjectServiceProvider, private techService: TechniciansServiceProvider) {
    //this.Id = navParams.get("Id");
    this.Id = this.navParams.data['id']
  }

  ionViewDidLoad() {
    this.loadTechnician()
      .then(r => console.dir(this));
  }

  onSegmentChanged() {
    if (this.toptabs != "details" && !this.relatedData.length)
      this.loadRelated();
  }

  // https://blog.ionicframework.com/pull-to-refresh-directive/
  doRefresh(refresher) {
    ((this.toptabs == "details") ? this.loadTechnician() : this.loadRelated())
      .then(r => refresher.complete());
  }

  loadTechnician() {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthCredentials()
      .then( oauth => DataService.createInstance(oauth, {useProxy:false}) )
      .then( service => {
        let techPromise    = this.soService.getSobject(service, 'UH__Technician__c', this.Id, '');
        let defDeptPromise = this.soService.getSobject(service, 'UH__Technician__c', this.Id, 'UH__defaultDepartment__r');
        let userPromise    = this.soService.getSobject(service, 'UH__Technician__c', this.Id, 'UH__User__r');

        Promise.all([techPromise, userPromise])
        .then(arrayOfResults => {                          //console.log('arrayOfResults', arrayOfResults);
          this.technician = arrayOfResults[0];             //console.log("this.technician", this.technician);
          this.user = arrayOfResults[1];                   console.log("this.user", this.user);
          resolve(techPromise); // !!!
        })
        .catch(error => console.log("arrayOfResults promisee err", error));

        //

        /* technician->default department->department veza */
        defDeptPromise
        .then(r => r['UH__Department__c'], err => this.department = null)
        //.catch(error => this.department = null)             //console.log("defDeptPromise", error);
        .then(departmentId => this.soService.getSobject(service, 'UH__Department__c', departmentId, ''))
        .then(r => resolve(this.department = r));
      });
    });
  }

  loadDepartmentDetails(id, department) {
    id ? this.navCtrl.push('DepartmentDetailsPage', {"id": id, "dept" : department}) : console.warn(' no dept. id yet, try again');
  }

  // related tab
  
  loadRelated() {
    return new Promise((resolve, reject) => this.oauth.getOAuthCredentials()
      .then(oauth => this.techService.loadServiceTeams(oauth, this.Id))
      .then(r => resolve(this.relatedData[0] = r)) //console.table(r);
    );
  }

}
