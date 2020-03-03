import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'loading', pathMatch: 'full' },
  { path: 'loading', loadChildren: './pages/loading/loading.module#LoadingPageModule' },
  { path: 'tabs', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'tour', loadChildren: './pages/tour/tour.module#TourPageModule' },
  { path: 'work-in-progress', loadChildren: './pages/work-in-progress/work-in-progress.module#WorkInProgressPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'add-new-data-class', loadChildren: './pages/add-new-data-class/add-new-data-class.module#AddNewDataClassPageModule' },
  { path: 'key-generation', loadChildren: './pages/key-generation/key-generation.module#KeyGenerationPageModule' },
  { path: 'steps', loadChildren: './pages/steps/steps.module#StepsPageModule' },
  { path: 'data-location', loadChildren: './pages/data-location/data-location.module#DataLocationPageModule' },
  { path: 'data-pedometer', loadChildren: './pages/data-pedometer/data-pedometer.module#DataPedometerPageModule' },
  { path: 'journal-daily-report', loadChildren: './pages/journal-daily-report/journal-daily-report.module#JournalDailyReportPageModule' },
  { path: 'journal-scatterchart', loadChildren: './pages/journal-scatterchart/journal-scatterchart.module#JournalScatterchartPageModule' },
  { path: 'weekly-report', loadChildren: './pages/weekly-report/weekly-report.module#WeeklyReportPageModule' },
  { path: 'data-barchart', loadChildren: './pages/data-barchart/data-barchart.module#DatabarchartPageModule' },
  { path: 'custom-data-barchart', loadChildren: './pages/custom-data-barchart/custom-data-barchart.module#CustomDataBarchartPageModule' },
  { path: 'dev-tools', loadChildren: './pages/dev-tools/dev-tools.module#DevToolsPageModule' },
  { path: 'data-viewer', loadChildren: './pages/data-viewer/data-viewer.module#DataViewerPageModule' },
  { path: 'log-viewer', loadChildren: './pages/log-viewer/log-viewer.module#LogViewerPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
