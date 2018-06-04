import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';

@Injectable()
export class TechniciansServiceProvider {

  constructor() {}

  loadTechnicians(oauthCreds){
    let service = DataService.createInstance(oauthCreds, {useProxy:false});
    return service.query(`SELECT Id, Name FROM UH__Technician__c WHERE UH__Active__c=true`)  
      .then(result => {
        return result.records;
      });
  }

  // loadTechnicians(oauthCreds) {
  //   return new Promise((resolve, reject) => {
  //     let service = DataService.createInstance(oauthCreds, {useProxy:false});
  //     service.query(`SELECT Id, Name FROM UH__Technician__c WHERE UH__Active__c=true`)
  //       .then(result => {
  //         let technicians = result.records.map(singleT => {
  //           console.log('singleT: ', singleT);
  //           let obj = {};
  //           // obj["typeName"] = woPart.UH__Part__r.Name;
  //           obj["relatedObjectURL"] = singleT.attributes.url;

  //           service.apexrest(singleT.attributes.url)
  //             .then(r => {
  //               console.log('r', r);
            
  //               console.log('obj: ', obj);
  //               return obj;
  //             });
  //         });
  //         resolve(technicians);
  //       });
  //   });
  // }
  

  // getSobject(service, table, id, relatedTable) {
  //   return new Promise((resolve, reject) => {
  //       let urlMapping: string = '/services/data/v41.0/sobjects/'+table+'/'+id+'/'+ relatedTable; // ex.:  '/services/data/v41.0/sobjects/UH__Technician__c/a0C15000014tWvvEAE/UH__defaultDepartment__r'
  //       console.log("urlMapping : ", urlMapping);
  //       resolve(service.apexrest(urlMapping));
  //   });
  // };

  // getSobjectLatestApiUrl(service, table, id, relatedTable) {
  //// getSobject(service, id, table, relatedTable) {
  //   return new Promise((resolve, reject) => {
  //     service.query(`
  //       SELECT Id
  //       FROM ${table}
  //       WHERE Id='${id}'`)
  //     .then(results => {
  //       let urlMapping: string = results.records[0].attributes.url +'/'+ relatedTable; // ex.:  '/services/data/v41.0/sobjects/UH__Technician__c/a0C15000014tWvvEAE/UH__defaultDepartment__r'
  //       console.log("urlMapping : ", urlMapping);
  //       resolve(service.apexrest(urlMapping));
  //     })
  //     .catch(error => console.log('getSobject error : ', error))
  //   });
  // }

  // getTechnicianById_xx(oauthCreds, id){
  //   let service = DataService.createInstance(oauthCreds, {useProxy:false});
  //   //return service.query(`SELECT Id, Name, UH__Active__c, UH__User__c, UH__username__c FROM UH__Technician__c WHERE Id='${id}'`);
  //   return service.query(`
  //     SELECT
  //       Id, Name, UH__Active__c,
  //       UH__defaultDepartment__c, UH__defaultDepartment__r.Name,
  //       UH__Location__c, UH__imei__c, UH__User__c, UH__User__r.CompanyName, UH__User__r.Username, UH__username__c,
  //       UH__gpsDatetime__c, UH__speed__c, UH__altitude__c, UH__heading__c, UH__gpstatus__c,
  //       UH__address__c, UH__provider__c, UH__battery__c
  //     FROM UH__Technician__c
  //     WHERE Id='${id}'
  //   `);
  // }

  // getTechnicianById(oauthCreds, id) {
  //   let service = DataService.createInstance(oauthCreds, {useProxy:false});;
  //   let urlMapping: string = `/services/data/v41.0/sobjects/UH__Technician__c/${id}`;
  //   var techObj = service.apexrest(urlMapping);
  //   return service.apexrest(urlMapping);
  // }

  // getSobjectUrl(oauthCreds, id, table) {
  //   let service = DataService.createInstance(oauthCreds, {useProxy:false});
  //   //var tech = service.query(`
  //   return service.query(`
  //     SELECT Id
  //     FROM ${table}
  //     WHERE Id='${id}'
  //   `)
  //   .then(results => {
  //     return results.records[0].attributes.url;
  //   });
  // }

  // getTechnicianDepartment(oauthCreds, id, table) {
  //   return new Promise((resolve, reject) => {
  //     let service = DataService.createInstance(oauthCreds, {useProxy:false});
  //     service.query(`
  //       SELECT Id
  //       FROM ${table}
  //       WHERE Id='${id}'
  //     `)
  //     .then(results => {
  //       let urlMapping: string = results.records[0].attributes.url+'/UH__defaultDepartment__r';
  //       return(service.apexrest(urlMapping))
  //       .then(techDept => {
  //         resolve(techDept);
  //       });
  //     });
  //   });
  // }

}

