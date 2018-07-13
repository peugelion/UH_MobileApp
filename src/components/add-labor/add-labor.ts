import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { DataService } from 'forcejs';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';

@Component({
  selector: 'add-labor',
  templateUrl: 'add-labor.html'
})
export class AddLaborComponent {
  private newLabour: FormGroup;
  private woId: string;
  private labours: Array<any>;

  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private oauth : OAuthServiceProvider,
    public params: NavParams
  ) {
    this.woId = this.params.get('woId');

    this.newLabour = this.formBuilder.group({
      labour: [''],
      cost:   [''],
      hours:  ['', Validators.required]
    });

    this.getLabours();
  }

  getLabours() {
    this.oauth.getOAuthCredentials()
      .then(oauth => {
        let service = DataService.createInstance(oauth, {useProxy:false});
        service.query(`SELECT Id, Name FROM Product2 WHERE RecordTypeId = '01215000000sJoqAAE'`)
         .then(result => {
            this.labours = result.records;
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

  saveLabour(formData: any): void {
    // save the labour
    this.oauth.getOAuthCredentials()
      .then(oauth => {
        let service = DataService.createInstance(oauth, {useProxy:false});
        let sObject = {
          UH__workOrder__c: this.woId,
          UH__Labor__c: formData.labour,
          UH__Cost__c: formData.cost,
          UH__hoursCount__c: formData.hours
        };
        service.create('UH__WO_Labor__c', sObject)
          .then(response => {
            // get the details of newly created labour, to refresh related list upon closing the modal
            service.query(
              `SELECT Id, Name, UH__WorkOrder__c, UH__Labor__c, UH__Labor__r.Name, UH__Labor__r.UH__Type__c, 
                      format(UH__Cost__c), format(UH__totalCost__c), UH__hoursCount__c, format(CreatedDate)
               FROM UH__WO_Labor__c 
               WHERE Id = '${response.id}'`
            )
            .then(res => {
              // send the message back and close the modal
              let data = {
                isCanceled: false,
                message: "You successfully added labour.",
                createdLabour: res.records[0]
              };
              this.viewCtrl.dismiss(data);
            });
          })
          .catch(error => {
            console.log(error);
          });
      });
  }
}
