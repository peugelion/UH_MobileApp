import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

/**
 * Generated class for the RelatedTabComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'related-tab',
  templateUrl: 'related-tab.html'
})
export class RelatedTabComponent {
  
  active: number = -1 // (click) WOs or PIPs: 0 or 1
  @Input() relatedListArr: Array<any> //WOs: Array<any>; PIPs: Array<any>; AOs: Array<any>; AHs: Array<any>; NandAs: Array<any>

  constructor(public navCtrl: NavController) {}

  toggleSection(i) {
    if (this.relatedListArr[i].length)
      this.active = (this.active != i && this.relatedListArr[i][1].length) ?  i : -1; // WO (0), PiP (1), or none (-1)
  }

  gotoItemPage(itemId) {
    this.navCtrl.push(this.relatedListArr[this.active][0][0][1], {"id": itemId});
  }

}
