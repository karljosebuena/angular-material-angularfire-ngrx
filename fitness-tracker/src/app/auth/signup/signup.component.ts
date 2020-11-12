import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  minDate: Date;
  maxDate: Date;
  isLoading: boolean;

  private loadingSubs: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UIService,
  ) { }

  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => this.isLoading = isLoading);
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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

}
