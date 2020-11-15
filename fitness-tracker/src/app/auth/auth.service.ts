import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from 'angularfire2/auth';
import { UIService } from '../shared/ui.service';
import { TrainingService } from '../training/training.service';

import { AuthData } from './auth-data.model';

import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private trainingService: TrainingService,
        private uiService: UIService,
        private store: Store<fromRoot.State>
    ) { }

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.store.dispatch(new Auth.SetAuthenticated());
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscriptions();
                this.store.dispatch(new Auth.SetUnauthenticated());
                this.router.navigate(['/']);
            }
        })
    }

    registerUser(authData: AuthData) {
        this.store.dispatch(new UI.StartLoading());
        this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                console.log(result)
            })
            .catch(error => {
                this.uiService.showSnackBar(error.message, null, 3000);
            })
            .finally(() => {
                this.store.dispatch(new UI.StopLoading());
            })
    }

    login(authData: AuthData) {
        this.store.dispatch(new UI.StartLoading());
        this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                console.log(result);
            })
            .catch(error => {
                this.uiService.showSnackBar(error.message, null, 3000);
            })
            .finally(() => {
                this.store.dispatch(new UI.StopLoading());
            })
    }

    logOut() {
        this.afAuth.auth.signOut();
    }

}