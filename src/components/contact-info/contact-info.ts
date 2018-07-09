import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'contact-info',
  templateUrl: 'contact-info.html'
})
export class ContactInfoComponent {
  @Input() contact: any;
  @Output() onItemClicked: EventEmitter<any>;
  
  constructor() {
    this.onItemClicked = new EventEmitter();
  }

  itemClicked() {
    let emitObj = {page: 'ContactPage', id: this.contact.Id, url: this.contact.attributes.url};
    this.onItemClicked.emit(emitObj);
  }
}
