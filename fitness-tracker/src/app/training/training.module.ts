import { NgModule } from '@angular/core';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingsComponent } from './past-trainings/past-trainings.component';
import { TrainingComponent } from './training.component';
import { StopTrainingComponent } from './current-training/stop-training.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFirestoreModule } from 'angularfire2/firestore';

@NgModule({
    declarations: [
        TrainingComponent,
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingsComponent,
        StopTrainingComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule,
        AngularFirestoreModule,
    ],
})
export class TrainingModule { }