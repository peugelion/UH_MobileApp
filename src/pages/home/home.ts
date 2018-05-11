import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DataService } from 'forcejs';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';

declare var $Lightning:any;
declare var $A:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  @ViewChild('myWarehouse') myWarehouse: any;

  // workOrders : any;
  oauthCreds : any;

  columns : any = [
    { prop: 'workorderName' },
    { name: 'Status' },
    { name: 'Service Place' },
    { name: 'Description' },
    { name: 'Deadline' }
  ];

  rows : any; 

  constructor(public navCtrl: NavController, private oauth : OAuthServiceProvider) {}

  initPage(){
    this.oauth.getOAuthCredentials().
      then((oauth) => {
        this.loadWOs(oauth);
        this.loadLtngApp(oauth.accessToken);
      });
  }
  
  // doRefresh(refresher) {
  //   console.log('Begin async operation', refresher);

  //   setTimeout(() => {
  //     console.log('Async operation has ended');
  //     refresher.complete();
  //   }, 2000);
  // }
  

  loadWOs(oauth) {
    let service = DataService.createInstance(oauth, {useProxy:false});
    service.query(
      `SELECT id, name, uh__status__c, uh__servicePlace__r.Name, uh__description__c, UH__Deadline__c
      FROM uh__workOrder__c limit 10`)
      .then(response => {
        this.rows = response.records.map(wo => {
          let obj = {};
          obj["workorderName"] = wo.Name;
          obj["status"] = wo.UH__Status__c;
          obj["servicePlace"] = (wo.UH__ServicePlace__r) ? wo.UH__ServicePlace__r.Name : "";
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

  ionViewDidLoad() {
    this.initPage();
  }

  // public showTechs() {
  //   this.navCtrl.push('TechniciansPage');
  // }
}