import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class WorkordersServiceProvider {

  constructor(public http: HttpClient) {
  }

  loadWOs(oauth){
    let service = DataService.createInstance(oauth, {useProxy:false});
    return service.query(`SELECT id, name, uh__status__c, uh__servicePlace__r.Name, uh__productInPlace__r.Name, uh__description__c, format(UH__Deadline__c)
    FROM uh__workOrder__c`);
  }

  showListWOs(oauth, selectCond) {
    return new Promise((resolve, reject) => {
      if (oauth.isSF) {
        let service = DataService.createInstance(oauth, {useProxy:false});
        service.query(`SELECT id, name, uh__status__c, uh__servicePlace__r.Id, uh__servicePlace__r.Name, uh__servicePlace__r.UH__Address__c,
            uh__Contact__c, uh__Contact__r.Id, uh__Contact__r.Name, uh__productInPlace__r.Id, uh__productInPlace__r.Name, uh__description__c, format(UH__Deadline__c)
            FROM uh__workOrder__c ${selectCond}`)
        .then(r => resolve( r["records"] ));
      } else {
        resolve(this.showListWOs_strapi(oauth, selectCond));
      }
    })
  }

  showListWOs_strapi(oauth, selectCond) {
    return new Promise((resolve, reject) => {
      if (selectCond.includes("LAST_WEEK")) {
        let twoWeksAgoDate = new Date(new Date().setDate(new Date().getDate() - 14) ).toISOString();  //console.log(twoWeksAgoDate);
        selectCond = `UH__startTime__c_gt: "${twoWeksAgoDate}"`;
      } else if (selectCond.includes("TODAY")) {
        let today = new Date(new Date().setUTCHours(0,0,0,0)).toISOString();  //console.log(today);
        selectCond = `UH__startTime__c_gt: '${today}'`;
      } else if (selectCond.includes("Opened")) {
        selectCond = `UH__Status__c: 'Opened'`;
      }
      //let url = `http://localhost:1337/workorder?_sort=Description:asc&_limit=3`;
      let url = oauth.instanceURL+`/graphql?query={
        workorders(
          where: { ${selectCond} }
        ) { _id Name UH__Description__c UH__Deadline__c UH__Status__c UH__ServicePlace__r{ _id, Name, UH__Address__c } UH__Contact__r{ Id Name } UH__productInPlace__r { _id Name } }
      }`//.replace(/\s/g, ' ');
      this.http.get(url).subscribe(
        //data => resolve(data["data"]["workorders"]),  // TODO parse dates to local format, ex. new Date('2013-08-10T12:10:15.474Z').toLocaleDateString()+" "+new Date('2013-08-10T12:10:15.474Z').toLocaleTimeString()
        data => resolve(oauth.strapi.parseResponse(data["data"]["workorders"])), // menjam _id u Id ... kao na SF ... prebaceno na Serviceplace.js afterFetchAll
        err => console.error(err)
      )
    });
  }

  getWODetails(oauth, woID) {
    let service = DataService.createInstance(oauth, {useProxy:false});
    let urlMapping: string = `/services/apexrest/UH/woResourceCtrl/${woID}`;
    return service.apexrest(urlMapping);
  }

  changeWOStatus(oauth, woID, status) {
    let service = DataService.createInstance(oauth, {useProxy:false});
    let reqObject = {
      path: '/services/apexrest/UH/woResourceCtrl/',
      method: 'POST',
      data: {
        woId: woID,
        woStatus: status
      }
    };
    return service.request(reqObject);
  }
}