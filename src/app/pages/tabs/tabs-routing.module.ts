import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: '../home/home.module#HomePageModule'
          }
        ]
      },
      {
        path: 'control-center',
        children: [
          {
            path: '',
            loadChildren: '../control-center/control-center.module#ControlCenterPageModule'
          }
        ]
      },
      {
        path: 'journal',
        children: [
          {
            path: '',
            loadChildren: '../journal/journal.module#JournalPageModule'
          }
        ]
      },
      {
        path: 'feed',
        children: [
          {
            path: '',
            loadChildren: '../feed/feed.module#FeedPageModule'
          }
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
