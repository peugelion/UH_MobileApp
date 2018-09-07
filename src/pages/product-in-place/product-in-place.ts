import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { DataService } from 'forcejs';
import { HttpClient } from '@angular/common/http';
import Strapi from 'strapi-sdk-javascript/build/main';

@IonicPage({
  segment: 'pip/:id',
  defaultHistory: ['ServicePlacesPage'] // hmmm
})
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
    if (!oauth.isSF)
      this.getPiPDetails_strapi(pipId, oauth);
    let result = await DataService.createInstance(oauth, {useProxy:false}).apexrest(`/services/apexrest/UH/productInPlace/${pipId}`);
    this.pipRecord = result.pipRecord;
    console.log("pip rest result", result);
    console.log("result['workorders;]", result["workorders"]);
    this.relatedData.push({"name": "Cases", "elements": result.cases, "size": result.cases.length});
    this.relatedData.push({"name": "Workorders", "elements": result.workorders, "size": result.workorders.length});
  }

  async getPiPDetails_strapi(pipId: string, oauth) {
    let url = oauth.instanceURL+`/graphql?query={
      productinplace(id:"${pipId}"){
        _id, Name, UH__description__c, UH__Quantity__c, UH__Status__c, UH__code__c, UH__serial__c,
        UH__purchaseDate__c, UH__shippedDate__c, UH__installedDate__c, UH__endDate__c,
        UH__Contact__r{Id,Name}, UH__Product__r{Id,Name}, UH__ServicePlace__r{Id,Name},
        workorders{
          Id, Name, UH__Deadline__c, UH__Description__c, UH__ServicePlace__r{Id,Name}, UH__Status__c, UH__Contact__r{Name}
        }
      }}`.replace(/\s+/g,'').trim();
    let res = await this.http.get(url).toPromise();
    this.pipRecord = res["data"]["productinplace"];
    console.log("this.pipRecord", this.pipRecord);
    console.log("this.pipRecord['workorders;]", this.pipRecord["workorders"]);
    //this.relatedData.push({"name": "Cases", "elements": this.pipRecord["cases"], "size": this.pipRecord["cases"].length});  //TODO
    this.relatedData.push({"name": "Workorders", "elements": this.pipRecord["workorders"], "size": this.pipRecord["workorders"].length}); // TODO related tab - cases
  }
}