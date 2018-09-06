import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { DataService } from 'forcejs';
import Strapi from 'strapi-sdk-javascript/build/main';

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

  async updateWO(formData: any) {
    let oauth = await this.oauth.getOAuthCredentials();
    if (!oauth.isSF)
      return await this.updateWO_strapi(formData, oauth);
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
  }
  async updateWO_strapi(formData: any, oauth) {
    formData.Id = this.workorder.Id;
    oauth.strapi.updateEntry("workorder", formData.Id, formData)
    .then(response => {
      console.log("wo edit response", response);
      this.workorder = response;
      
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
  }
}
