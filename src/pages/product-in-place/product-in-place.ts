import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { DataService } from 'forcejs';
import { HttpClient } from '@angular/common/http';
import Strapi from 'strapi-sdk-javascript/build/main';

@IonicPage()
@Component({
  selector: 'product-in-place',
  templateUrl: 'product-in-place.html',
})
export class ProductInPlacePage {
  tab: string = "details";
  private pipRecord: any;
  relatedData: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private oauth : OAuthServiceProvider, public http: HttpClient) {
    let pipId = this.navParams.data['id'];
    this.getPiPDetails(pipId);
  }

  ionViewDidLoad() {}

  toggleSection(i: number) {
    this.relatedData[i].open = !this.relatedData[i].open;
  }

  async getPiPDetails(pipId: string) {
    let oauth = await this.oauth.getOAuthCredentials();
    if (oauth.isSF) {
        let res = await DataService.createInstance(oauth, {useProxy:false}).apexrest(`/services/apexrest/UH/productInPlace/${pipId}`);
        this.pipRecord = res.pipRecord;  //          console.log("pip rest result", result);
        this.relatedData.push({"name": "Cases", "elements": res.cases, "size": res.cases.length});
        this.relatedData.push({"name": "Workorders", "elements": res.workorders, "size": res.workorders.length});
    } else {
      let url = oauth.instanceURL+`/graphql?query={
        productinplace(id:"${pipId}"){
          _id Name UH__Contact__r{Id Name} UH__Product__r{Id Name} UH__Quantity__c
          workorders {Id Name UH__Deadline__c UH__Description__c UH__productInPlace__r{Id Name} UH__ServicePlace__r{Id Name}}
          UH__ServicePlace__r{Id Name} UH__Status__c UH__code__c UH__installedDate__c UH__purchaseDate__c
        }}`//.replace(/\s+/g,' ').trim();
      let res = await this.http.get(url).toPromise(); // TODO parse dates to local format, ex. new Date('2013-08-10T12:10:15.474Z').toLocaleDateString()+" "+new Date('2013-08-10T12:10:15.474Z').toLocaleTimeString()
      this.pipRecord = res["data"]["productinplace"];  //      console.log("this.pipRecord", this.pipRecord);
      //this.relatedData.push({"name": "Cases", "elements": this.pipRecord["cases"], "size": this.pipRecord["cases"].length});
      this.relatedData.push({"name": "Workorders", "elements": this.pipRecord["workorders"], "size": this.pipRecord["workorders"].length}); // TODO related tab - cases
    }
  }
}