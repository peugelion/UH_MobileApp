import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ViewController, NavParams } from 'ionic-angular';
import { DataService } from 'forcejs';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';

@Component({
  selector: 'workorder-form',
  templateUrl: 'workorder-form.html'
})
export class WorkorderFormComponent {
  // arguments passed when creating component for modal 
  private spID: string;
  private spName: string;
  private accId: string;
  
  private newWO: FormGroup;

  private pips: Array<any>;
  private contacts: Array<any>;
  private workorders: Array<any>;

  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private oauth : OAuthServiceProvider,
    public params: NavParams
  ) {
    this.spID = this.params.get('id');
    this.spName = this.params.get('spName');
    this.accId = this.params.get('accId');

    this.newWO = this.formBuilder.group({
      completionDate: [''],
            parentWO: [''],
             contact: [''],
             comment: [''],
                desc: ['', Validators.required],
                spID: [`${this.spID}`],
                 pip: [''],
                  sp: [`${this.spName}`]
    });

    this.getSelectListsData(this.spID, this.accId);
  }

  getSelectListsData(spID: string, accId: string) {
    this.oauth.getOAuthCredentials()
      .then(oauth => {
        let service = DataService.createInstance(oauth, {useProxy:false});
        // get Products in Place 
        service.query(`SELECT Id, Name FROM UH__ProductInPlace__c WHERE UH__ServicePlace__c='${spID}'`)
         .then(result => {
            this.pips = result.records;
         });
         // get Contacts for this Service Place
        service.query(`SELECT Id, Name FROM Contact WHERE AccountId='${accId}'`)
        .then(result => {
          this.contacts = result.records;
        });
        // get Workorders on this Service Place 
        service.query(`SELECT Id, Name FROM UH__WorkOrder__c WHERE UH__ServicePlace__c='${spID}'`)
         .then(result => {
          this.workorders = result.records;
         });
      });
  }

  dismiss() {
    let data = {
      isCanceled: true,
      message: ""
    };
    this.viewCtrl.dismiss(data);
  }

  createWO(form: any): void {
    // save a workorder
    this.oauth.getOAuthCredentials()
      .then(oauth => {
        let service = DataService.createInstance(oauth, {useProxy:false});
        let sObject = {
          UH__Comments__c: form.comment,
          UH__Contact__c: form.contact,
          UH__Description__c: form.desc,
          UH__productInPlace__c: form.pip,
          UH__ParentWo__c: form.parentWO,
          UH__ServicePlace__c: form.spID,
          UH__Deadline__c: form.completionDate,
          UH__Status__c: 'Open'
        };
        service.create('UH__WorkOrder__c', sObject)
          .then(response => {
            // send the message back and close the modal
            let data = {
              woId: response.id, 
              isCanceled: false,
              message: "You successfully created workorder."
            };
            this.viewCtrl.dismiss(data);
          })
          .catch(error => {
            console.log(error);
          });
      });
  }
}