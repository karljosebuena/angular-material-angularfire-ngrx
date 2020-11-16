import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { UIService } from '../shared/ui.service';
import { Exercise } from './exercise.model';

import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import { Store } from '@ngrx/store';
// import { take } from 'rxjs/operators';

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
        private store: Store<fromTraining.State>
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
                    this.store.dispatch(new Training.SetAvailableTrainings(exercises));
                },
                error => {
                    this.store.dispatch(new UI.StopLoading);
                    this.uiService.showSnackBar('Fetching exercise failed, please try again later.', null, 3000);
                    this.exercisesChanged.next(null);
                }
            ));
    }

    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTraining)
            .pipe(take(1))
            .subscribe(exercise => {
                this.addDataToDatabase({
                    ...exercise,
                    date: new Date(),
                    state: 'completed',
                });
                this.store.dispatch(new Training.StopTraining());
            });
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveTraining)
            .pipe(take(1))
            .subscribe(exercise => {
                this.addDataToDatabase({
                    ...exercise,
                    duration: exercise.duration * (progress / 100),
                    calories: exercise.calories * (progress / 100),
                    date: new Date(),
                    state: 'cancelled',
                });
                this.store.dispatch(new Training.StopTraining());
            });
    }

    fetchCompletedOrCancelledExercise() {
        this.fbSubs.push(this.db.collection('finishedExercises')
            .valueChanges()
            .subscribe(
                (exercises: Exercise[]) => {
                    this.store.dispatch(new Training.SetFinishedTrainings(exercises));
                }));
    };

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}