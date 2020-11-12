import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';
import { UIService } from '../shared/ui.service';
import { Exercise } from './exercise.model';

import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();

    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    private fbSubs: Subscription[] = [];

    constructor(
        private db: AngularFirestore,
        private uiService: UIService,
        private store: Store<fromRoot.State>
    ) { }

    fetcAvailableExercises() {
        this.store.dispatch(new UI.StartLoading);
        this.fbSubs.push(this.db.collection('availableExercises')
            .snapshotChanges()
            .pipe(map(docArray => {
                return docArray.map(doc => {
                    const document: any = doc;
                    return {
                        id: document.payload.doc.id,
                        ...document.payload.doc.data(),
                    }
                })
            }))
            .subscribe(
                (exercises: Exercise[]) => {
                    this.store.dispatch(new UI.StopLoading);
                    this.availableExercises = exercises;
                    this.exercisesChanged.next([...this.availableExercises]);
                },
                error => {
                    this.store.dispatch(new UI.StopLoading);
                    this.uiService.showSnackBar('Fetching exercise failed, please try again later.', null, 3000);
                    this.exercisesChanged.next(null);
                }
            ));
    }

    startExercise(selectedId: string) {
        this.db.doc('availableExercises/' + selectedId).update({
            lastSelected: new Date(),
        })
        this.runningExercise = this.availableExercises.find(exercise => exercise.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed',
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled',
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercise() {
        this.fbSubs.push(this.db.collection('finishedExercises')
            .valueChanges()
            .subscribe(
                (exercises: Exercise[]) => {
                    this.finishedExercisesChanged.next(exercises);
                }));
    };

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}