import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { WorkordersServiceProvider } from '../../providers/workorders-service/workorders-service';

@IonicPage()
@Component({
  selector: 'page-workorder-details',
  templateUrl: 'workorder-details.html',
})
export class WorkorderDetailsPage {

  tab: string = "details";
  currWO: any;
  relatedData: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private oauth : OAuthServiceProvider, private woService: WorkordersServiceProvider) {
  }

  ionViewDidLoad() {
    this.getWODetails(this.navParams.data['woId']);
  }

  getWODetails(woID) {
    this.oauth.getOAuthCredentials()
      .then(oauth => {
        this.woService.getWODetails(oauth, woID)
          .then(result => {
            this.currWO = result.currWO;

            // so ugly because I wanted to use existing functions to get required data
            // and data structures are different, so I needed to do this
            let woParts = result.woParts.map(woPart => {
              let obj = {};
              obj["relatedName"] = woPart.Name;
              obj["cost"] = woPart.UH__Cost__c;
              obj["createdDate"] = new Date(woPart.CreatedDate).toDateString();
              obj["quantity"] = woPart.UH__Quantity__c;
              obj["totalCost"] = woPart.UH__totalCost__c;
              obj["type"] = woPart.UH__Part__r.UH__Type__c;
              // obj["typeName"] = woPart.UH__Part__r.Name;
              obj["relatedObjectURL"] = woPart.attributes.url;
              return obj;
            });
            let woExpenses = result.woExpenses.map(woExpense => {
              let obj = {};
              obj["relatedName"] = woExpense.Name;
              obj["cost"] = woExpense.UH__Cost__c;
              obj["createdDate"] = new Date(woExpense.CreatedDate).toDateString();
              obj["quantity"] = woExpense.UH__Quantity__c;
              obj["totalCost"] = woExpense.UH__totalCost__c;
              obj["type"] = woExpense.UH__expenseType__c;
              // obj["typeName"] = "";
              obj["relatedObjectURL"] = woExpense.attributes.url;
              return obj;
            });
            let woLabors = result.woLabors.map(woLabor => {
              let obj = {};
              obj["relatedName"] = woLabor.Name;
              obj["cost"] = woLabor.UH__Cost__c;
              obj["createdDate"] = new Date(woLabor.CreatedDate).toDateString();
              obj["quantity"] = woLabor.UH__hoursCount__c;
              obj["totalCost"] = woLabor.UH__totalCost__c;
              obj["type"] = woLabor.UH__Labor__r.UH__Type__c;
              // obj["typeName"] = woLabor.UH__Labor__r.Name;
              obj["relatedObjectURL"] = woLabor.attributes.url;
              return obj;
            });

            this.relatedData.push({"name": "WO Parts", "elements": woParts, "size": woParts.length});
            this.relatedData.push({"name": "WO Expenses", "elements": woExpenses, "size": woExpenses.length});
            this.relatedData.push({"name": "WO Labors", "elements": woLabors, "size": woLabors.length});
          });
      });
  }

  toggleSection(i) {
    this.relatedData.forEach((elem, idx) => {
      // close all opened sections that are not clicked
      if (idx !== i && elem.open) elem.open = !elem.open; 
    });
    this.relatedData[i].open = !this.relatedData[i].open;
  }
}