import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';

@Injectable()
export class RelatedListsDataProvider {

  constructor() {}

  getRelatedCases(oauthCreds, selectCond) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT ID, CaseNumber, Subject, Priority, format(CreatedDate) FROM Case ${selectCond}`);
  }

  getRelatedWOs(oauthCreds, selectCond) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT id, name, uh__status__c, uh__servicePlace__r.Name, uh__productInPlace__r.Name, uh__description__c, format(UH__Deadline__c)
                          FROM UH__workOrder__c ${selectCond}`);
  }

  getRelatedWOParts(oauthCreds, selectCond) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT ID, Name, UH__WorkOrder__c, UH__Part__c, UH__Part__r.Name, UH__Part__r.UH__Type__c, UH__Quantity__c, format(UH__Cost__c),
                                 format(UH__TotalCost__c), format(CreatedDate) 
                          FROM UH__WO_Part__c ${selectCond}`);
  }

  getRelatedWOExpenses(oauthCreds, selectCond) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT ID, Name, UH__WorkOrder__c, UH__Quantity__c, format(UH__Cost__c), format(UH__TotalCost__c), UH__ExpenseType__c,
                                 format(CreatedDate) 
                          FROM UH__WO_Expense__c ${selectCond}`);
  }

  getRelatedWOLabours(oauthCreds, selectCond) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT ID, Name, UH__WorkOrder__c, UH__Labor__c, UH__Labor__r.Name, UH__Labor__r.UH__Type__c, format(UH__Cost__c),
                                 format(UH__TotalCost__c), UH__hoursCount__c, format(CreatedDate) 
                          FROM UH__WO_Labor__c ${selectCond}`);
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

  getNotesAttachments(oauthCreds, selectCond) {
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT ID, Name, UH__WorkOrder__c, UH__Labor__c, UH__Labor__r.Name, UH__Labor__r.UH__Type__c, format(UH__Cost__c),
                                 format(UH__TotalCost__c), UH__hoursCount__c, format(CreatedDate) 
                          FROM UH__WO_Labor__c ${selectCond}`);
  } 

}
