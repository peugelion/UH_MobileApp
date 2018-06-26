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
  
  @Input()
  active: number = -1 // (click) WOs or PIPs: 0 or 1
  @Input()
  clickPages = []
  @Input()
  labels = [
    // [
    //   ['Work Orders'],
    //   ["Product in Place", "Description", "Estimated completion date", "Status"],
    // ],
    // [
    //   ['Products in Place'],
    //   ["Contact", "Product code", "Install Date"]
    // ],
  ];
  //WOs: Array<any>; PIPs: Array<any>; AOs: Array<any>; AHs: Array<any>; NandAs: Array<any>
  @Input()
  // relatedListArr: Array< Array<{}> >
  relatedListArr: Array<any>


  constructor(public navCtrl: NavController) {
    //console.log("inputs", this.active, this.labels, this.relatedListArr);
  }

  ngOnInit() {
    // console.log(" spPromise - ngOnInit", this.spPromise); // undefined, ako stavim " | async" onda je null  // https://stackoverflow.com/questions/39933180/input-with-promise-angular2
    //console.log(" lat - ngOnInit", this.lat);
    //console.log("inputs ngOnInit", this.active, this.labels, this.relatedListArr);
  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      // if (this.addr) {
      //     this.initmap();
      // }
      //console.log("inputs ngOnChanges", this.active, this.labels, this.relatedListArr);
    } catch(err) {
      console.log(err);
    }
  }


  toggleSection(i) {
    if (this.relatedListArr[i].length)
      this.active = (this.active != i) ?  i : -1; // WO (0), PiP (1), or none (-1)
  }

  gotoItemPage(itemId) {
    // if (this.active) // 1 or 0 (pip or wo)
    //   this.navCtrl.push('ProductInPlaceDetailsPage', {"id": itemId});
    // else
    //   this.navCtrl.push('WorkorderDetailsPage', {"id": itemId});

    this.navCtrl.push(this.clickPages[this.active], {"id": itemId});
  }

}
