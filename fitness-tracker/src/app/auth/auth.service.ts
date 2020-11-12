import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import { UIService } from '../shared/ui.service';
import { TrainingService } from '../training/training.service';

import { AuthData } from './auth-data.model';
import * as fromApp from '../app.reducer';

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticaetd: boolean;

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private trainingService: TrainingService,
        private uiService: UIService,
        private store: Store<{ ui: fromApp.State }>
    ) { }

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticaetd = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscriptions();
                this.isAuthenticaetd = false;
                this.authChange.next(false);
                this.router.navigate(['/']);
            }
        })
    }

    registerUser(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch({ type: 'START_LOADING' });
        this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                console.log(result)
            })
            .catch(error => {
                this.uiService.showSnackBar(error.message, null, 3000);
            })
            .finally(() => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });
            })
    }

    login(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        this.store.dispatch({ type: 'START_LOADING' });
        this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                this.uiService.showSnackBar(error.message, null, 3000);
            })
            .finally(() => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch({ type: 'STOP_LOADING' });
            })
    }

    logOut() {
        this.afAuth.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticaetd;
    }

}