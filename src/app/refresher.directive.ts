import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[Refresher]'
})
export class Refresher {

 constructor() { }
  // @HostListener('click') onClick() {
    // Your click functionality
  //}

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
}