import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public minDate: Date;
  public maxDate: Date;
  constructor() { }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 18, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  onSubmit(form: NgForm) {
    console.log(form.value)
  }

}