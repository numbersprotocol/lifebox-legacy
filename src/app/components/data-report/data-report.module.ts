import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataReportComponent } from './data-report.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [DataReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [DataReportComponent],
})
export class DataReportModule { }
