import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { DataService } from 'forcejs';

@Component({
  selector: 'edit-workorder',
  templateUrl: 'edit-workorder.html'
})
export class EditWorkorderComponent {
  private workorder: any;
  private editWO: FormGroup;

  constructor(
    public  viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private oauth : OAuthServiceProvider,
    public  params: NavParams
  ) {
    this.workorder = this.params.get("workorder");
    this.editWO = this.formBuilder.group({
      UH__Description__c: [''],
      UH__Comments__c:    ['']
    });
  }

  dismiss() {
    let data = {
      isCanceled: true,
      message: ""
    };
    this.viewCtrl.dismiss(data);
  }

  updateWO(formData: any): void {
    this.oauth.getOAuthCredentials()
      .then(oauth => {
        let service = DataService.createInstance(oauth, {useProxy:false});
        formData.Id = this.workorder.Id;
        service.update('UH__WorkOrder__c', formData)
          .then(response => {
            // send the message back and close the modal
            let data = {
              isCanceled: false,
              message: "You successfully updated workorder."
            };
            this.viewCtrl.dismiss(data);
          })
          .catch(error => {
            console.log(error);
          });
      });
  }
}
