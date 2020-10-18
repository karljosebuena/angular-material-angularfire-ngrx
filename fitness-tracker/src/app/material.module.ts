import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule
    ],
    exports: [
        MatButtonModule,
        MatIconModule
    ]
})
export class MaterialModule {

}