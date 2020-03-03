import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddNewDataClassPage } from './add-new-data-class.page';

const routes: Routes = [
  {
    path: '',
    component: AddNewDataClassPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddNewDataClassPage]
})
export class AddNewDataClassPageModule { }
