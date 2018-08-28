import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { DataService } from 'forcejs';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';

@Component({
  selector: 'add-expense',
  templateUrl: 'add-expense.html'
})
export class AddExpenseComponent {

  private newExpense: FormGroup;
  private cost: AbstractControl;
  private quantity: AbstractControl;
  private woId: string;

  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private oauth : OAuthServiceProvider,
    public params: NavParams
  ) {
    this.newExpense = this.formBuilder.group({
      type: ['--- none ---', Validators.required],
      cost: ['', Validators.required],
      qty:  ['', Validators.required]
    });
    this.cost = this.newExpense.controls['cost'];
    this.quantity = this.newExpense.controls['qty'];

    this.woId = this.params.get('woId');
  }

  dismiss() {
    let data = {
      isCanceled: true,
      message: ""
    };
    this.viewCtrl.dismiss(data);
  }

  saveExpense(formData: any): void {
    // save the expense
    this.oauth.getOAuthCredentials()
      .then(oauth => {
        if (!oauth.isSF)
          return this.saveExpense_strapi(formData);
        let service = DataService.createInstance(oauth, {useProxy:false});
        let sObject = {
          UH__WorkOrder__c: this.woId,
          UH__expenseType__c: formData.type,
          UH__Cost__c: formData.cost,
          UH__Quantity__c: formData.qty
        };
        service.create('UH__WO_Expense__c', sObject)
          .then(response => {
            // get the details of newly created expense, to refresh related list upon closing the modal
            service.query(
              `SELECT ID, Name, UH__WorkOrder__c, UH__Quantity__c, format(UH__Cost__c), format(UH__TotalCost__c), UH__ExpenseType__c,
                     format(CreatedDate)
              FROM uh__WO_Expense__c 
              WHERE Id = '${response.id}'`
            )
            .then(res => {
              // send the message back and close the modal
              let data = {
                isCanceled: false,
                message: "You successfully added expense.",
                createdExpense: res.records[0]
              };
              this.viewCtrl.dismiss(data);
            });
          })
          .catch(error => {
            console.log(error);
          });
      });
  }
  async saveExpense_strapi(formData: any) {
    let oauth = await this.oauth.getOAuthCredentials();
    let sObject = {
      UH__WorkOrder__r: this.woId,
      UH__expenseType__c: formData.type,
      UH__Cost__c: parseFloat(formData.cost),
      UH__Quantity__c: formData.qty
    };
    console.log("sObject", sObject);

    let createEntry = await oauth.strapi.createEntry('woexpense', sObject);
    console.log("createEntry", createEntry);
    let getEntry = await oauth.strapi.getEntry('woexpense', createEntry.id);
    console.log("getEntry ... ", getEntry);
    
    let data = {
      isCanceled: false,
      message: "You successfully added expense.",
      createdExpense: getEntry
    };
    this.viewCtrl.dismiss(data);

    return getEntry;
  }
}