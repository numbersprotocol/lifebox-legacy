import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JournalDailyReportPage } from './journal-daily-report.page';
import { DataReportModule } from 'src/app/components/data-report/data-report.module';

const routes: Routes = [
  {
    path: '',
    component: JournalDailyReportPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    DataReportModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JournalDailyReportPage]
})
export class JournalDailyReportPageModule {}
