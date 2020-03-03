import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CustomDataBarchartPage } from './custom-data-barchart.page';

const routes: Routes = [
  {
    path: '',
    component: CustomDataBarchartPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CustomDataBarchartPage]
})
export class CustomDataBarchartPageModule {}
