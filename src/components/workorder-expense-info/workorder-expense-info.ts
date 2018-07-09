import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'workorder-expense-info',
  templateUrl: 'workorder-expense-info.html'
})
export class WorkorderExpenseInfoComponent {
  @Input() woExpense: any;
  @Output() onItemClicked: EventEmitter<any>;
  
  constructor() {
    this.onItemClicked = new EventEmitter();
  }

  itemClicked() {
    let emitObj = {'page': "from wo-labour-info"};
    this.onItemClicked.emit(emitObj);
  }
}
