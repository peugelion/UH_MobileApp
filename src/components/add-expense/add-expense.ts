import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'add-expense',
  templateUrl: 'add-expense.html'
})
export class AddExpenseComponent {

  private newExpense: FormGroup;

  constructor(
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder,
    params: NavParams
  ) {
    this.newExpense = this.formBuilder.group({
      type: ['---none---'],
      cost: ['', Validators.required],
      qty:  ['']
    });
  }

  dismiss() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }

  saveExpense(formData: {}): void {
    console.log('new expense === ', formData);
  }
}
