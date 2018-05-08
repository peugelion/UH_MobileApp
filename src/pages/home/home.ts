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

  workOrders : any;
  oauthCreds : any;

  constructor(public navCtrl: NavController, private oauth : OAuthServiceProvider) {
    //this.loadLtngApp();
    // this.initPage();
  }

  initPage(){
    this.oauth.getOAuthCredentials().
      then((oauth) => {
        console.log("Oauth === ", oauth);
        this.loadWOs(oauth);
        this.loadLtngApp(oauth.accessToken);
      });
  }

  loadWOs(oauth) {
    let service = DataService.createInstance(oauth, {useProxy:false});
    service.query(
      `SELECT id, name, uh__status__c, uh__servicePlace__r.Name 
      FROM uh__workOrder__c limit 10`)
      .then(response => {
        this.workOrders = response.records;
      });
  }

  loadLtngApp(accessToken) { console.log("inside loadLtngApp");
    $Lightning.use(
      "c:LtngOutDependencyApp",
      this.createLtngCmp,
      "https://simple-urbanhawks.lightning.force.com",
      accessToken
    );
  }

  createLtngCmp() {
    console.log("on createLtngCmp start");
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
    console.log("on createLtngCmp end");
  }

  ionViewDidLoad() {
    console.log("this.myWarehouse.nativeElement = ", this.myWarehouse.nativeElement);
    this.initPage();
  }

  // public showTechs() {
  //   this.navCtrl.push('TechniciansPage');
  // }
}