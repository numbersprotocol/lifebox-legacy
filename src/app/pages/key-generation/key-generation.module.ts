import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { KeyGenerationPage } from './key-generation.page';

const routes: Routes = [
  {
    path: '',
    component: KeyGenerationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [KeyGenerationPage]
})
export class KeyGenerationPageModule { }
