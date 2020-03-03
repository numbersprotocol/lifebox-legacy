import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { JournalScatterchartPage } from './journal-scatterchart.page';

const routes: Routes = [
  {
    path: '',
    component: JournalScatterchartPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [JournalScatterchartPage]
})
export class JournalScatterchartPageModule {}
