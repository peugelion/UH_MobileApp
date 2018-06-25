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

  ionViewDidLoad() {
    //console.log("pipRecord === ", this.navParams.data['dataObj'].pipRecord);
  }

  toggleSection(i: number) {
    this.relatedData[i].open = !this.relatedData[i].open;
  }

  getPiPDetails(pipId: string): void {
    this.oauth.getOAuthCredentials()
      .then(oauth => DataService.createInstance(oauth, {useProxy:false}).apexrest(`/services/apexrest/UH/productInPlace/${pipId}`))
      .then(result => {
        this.pipRecord = result.pipRecord;
        this.relatedData.push({"name": "Cases", "elements": result.cases, "size": result.cases.length});
        this.relatedData.push({"name": "Workorders", "elements": result.workorders, "size": result.workorders.length});
      });
  }
}