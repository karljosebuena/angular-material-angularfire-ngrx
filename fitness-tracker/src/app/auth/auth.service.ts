import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subject } from 'rxjs/Subject';
import { TrainingService } from '../training/training.service';

import { AuthData } from './auth-data.model';
import { User } from './user.model';

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticaetd: boolean;

    constructor(private router: Router, private afAuth: AngularFireAuth, private trainingService: TrainingService) {}

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
                this.router.navigate(['/login']);
            }
        })
    }

    registerUser(authData: AuthData) {
        this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            console.log(result)
            this.authSuccessfully();
        })
        .catch(error => {
            console.error(error);
        })

    }

    login(authData: AuthData) {
        this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error(error);
        });
    }

    logOut() {
        this.afAuth.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticaetd;
    }

}