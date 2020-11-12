import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';

import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy{
  availableExercises: Exercise[] = [];
  isLoading$: Observable<boolean>;

  private exerciseSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercise => this.availableExercises = exercise);
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetcAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
  }

}
