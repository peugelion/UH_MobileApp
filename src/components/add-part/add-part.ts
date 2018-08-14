import { Component, SimpleChanges } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { DataService } from 'forcejs';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { SobjectServiceProvider } from '../../providers/sobject-service/sobject-service';
import { TechniciansServiceProvider } from '../../providers/technicians-service/technicians-service';

/**
 * Generated class for the AddPartComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'add-part',
  templateUrl: 'add-part.html'
})
export class AddPartComponent {

  text: string;

  private newPart: FormGroup;
  private woId: string;
  private parts: Array<any>;

  private department = {};
  private defaultDeptId = '';

  private userWarehouses = {};
  private unitsInStock = {};

  private maxQuantity = null;

  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    private oauth : OAuthServiceProvider,
    public params: NavParams,
    private soService: SobjectServiceProvider,
    private techService: TechniciansServiceProvider
  ) {
    this.woId = this.params.get('woId');

    this.newPart = this.formBuilder.group({
      part: ['', Validators.required],
      cost:   [''],
      quantity:  ['', Validators.required],
      department: ['', Validators.required]
    });
    

    this.getParts();
  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      this.getParts();
    } catch(err) {
        console.log(err);
    }
  }

  getParts() {
    this.oauth.getOAuthCredentials()
      .then(oauth => DataService.createInstance(oauth, {useProxy:false}))
      .then(service => service.apexrest('/services/apexrest/UH/deptWarehouseCtrl/'))
      .then(r => {
        this.userWarehouses = r.userWarehouses;
        this.unitsInStock = r.unitsInStock;
        console.log("userWarehouses", this.userWarehouses);    console.log("unitsInStock", this.unitsInStock);
        this.department = r.userWarehouses[0];
        this.defaultDeptId = r.userWarehouses[0].Id
        this.newPart.get('department').setValue(this.defaultDeptId);

        this.parts = r.unitsInStock.map(entry => (
          {
            id:       entry["Id"],                      // uis id
            uisName:  entry["Name"],                    // uis name,
            name:     entry["UH__Product__r"]["Name"],  // product name,
            quantity: entry["UH__AvailableQty__c"]      // uis q
          }
        ));
        console.log("parts", this.parts);
      })
      .catch(error => console.log(error));
  }

  onPartChange(): void {
    console.log();
    // let country = this.form.get('country').value;
    // this.states = this.statesByCountry[country];
    // this._cdr.detectChanges();
    let selectedPartId = this.newPart.get('part').value;                      console.log("selectedPartId", selectedPartId);
    let selectedPart = this.parts.find(part => part.id === selectedPartId);   console.log("selectedPart",   selectedPart);
    this.maxQuantity = selectedPart.quantity;   console.log("maxQ",   this.maxQuantity);
  }

  // getParts() {
  //   this.oauth.getOAuthCredentials()
  //     .then(oauth => {
  //       let service = DataService.createInstance(oauth, {useProxy:false});
  //       service.query(`SELECT Id, Name FROM Product2 WHERE RecordTypeId = '01215000000sJkYAAU'`).then(result => {
  //         console.table(result.records);
  //         this.parts = result.records;
  //       });

  //       /* technician->default department->department veza */
  //       this.oauth.getOAuthCredentials()
  //       .then(oauth => this.techService.fetchLoggedInTechnican(oauth))
  //       .then(tech => {
  //         console.warn(tech);
  //         return tech.id;
  //       })
  //       .then(techid => {
  //       let defDeptPromise = this.soService.getSobject(service, 'UH__Technician__c', techid, 'UH__defaultDepartment__r');
  //       return defDeptPromise;
  //       })
  //       .then(r => r['UH__Department__c'], err => this.department = null)
  //       //.catch(error => this.department = null)             //console.log("defDeptPromise", error);
  //       .then(departmentId => this.soService.getSobject(service, 'UH__Department__c', departmentId, ''))
  //       .then(r => {
  //         this.department = r;
  //         this.defaultDept = r.Id
  //         this.newPart.get('department').setValue(this.defaultDept);

  //         console.warn(this.department);
  //         //resolve(this.department)
  //       });
  //     });
  // }

  dismiss() {
    let data = {
      isCanceled: true,
      message: ""
    };
    this.viewCtrl.dismiss(data);
  }

  savePart(formData: any): void {

    console.log('formData');
    console.table(formData);

    // save the part
    this.oauth.getOAuthCredentials()
      .then(oauth => {
        let service = DataService.createInstance(oauth, {useProxy:false});
        let sObject = {
          UH__workOrder__c: this.woId,
          UH__Part__c: formData.part,
          UH__Cost__c: formData.cost,
          UH__quantity__c: formData.quantity,
          UH__Department__c: formData.department,
        };
        service.create('UH__WO_Part__c', sObject)
          .then(r => {
            // get the details of newly created part, to refresh related list upon closing the modal
            service.query(
              `SELECT Id, Name, UH__WorkOrder__c, UH__Labor__c, UH__Labor__r.Name, UH__Labor__r.UH__Type__c, 
                      format(UH__Cost__c), format(UH__totalCost__c), UH__hoursCount__c, format(CreatedDate)
               FROM UH__WO_Part__c 
               WHERE Id = '${r.id}'`
            )
            .then(r => {
              // send the message back and close the modal
              let data = {
                isCanceled: false,
                message: "You successfully added part.",
                createdPart: r.records[0]
              };
              this.viewCtrl.dismiss(data);
            });
          })
          .catch(error => console.log(error));
      });
  }

}
