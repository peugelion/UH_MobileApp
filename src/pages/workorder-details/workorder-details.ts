import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, ToastController } from 'ionic-angular';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { WorkordersServiceProvider } from '../../providers/workorders-service/workorders-service';

import { AddExpenseComponent } from '../../components/add-expense/add-expense';
import { DeptInventoryComponent } from '../../components/dept-inventory/dept-inventory';
import { AddLaborComponent } from '../../components/add-labor/add-labor';
import { RejectWorkorderComponent } from '../../components/reject-workorder/reject-workorder';
import { DataService } from 'forcejs';
import { WorkordersPage } from '../workorders/workorders';
import { EditWorkorderComponent } from '../../components/edit-workorder/edit-workorder';
import { RelatedListsDataProvider } from '../../providers/related-lists-data/related-lists-data';

@IonicPage({
  segment: 'workorder-details/:id'
})
@Component({
  selector: 'page-workorder-details',
  templateUrl: 'workorder-details.html',
})
export class WorkorderDetailsPage {

  tab: string = "details";
  id: string;
  currWO: any;
  currentWOStatus: string = 'Open';
  relatedData: Array<any> = [];
  woStatuses: Array<string> = ['Open', 'Accept', 'Travelling', 'Arrived on place', 'Completed', 'Closed'];
  statusClassMap: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private oauth : OAuthServiceProvider, 
    private woService: WorkordersServiceProvider,
    private toastCtrl: ToastController,
    private relDataService: RelatedListsDataProvider) 
  {
    this.id = this.navParams.data['id']
  }

  ionViewDidLoad() {
    this.getWODetails(this.id);
    this.getRelatedData();
  }

  getWODetails(woID) {
    this.oauth.getOAuthCredentials()
      .then(oauth => {
        this.woService.getWODetails(oauth, woID)
          .then(result => {
            this.currWO = result.currWO;
            this.currentWOStatus = result.currWO.UH__Status__c;
            this.statusClassMap = result.statusesMap;
            this.statusClassMap.Arrived = result.statusesMap["Arrived on place"];

            // so ugly because I wanted to use existing functions to get required data
            // and data structures are different, so I needed to do this
            // let woParts = result.woParts.map(woPart => {
            //   let obj = {};
            //   obj["relatedName"] = woPart.Name;
            //   obj["cost"] = woPart.UH__Cost__c;
            //   obj["createdDate"] = new Date(woPart.CreatedDate).toDateString();
            //   obj["quantity"] = woPart.UH__Quantity__c;
            //   obj["totalCost"] = woPart.UH__totalCost__c;
            //   obj["type"] = woPart.UH__Part__r.UH__Type__c;
            //   obj["relatedObjectURL"] = woPart.attributes.url;
            //   return obj;
            // });
            // let woExpenses = result.woExpenses.map(woExpense => {
            //   let obj = {};
            //   obj["relatedName"] = woExpense.Name;
            //   obj["cost"] = woExpense.UH__Cost__c;
            //   obj["createdDate"] = new Date(woExpense.CreatedDate).toDateString();
            //   obj["quantity"] = woExpense.UH__Quantity__c;
            //   obj["totalCost"] = woExpense.UH__totalCost__c;
            //   obj["type"] = woExpense.UH__expenseType__c;
            //   obj["relatedObjectURL"] = woExpense.attributes.url;
            //   return obj;
            // });
            // let woLabors = result.woLabors.map(woLabor => {
            //   let obj = {};
            //   obj["relatedName"] = woLabor.Name;
            //   obj["cost"] = woLabor.UH__Cost__c;
            //   obj["createdDate"] = new Date(woLabor.CreatedDate).toDateString();
            //   obj["quantity"] = woLabor.UH__hoursCount__c;
            //   obj["totalCost"] = woLabor.UH__totalCost__c;
            //   obj["type"] = woLabor.UH__Labor__r.UH__Type__c + ' - ' + woLabor.UH__Labor__r.Name;
            //   obj["relatedObjectURL"] = woLabor.attributes.url;
            //   return obj;
            // });

            // this.relatedData.push({"name": "WO Parts", "elements": woParts, "size": woParts.length});
            // this.relatedData.push({"name": "WO Expenses", "elements": woExpenses, "size": woExpenses.length});
            // this.relatedData.push({"name": "WO Labors", "elements": woLabors, "size": woLabors.length});
          });
      });
  }

  getRelatedData() {
    this.oauth.getOAuthCredentials().then(oauth => {
      let whereCond: string = `WHERE UH__WorkOrder__c = '${this.id}'`;
      this.relDataService.getRelatedWOParts(oauth, whereCond).then(result => {
        this.relatedData.push({"name": "WO Parts", "elements": result.records, "size": result.records.length}); 
      });
      this.relDataService.getRelatedWOExpenses(oauth, whereCond).then(result => {
        this.relatedData.push({"name": "WO Expenses", "elements": result.records, "size": result.records.length}); 
      });
      this.relDataService.getRelatedWOLabours(oauth, whereCond).then(result => {
        this.relatedData.push({"name": "WO Labors", "elements": result.records, "size": result.records.length}); 
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

  gotoRecord(page, recordId, url) {
    this.navCtrl.push(page, {"id": recordId, "url": url});
  }

  changeWOStatus(status: string) {
    this.oauth.getOAuthCredentials()
      .then(oauth => {
        this.woService.changeWOStatus(oauth, this.currWO.Id, status)
          .then(result => {
            this.currWO = result.currWO;
            this.currentWOStatus = status;
            this.statusClassMap = result.statusesMap;
            this.statusClassMap.Arrived = result.statusesMap["Arrived on place"];
          });
      });
  }

  executeAction(action) {
    this[`${action}`]();
  }

  assignTech() {
    console.log("I got inside AssignTech!");
  }

  editWO() {
    let modal = this.modalCtrl.create(EditWorkorderComponent, { workorder: this.currWO });
    modal.onDidDismiss(data => {
      if(!data.isCanceled) {
        // present the message from a modal
        let toast = this.toastCtrl.create({
          message: data.message,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    });
    modal.present();
  }

  rejectWO() {
    let modal = this.modalCtrl.create(RejectWorkorderComponent, { woId: this.currWO.Id });
    modal.onDidDismiss(data => {
      if(!data.isCanceled) {
        // present the message from a modal
        let toast = this.toastCtrl.create({
          message: data.message,
          duration: 2000,
          position: 'top'
        });
        toast.present();
        // get back to workorders list and not to currently rejected workorder
        this.navCtrl.setRoot(WorkordersPage);
      }
    });
    modal.present();
  }

  checkInventory() {
    let expenseModal = this.modalCtrl.create(DeptInventoryComponent);
    expenseModal.present();
  }

  addPart() {
    console.log("I got inside addPart!");
  }

  addLabour() {
    let labourModal = this.modalCtrl.create(AddLaborComponent, { woId: this.currWO.Id });
    labourModal.onDidDismiss(data => {
      if(!data.isCanceled) {
        // push newly created labour into its related list
        let relatedWOLabour = this.relatedData[2];
        relatedWOLabour.elements.push(data.createdLabour);
        relatedWOLabour.size += 1;

        // present the message from a addLabour modal
        let toast = this.toastCtrl.create({
          message: data.message,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    });
    labourModal.present();
  }

  addExpense() {
    let expenseModal = this.modalCtrl.create(AddExpenseComponent, { woId: this.currWO.Id });
    expenseModal.onDidDismiss(data => {
      if(!data.isCanceled) {
        // push newly created expense into its related list
        let relatedWOExpenses = this.relatedData[1];
        relatedWOExpenses.elements.push(data.createdExpense);
        relatedWOExpenses.size += 1;

        // present the message from a addExpense modal
        let toast = this.toastCtrl.create({
          message: data.message,
          duration: 2000,
          position: 'top'
        });
        toast.present();
      }
    });
    expenseModal.present();
  }

  woReport() {
    console.log("I got inside woReport!");
  }

  printInvoice() {
    console.log("I got inside printInvoice!");
  }
}