import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  authSubscription: Subscription;
  isAuth: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    })
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

}
