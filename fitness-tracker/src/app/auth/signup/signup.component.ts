import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  isLoading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading)
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 18, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  onSubmit(form: NgForm) {
    console.log(form.value)
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    })
  }
}
