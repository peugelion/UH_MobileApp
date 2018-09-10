import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { DataService } from 'forcejs';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { HttpClient } from '@angular/common/http';

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
    public params: NavParams,
    public http: HttpClient
  ) {
    this.woId = this.params.get('woId');

    this.newLabour = this.formBuilder.group({
      labour: [''],
      cost:   [''],
      hours:  ['', Validators.required]
    });

    this.getLabours();
  }

  async getLabours() {
    let oauth = await this.oauth.getOAuthCredentials();    console.log("getLabours USO");
    if (!oauth.isSF)
      return this.getLabours_strapi(oauth);
    let service = await DataService.createInstance(oauth, {useProxy:false});
    let result = await service.query(`SELECT Id, Name FROM Product2 WHERE RecordTypeId = '01215000000sJoqAAE'`);   console.log("sf labours", result["records"]);
    this.labours = result["records"];
  }
  async getLabours_strapi(oauth) {    console.log("getLabours_strapi USO");
    let url = oauth.instanceURL+`/graphql?query={
      products(where:{RecordTypeId:"Labor"}){_id Id Name}
    }`.replace(/\s+/g,'').trim();
    let r = await this.http.get(url).toPromise();      console.log("r products RecordTypeId Labor", r["data"]["products"]);
    this.labours = r["data"]["products"];       // TODO parse dates
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
        if (!oauth.isSF)
          return this.saveLabour_strapi(oauth, formData);
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
  async saveLabour_strapi(oauth, formData: any) {    console.log("formdata labor strapi", formData);
    let sObject = {
      UH__workOrder__r: this.woId,
      UH__Labor__r: formData.labour,
      UH__Cost__c: parseFloat(formData.cost),
      UH__hoursCount__c: formData.hours
    };
    console.log("sObject labor", sObject);

    let createEntry = await oauth.strapi.createEntry('wolabor', sObject);    console.log("createEntry", createEntry);
    //let getEntry = await oauth.strapi.getEntry('wolabor', createEntry.id);    console.log("getEntry ... ", getEntry);
    
    let data = {
      isCanceled: false,
      message: "You successfully added labour.",
      createdLabour: createEntry
    };
    this.viewCtrl.dismiss(data);

    return createEntry;
  }

}
