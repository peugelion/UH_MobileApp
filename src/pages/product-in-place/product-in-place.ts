import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { DataService } from 'forcejs';

@IonicPage()
@Component({
  selector: 'product-in-place',
  templateUrl: 'product-in-place.html',
})
export class ProductInPlacePage {
  tab: string = "details";
  private pipRecord: any;
  relatedData: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private oauth : OAuthServiceProvider) {
    let pipId = this.navParams.data['id'];
    this.getPiPDetails(pipId);
  }

  ionViewDidLoad() {}

  toggleSection(i: number) {
    this.relatedData[i].open = !this.relatedData[i].open;
  }

  getPiPDetails(pipId: string): void {
    let isStrapi = window["isStrapi"];
    if (!isStrapi) {
      this.oauth.getOAuthCredentials()
        .then(oauth => DataService.createInstance(oauth, {useProxy:false}).apexrest(`/services/apexrest/UH/productInPlace/${pipId}`))
        .then(result => {
          console.log(result);
          this.pipRecord = result.pipRecord;
          this.relatedData.push({"name": "Cases", "elements": result.cases, "size": result.cases.length});
          this.relatedData.push({"name": "Workorders", "elements": result.workorders, "size": result.workorders.length});
        });
    } else {
      // let url = `http://127.0.0.1:1337/graphql?query={
      //   productinplaces(
      //       where: { ${selectCond} }
      //     ) { _id Name UH__Description__c UH__Deadline__c UH__Status__c UH__Contact__r{ _id Name } UH__productInPlace__r { _id Name } }
      //   }`//.replace(/\s/g, ' ');
      //   this.http.get(url).subscribe(
      //     data => resolve( this.strapiRespParsing(data["data"]["workorders"]) ), // TODO parse dates to local format, ex. new Date('2013-08-10T12:10:15.474Z').toLocaleDateString()+" "+new Date('2013-08-10T12:10:15.474Z').toLocaleTimeString()
      //     err => console.error(err)
      //   )
    }
  }
}