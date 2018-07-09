import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'case-info',
  templateUrl: 'case-info.html'
})
export class CaseInfoComponent {
  @Input() case: any;
  @Output() onItemClicked: EventEmitter<any>;
  
  constructor() {
    this.onItemClicked = new EventEmitter();
  }

  itemClicked() {
    let emitObj = {'page': "from case-info"};
    this.onItemClicked.emit(emitObj);
  }
}
