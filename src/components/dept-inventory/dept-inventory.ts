import { Component, Input } from '@angular/core';
import { DataService } from 'forcejs';
import { OAuthServiceProvider } from '../../providers/o-auth-service/o-auth-service';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'dept-inventory',
  templateUrl: 'dept-inventory.html'
})

export class DeptInventoryComponent {

  @Input() showCloseBtn: boolean = true;

  private unitsInStock:   Array<any>;
  private userWarehouses: Array<any>;

  constructor(private oauth: OAuthServiceProvider, private viewCtrl: ViewController) {
    this.getWarehouseAndStock();
  }

  getWarehouseAndStock() {
    this.oauth.getOAuthCredentials()
      .then(oauth => {
        let service = DataService.createInstance(oauth, {useProxy:false});
        service.apexrest('/services/apexrest/UH/deptWarehouseCtrl/')
          .then(response => {
            console.log('response == ', response);
            this.userWarehouses = response.userWarehouses;
            this.unitsInStock = response.unitsInStock;
          })
          .catch(error => {
            console.log(error);
          });
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
