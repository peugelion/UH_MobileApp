import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RelatedListsDataProvider {

  constructor(public http: HttpClient) {}

  getRelatedCases(oauthCreds, selectCond) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT ID, CaseNumber, Subject, Priority, format(CreatedDate) FROM Case ${selectCond}`);
  }

  getRelatedWOs(oauthCreds, selectCond) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT id, name, uh__status__c, uh__servicePlace__c, uh__servicePlace__r.Name, uh__servicePlace__r.UH__Address__c,
                                 uh__Contact__c, uh__Contact__r.Name, uh__productInPlace__c, uh__productInPlace__r.Name, uh__description__c, format(UH__Deadline__c)
                          FROM UH__workOrder__c ${selectCond}`);
  }

  async getRelatedWOParts(oauthCreds, woId) {
    if (!oauthCreds.isSF)
      return this.getRelatedWOParts_strapi(oauthCreds, woId);
    let service = await DataService.createInstance(oauthCreds, {useProxy:false});
    let r = await service.query(`SELECT ID, Name, UH__WorkOrder__c, UH__Part__c, UH__Part__r.Name, UH__Part__r.UH__Type__c, UH__Quantity__c, format(UH__Cost__c),
                                        format(UH__TotalCost__c), format(CreatedDate) 
                                 FROM UH__WO_Part__c WHERE UH__WorkOrder__c = '${woId}'`);
    return r["records"];
  }
  async getRelatedWOParts_strapi(oauthCreds, woId) {
    let url = oauthCreds.instanceURL+`/graphql?query={
      woparts(where:{UH__workOrder__r:"${woId}"}){_id, Name, createdAt, UH__Part__r{Name, UH__Type__c}, UH__Quantity__c, UH__Cost__c, UH__totalCost__c}
    }`.replace(/\s+/g,'').trim();
    let r = await this.http.get(url).toPromise(); // TODO parse dates to local format, ex. new Date('2013-08-10T12:10:15.474Z').toLocaleDateString()+" "+new Date('2013-08-10T12:10:15.474Z').toLocaleTimeString()
    console.log("r parts strapi", r);
    //return r["data"]["woparts"];
    let tmp = JSON.stringify(r["data"]["woparts"]).replace(/Spare_part/g, 'Spare part'); // to metch SF responses
    return JSON.parse(tmp);
  }

  async getRelatedWOExpenses(oauthCreds, woId) {
    if (!oauthCreds.isSF)
      return this.getRelatedWOExpenses_strapi(oauthCreds, woId);
    let service = await DataService.createInstance(oauthCreds, {useProxy:false});
    let r = await service.query(`SELECT ID, Name, UH__WorkOrder__c, UH__Quantity__c, format(UH__Cost__c), format(UH__TotalCost__c), UH__ExpenseType__c,
                                        format(CreatedDate) 
                                 FROM UH__WO_Expense__c WHERE UH__WorkOrder__c = '${woId}'`);
    return r["records"];
  }
  async getRelatedWOExpenses_strapi(oauthCreds, woId) {
    let url = oauthCreds.instanceURL+`/graphql?query={
      woexpenses(where:{UH__workOrder__r:"${woId}"}){_id, Name, createdAt, UH__workOrder__r{Id, Name}, UH__Cost__c, UH__Quantity__c, UH__totalCost__c, UH__expenseType__c}
    }`.replace(/\s+/g,'').trim();
    let r = await this.http.get(url).toPromise(); // TODO parse dates to local format, ex. new Date('2013-08-10T12:10:15.474Z').toLocaleDateString()+" "+new Date('2013-08-10T12:10:15.474Z').toLocaleTimeString()
    console.log("r expenses strapi", r);
    return r["data"]["woexpenses"];
  }

  async getRelatedWOLabours(oauthCreds, woId) {
    if (!oauthCreds.isSF)
      return this.getRelatedWOLabours_strapi(oauthCreds, woId);
    let service = await DataService.createInstance(oauthCreds, {useProxy:false});
    let r = await service.query(`SELECT ID, Name, UH__WorkOrder__c, UH__Labor__c, UH__Labor__r.Name, UH__Labor__r.UH__Type__c, format(UH__Cost__c),
                                        format(UH__TotalCost__c), UH__hoursCount__c, format(CreatedDate) 
                                 FROM UH__WO_Labor__c WHERE UH__WorkOrder__c = '${woId}'`);
    return r["records"];
  }
  async getRelatedWOLabours_strapi(oauthCreds, woId) {  console.log(" lab Strapi USO")
    let url = oauthCreds.instanceURL+`/graphql?query={
      wolabors(where:{UH__workOrder__r:"${woId}"}){_id, Name, createdAt, UH__workOrder__r{Id, Name}, UH__Labor__r{Name, UH__Type__c}, UH__Cost__c, UH__hoursCount__c, UH__totalCost__c}
    }`.replace(/\s+/g,'').trim();
    let r = await this.http.get(url).toPromise();      console.log("r wolabors strapi", r);
    return r["data"]["wolabors"];       // TODO parse dates to local format, ex. new Date('2013-08-10T12:10:15.474Z').toLocaleDateString()+" "+new Date('2013-08-10T12:10:15.474Z').toLocaleTimeString()
  }

  getRelatedContacts(oauthCreds, selectCond) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT Id, Name, Title, Phone, MobilePhone, Email, AccountId, Account.Name
                          FROM Contact ${selectCond}`);
  }

  getRelatedSP(oauthCreds, selectCond) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT ID, Name, UH__Address__c, UH__City__c, UH__Contact__r.Name
                          FROM UH__ServicePlace__c ${selectCond}`);
  }

  getRelatedPIPs(oauthCreds, selectCond) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});        
    return service.query(`SELECT Id, Name, UH__Contact__c, UH__Contact__r.Name, UH__Product__r.ProductCode, UH__installedDate__c
                          FROM UH__ProductInPlace__c ${selectCond}`);
  }

  getNotesAttachments(oauthCreds, selectCond) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT ID, Name, UH__WorkOrder__c, UH__Labor__c, UH__Labor__r.Name, UH__Labor__r.UH__Type__c, format(UH__Cost__c),
                                 format(UH__TotalCost__c), UH__hoursCount__c, format(CreatedDate) 
                          FROM UH__WO_Labor__c ${selectCond}`);
  } 

}
