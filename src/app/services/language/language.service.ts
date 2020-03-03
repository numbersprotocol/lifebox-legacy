import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Text } from 'src/app/models/text.model';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  text = new Text();
  defaultLanguage: string;
  langChangeSub: Subscription;

  constructor(
    private configService: ConfigService,
    private translate: TranslateService
  ) {
    this.defaultLanguage = this.getDefaultLanguage();
    this.updateText();
  }

  getDefaultLanguage() {
    const defaultLanguage = 'en';
    this.translate.setDefaultLang(defaultLanguage);
    return defaultLanguage;
  }

  async setLanguage(language: string) {
    return Promise.all([
      this.configService.setLanguage(language),
      this.translate.use(language).toPromise(),
    ]).then(() => {
      this.updateText();
    });
  }

  updateText() {
    this.text.dialog.ok.set(this.translate.instant('DIALOG.OK'));
    this.text.dialog.cancel.set(this.translate.instant('DIALOG.CANCEL'));
    this.text.dialog.clear.set(this.translate.instant('DIALOG.CLEAR'));
    this.text.dialog.confirm.set(this.translate.instant('DIALOG.CONFIRM'));
    this.text.loading.initialize.set(this.translate.instant('LOADING.INITIALIZE'));
    this.text.login.header.set(this.translate.instant('LOGIN.HEADER'));
    this.text.login.button.set(this.translate.instant('LOGIN.BUTTON'));
    this.text.login.createKeyButton.set(this.translate.instant('LOGIN.CREATE_KEY_BUTTON'));
    this.text.tabs.home.set(this.translate.instant('TABS.HOME'));
    this.text.tabs.record.set(this.translate.instant('TABS.RECORD'));
    this.text.tabs.journal.set(this.translate.instant('TABS.JOURNAL'));
    this.text.tabs.feed.set(this.translate.instant('TABS.FEED'));
    this.text.sideMenu.header.set(this.translate.instant('SIDE_MENU.HEADER'));
    this.text.sideMenu.profile.set(this.translate.instant('SIDE_MENU.PROFILE'));
    this.text.sideMenu.privacy.set(this.translate.instant('SIDE_MENU.PRIVACY'));
    this.text.sideMenu.about.set(this.translate.instant('SIDE_MENU.ABOUT'));
    this.text.sideMenu.help.set(this.translate.instant('SIDE_MENU.HELP'));
    this.text.sideMenu.version.set(this.translate.instant('SIDE_MENU.VERSION'));
    this.text.sideMenu.signOutButton.set(this.translate.instant('SIDE_MENU.SIGN_OUT_BUTTON'));
    this.text.profile.header.set(this.translate.instant('PROFILE.HEADER'));
    this.text.profile.changeProfilePictureButton.set(this.translate.instant('PROFILE.CHANGE_PROFILE_PICTURE_BUTTON'));
    this.text.profile.firstName.set(this.translate.instant('PROFILE.FIRST_NAME'));
    this.text.profile.lastName.set(this.translate.instant('PROFILE.LAST_NAME'));
    this.text.profile.email.set(this.translate.instant('PROFILE.EMAIL'));
    this.text.profile.birthday.set(this.translate.instant('PROFILE.BIRTHDAY'));
    this.text.profile.gender.set(this.translate.instant('PROFILE.GENDER'));
    this.text.profile.nationality.set(this.translate.instant('PROFILE.NATIONALITY'));
    this.text.profile.city.set(this.translate.instant('PROFILE.CITY'));
    this.text.profile.updateButton.set(this.translate.instant('PROFILE.UPDATE_BUTTON'));
    this.text.profile.preferNotToShow.set(this.translate.instant('PROFILE.PREFER_NOT_TO_SHOW'));
    this.text.profile.male.set(this.translate.instant('PROFILE.MALE'));
    this.text.profile.female.set(this.translate.instant('PROFILE.FEMALE'));
    this.text.profile.nonbinary.set(this.translate.instant('PROFILE.NONBINARY'));
    this.text.profile.language.set(this.translate.instant('PROFILE.LANGUAGE'));
    this.text.privacy.header.set(this.translate.instant('PRIVACY.HEADER'));
    this.text.privacy.backButton.set(this.translate.instant('PRIVACY.BACK_BUTTON'));
    this.text.about.header.set(this.translate.instant('ABOUT.HEADER'));
    this.text.help.header.set(this.translate.instant('HELP.HEADER'));
    this.text.help.tourP1Title.set(this.translate.instant('HELP.TOUR_P1_TITLE'));
    this.text.help.tourP1Desc.set(this.translate.instant('HELP.TOUR_P1_DESC'));
    this.text.help.tourP2Title.set(this.translate.instant('HELP.TOUR_P2_TITLE'));
    this.text.help.tourP2Desc.set(this.translate.instant('HELP.TOUR_P2_DESC'));
    this.text.help.tourP3Title.set(this.translate.instant('HELP.TOUR_P3_TITLE'));
    this.text.help.tourP3Desc.set(this.translate.instant('HELP.TOUR_P3_DESC'));
    this.text.help.tourP4Title.set(this.translate.instant('HELP.TOUR_P4_TITLE'));
    this.text.help.tourP4Desc.set(this.translate.instant('HELP.TOUR_P4_DESC'));
    this.text.help.tourP5Title.set(this.translate.instant('HELP.TOUR_P5_TITLE'));
    this.text.help.tourP5Desc.set(this.translate.instant('HELP.TOUR_P5_DESC'));
    this.text.help.continue.set(this.translate.instant('HELP.CONTINUE'));
    this.text.home.header.set(this.translate.instant('HOME.HEADER'));
    this.text.home.title.set(this.translate.instant('HOME.TITLE'));
    this.text.visualization.weekDays.sun.set(this.translate.instant('VISUALIZATION.WEEK_DAYS.SUN'));
    this.text.visualization.weekDays.mon.set(this.translate.instant('VISUALIZATION.WEEK_DAYS.MON'));
    this.text.visualization.weekDays.tue.set(this.translate.instant('VISUALIZATION.WEEK_DAYS.TUE'));
    this.text.visualization.weekDays.wed.set(this.translate.instant('VISUALIZATION.WEEK_DAYS.WED'));
    this.text.visualization.weekDays.thu.set(this.translate.instant('VISUALIZATION.WEEK_DAYS.THU'));
    this.text.visualization.weekDays.fri.set(this.translate.instant('VISUALIZATION.WEEK_DAYS.FRI'));
    this.text.visualization.weekDays.sat.set(this.translate.instant('VISUALIZATION.WEEK_DAYS.SAT'));
    this.text.visualization.shareButton.set(this.translate.instant('VISUALIZATION.SHARE_BUTTON'));
    this.text.visualization.barChart.header.set(this.translate.instant('VISUALIZATION.BAR_CHART.HEADER'));
    this.text.visualization.barChart.inLast7Days.set(this.translate.instant('VISUALIZATION.BAR_CHART.IN_LAST_7_DAYS'));
    this.text.visualization.barChart.today.set(this.translate.instant('VISUALIZATION.BAR_CHART.TODAY'));
    this.text.visualization.barChart.average.set(this.translate.instant('VISUALIZATION.BAR_CHART.AVERAGE'));
    this.text.visualization.barChart.max.set(this.translate.instant('VISUALIZATION.BAR_CHART.MAX'));
    this.text.visualization.barChart.min.set(this.translate.instant('VISUALIZATION.BAR_CHART.MIN'));
    this.text.visualization.scatterPlot.header.set(this.translate.instant('VISUALIZATION.SCATTER_PLOT.HEADER'));
    this.text.visualization.scatterPlot.dataOfPast.set(this.translate.instant('VISUALIZATION.SCATTER_PLOT.DATA_OF_PAST'));
    this.text.dataReport.notAvailable.set(this.translate.instant('DATA_REPORT.NOT_AVAILABLE'));
    this.text.dataReport.temperature.set(this.translate.instant('DATA_REPORT.TEMPERATURE'));
    this.text.dataReport.AQ.set(this.translate.instant('DATA_REPORT.AQ'));
    this.text.dataReport.AQI.set(this.translate.instant('DATA_REPORT.AQI'));
    this.text.dataReport.AQIStatus.good.set(this.translate.instant('DATA_REPORT.AQI_STATUS.GOOD'));
    this.text.dataReport.AQIStatus.moderate.set(this.translate.instant('DATA_REPORT.AQI_STATUS.MODERATE'));
    this.text.dataReport.AQIStatus.unhealthy.set(this.translate.instant('DATA_REPORT.AQI_STATUS.UNHEALTHY'));
    this.text.dataReport.AQIStatus.veryUnhealthy.set(this.translate.instant('DATA_REPORT.AQI_STATUS.VERY_UN'));
    this.text.dataReport.AQIStatus.hazardous.set(this.translate.instant('DATA_REPORT.AQI_STATUS.GOOD'));
    this.text.dataReport.AQIStatus.unknown.set(this.translate.instant('DATA_REPORT.AQI_STATUS.GOOD'));
    this.text.dataReport.humidity.set(this.translate.instant('DATA_REPORT.HUMIDITY'));
    this.text.dataReport.wokeUpTime.set(this.translate.instant('DATA_REPORT.WOKE_UP_TIME'));
    this.text.dataReport.sleepingTime.set(this.translate.instant('DATA_REPORT.SLEEPING_TIME'));
    this.text.dataReport.hrs.set(this.translate.instant('DATA_REPORT.HRS'));
    this.text.dataReport.steps.set(this.translate.instant('DATA_REPORT.STEPS'));
    this.text.dataReport.indoor.set(this.translate.instant('DATA_REPORT.INDOOR'));
    this.text.dataReport.outdoor.set(this.translate.instant('DATA_REPORT.OUTDOOR'));
    this.text.dataReport.addCustomClassButton.set(this.translate.instant('DATA_REPORT.ADD_CUSTOM_CLASS_BUTTON'));
    this.text.dataReport.shareButton.set(this.translate.instant('DATA_REPORT.SHARE_BUTTON'));
    this.text.addDataClass.header.set(this.translate.instant('ADD_DATA_CLASS.HEADER'));
    this.text.addDataClass.name.set(this.translate.instant('ADD_DATA_CLASS.NAME'));
    this.text.addDataClass.expectedMax.set(this.translate.instant('ADD_DATA_CLASS.EXPECTED_MAX'));
    this.text.addDataClass.expectedMin.set(this.translate.instant('ADD_DATA_CLASS.EXPECTED_MIN'));
    this.text.addDataClass.interval.set(this.translate.instant('ADD_DATA_CLASS.INTERVAL'));
    this.text.addDataClass.unit.set(this.translate.instant('ADD_DATA_CLASS.UNIT'));
    this.text.addDataClass.calories.set(this.translate.instant('ADD_DATA_CLASS.CALORIES'));
    this.text.addDataClass.kcal.set(this.translate.instant('ADD_DATA_CLASS.KCAL'));
    this.text.addDataClass.doneButton.set(this.translate.instant('ADD_DATA_CLASS.DONE_BUTTON'));
    this.text.record.header.set(this.translate.instant('RECORD.HEADER'));
    this.text.record.sensors.set(this.translate.instant('RECORD.SENSORS'));
    this.text.record.pedometer.set(this.translate.instant('RECORD.PEDOMETER'));
    this.text.record.location.set(this.translate.instant('RECORD.LOCATION'));
    this.text.record.gyroscope.set(this.translate.instant('RECORD.GYROSCOPE'));
    this.text.record.beta.set(this.translate.instant('RECORD.BETA'));
    this.text.record.customClass.set(this.translate.instant('RECORD.CUSTOM_CLASSES'));
    this.text.record.updateButton.set(this.translate.instant('RECORD.UPDATE_BUTTON'));
    this.text.journal.header.set(this.translate.instant('JOURNAL.HEADER'));
    this.text.journal.activity.set(this.translate.instant('JOURNAL.ACTIVITY'));
    this.text.feed.header.set(this.translate.instant('FEED.HEADER'));
    this.text.feed.msg.set(this.translate.instant('FEED.MSG'));
  }
}
