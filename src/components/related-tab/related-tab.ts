import { Component, Input, SimpleChanges } from '@angular/core';
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

  text: string;
  
  active: number = -1 // (click) WOs or PIPs: 0 or 1
  //WOs: Array<any>; PIPs: Array<any>; AOs: Array<any>; AHs: Array<any>; NandAs: Array<any>
  @Input() relatedListArr: Array<any>


  constructor(public navCtrl: NavController) {
    //console.log("inputs", this.active, this.labels, this.relatedListArr);
  }


  ngOnChanges(changes: SimpleChanges) {
    try {
      // if (this.addr) {
      //     this.initmap();
      // }
      //console.log("inputs ngOnChanges", this.active, this.relatedListArr);
    } catch(err) {
      console.log(err);
    }
  }


  toggleSection(i) {
    if (this.relatedListArr[i].length)
      this.active = (this.active != i && this.relatedListArr[i][1].length) ?  i : -1; // WO (0), PiP (1), or none (-1)
  }

  gotoItemPage(itemId) {
    //this.navCtrl.push(this.clickPages[this.active], {"id": itemId});
    // this.navCtrl.push(this.labels[this.active][0][1], {"id": itemId});
    this.navCtrl.push(this.relatedListArr[this.active][0][0][1], {"id": itemId});
  }

}
