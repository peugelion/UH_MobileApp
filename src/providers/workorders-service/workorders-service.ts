import { Injectable } from '@angular/core';
import { DataService } from 'forcejs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class WorkordersServiceProvider {

  constructor(public http: HttpClient) {}

  async showListWOs(oauth, selectCond) {
      if (!oauth.isSF)
        return this.showListWOs_strapi(oauth, selectCond);
      let service = await DataService.createInstance(oauth, {useProxy:false});
      let r = await service.query(`SELECT id, name, uh__status__c, uh__servicePlace__r.Id, uh__servicePlace__r.Name, uh__servicePlace__r.UH__Address__c,
          uh__Contact__c, uh__Contact__r.Id, uh__Contact__r.Name, uh__productInPlace__r.Id, uh__productInPlace__r.Name, uh__description__c, format(UH__Deadline__c)
          FROM uh__workOrder__c ${selectCond}`);
      return r["records"];
  }
  async showListWOs_strapi(oauth, selectCond) {
    if (selectCond.includes("LAST_WEEK")) {
      let twoWeksAgo = new Date(new Date().setDate(new Date().getDate() - 14) ).toISOString();  //console.log(twoWeksAgoDate);
      selectCond = `UH__Status__c_ne: "Rejected", UH__startTime__c_gte: "${twoWeksAgo}"`;
    } else if (selectCond.includes("TODAY")) {
      let todayDate = new Date(new Date().setUTCHours(0,0,0,0)).toISOString();  //console.log(today);
      selectCond = `UH__Status__c_ne: "Rejected", UH__startTime__c_gte: "${todayDate}"`;
    } else if (selectCond.includes("Open"))
      selectCond = `UH__Status__c: "Open"`;
    else
      selectCond = `UH__Status__c_ne: "Rejected"`;

    //let url = `http://localhost:1337/workorder?_sort=Description:asc&_limit=3`;
    let url = oauth.instanceURL+`/graphql?query={
      workorders(
        where: { ${selectCond} }
      ) { _id Id Name UH__Description__c UH__Deadline__c UH__Status__c UH__ServicePlace__r{ _id, Name, UH__Address__c } UH__Contact__r{ Id Name } UH__productInPlace__r { _id Name } }
    }`//.replace(/\s/g, ' ');
    let r = await this.http.get(url).toPromise(); // TODO parse dates to local format, ex. new Date('2013-08-10T12:10:15.474Z').toLocaleDateString()+" "+new Date('2013-08-10T12:10:15.474Z').toLocaleTimeString()
    return r["data"]["workorders"];
  }

  async getWODetails(oauth, woID) {
    if (!oauth.isSF)
      return this.getWODetails_strapi(oauth, woID);
    let service = DataService.createInstance(oauth, {useProxy:false});
    let urlMapping: string = `/services/apexrest/UH/woResourceCtrl/${woID}`;
    return service.apexrest(urlMapping);
  }
  async getWODetails_strapi(oauth, woID) {
    //let res = await oauth.strapi.getEntry('workorder', woID);
    let res = await oauth.strapi.request("get", "woResourceCtrl/"+woID, {})
    res.currWO = res;
    res.woExpenses = []; //todo
    res.woLabors = [];   //todo
    res.woParts = [];    //todo
    console.log("Res", res);
    return res;
  }

  async changeWOStatus(oauth, woID, status) {
    if (!oauth.isSF)
      return this.changeWOStatus_strapi(oauth, woID, status);
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
  async changeWOStatus_strapi(oauth, woID, status) {
    let reqObject = await oauth.strapi.updateEntry('workorder', woID, {
      id: woID,
      UH__Status__c: status
    });
    //return reqObject;
    return this.getWODetails(oauth, woID);
  }
}