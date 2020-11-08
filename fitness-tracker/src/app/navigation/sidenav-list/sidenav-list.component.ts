import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  authSubscription: Subscription;
  isAuth: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    })
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }


}
