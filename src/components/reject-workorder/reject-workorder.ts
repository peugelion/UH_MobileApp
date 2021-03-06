import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { DataService } from 'forcejs';

@Component({
  selector: 'reject-workorder',
  templateUrl: 'reject-workorder.html'
})
export class RejectWorkorderComponent {
  private rejectionForm: FormGroup;
  private woId: string;

  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private oauth : OAuthServiceProvider,
    public params: NavParams
  ) {
    this.woId = this.params.get('woId');

    this.rejectionForm = this.formBuilder.group({
      reason:  ['', Validators.required]
    });
  }

  dismiss() {
    let data = {
      isCanceled: true,
      message: ""
    };
    this.viewCtrl.dismiss(data);
  }

  rejectWO(formData: any): void {
    // reject WO
    this.oauth.getOAuthCredentials()
      .then(oauth => {
        let service = DataService.createInstance(oauth, {useProxy:false});
        let sObject = {
          Id: this.woId,
          UH__cancelledBy__c: oauth.userId,
          UH__Status__c: 'Reject',
          UH__dateCancelled__c: Date.now(),
          UH__Comments__c: formData.reason
        };
        service.update('UH__WorkOrder__c', sObject)
          .then(response => {
            // send the message back and close the modal
            let data = {
              isCanceled: false,
              message: "You successfully rejected workorder."
            };
            this.viewCtrl.dismiss(data);
          })
          .catch(error => {
            console.log(error);
          });
      });
  }

}
