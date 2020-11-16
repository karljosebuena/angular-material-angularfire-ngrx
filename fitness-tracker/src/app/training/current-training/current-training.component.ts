import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TrainingService } from '../training.service';

import { StopTrainingComponent } from './stop-training.component';

import * as fromTraining from '../training.reducer';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  @Output() trainingExit = new EventEmitter<void>();

  progress = 0;
  timer: number;

  constructor(
    private store: Store<fromTraining.State>,
    private dialog: MatDialog,
    private trainingService: TrainingService
  ) { }

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    this.store.select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(exercise => {
        const step = exercise.duration / 100 * 1000;
        this.timer = setInterval(() => {
          this.progress = this.progress + 1;
          if (this.progress >= 100) {
            this.trainingService.completeExercise();
            clearInterval(this.timer);
          }
        }, step)
      });
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.trainingService.cancelExercise(this.progress)
      } else {
        this.startOrResumeTimer();
      }
    })
  }

}
