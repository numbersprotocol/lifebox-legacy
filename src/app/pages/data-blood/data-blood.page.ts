import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import * as d3 from 'd3';
import * as d3Array from 'd3-array';
import * as saveSvgAsPng from 'save-svg-as-png';

import { DatetimeService } from '../../services/datetime/datetime.service';
import { VisualizationService } from '../../services/visualization/visualization.service';
import { VisualizationUtilityService } from '../../services/visualization/visualization-utility.service';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-data-blood',
  templateUrl: './data-blood.page.html',
  styleUrls: ['./data-blood.page.scss'],
})
export class DatabarchartPage implements OnInit {
  width: number = 900;
  height: number = 636;
  margin = { top: 60, right: 60, bottom: 90, left: 60, label: 80 };
  x: any;
  y: any;
  svg: any;
  g: any;
  data: any;
  className: string;
  dataType: string;
  dataUnit: string;
  barColor: string;
  hollowArray: any;
  text = {
    header: '',
    inLast7Days: '',
    today: '',
    average: '',
    max: '',
    min: '',
    shareButton: '',
    weekDays: {
      sun: '',
      mon: '',
      tue: '',
      wed: '',
      thu: '',
      fri: '',
      sat: '',
    }
  };
  subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private socialSharing: SocialSharing,
    private datetimeService: DatetimeService,
    private language: LanguageService,
    private visualTool: VisualizationService,
    private visualUtility: VisualizationUtilityService
  ) {
    this.subscribeText();
  }

  async ngOnInit() {
    this.language.updateText();
    await this.route.queryParams.subscribe(params => {
      this.data = params.data.map(d => +d);
      this.className = params.class;
      this.dataType = params.type;
      this.dataUnit = params.unit ? params.unit : '';
      this.barColor = params.barColor;
      this.hollowArray = params.hollowArray.map(d => +d);
    });

    this.visualTool.initCSS();
    this.updateCSS();
    const chartTitle = `${this.className} In Last 7 Days`;

    const sevenDays = d3.range(6, -1, -1)
      .map((d) => new Date(new Date().setHours(0, 0, 0, 0) - d * 86400000));

    this.svg = await this.visualTool.initSvg('#barChart');

    // 1. view width = 900 => total width = 900 + margin.right + margin.left
    // 2. view width: view height = 1.618 (golden ratio)
    //    => total height = (900/1.618 + margin.label)
    //                       + margin.top + margin.bottom
    //                       + text area 400

    this.svg.attr('viewBox', '0 0 1020 1186');

    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    [this.x, this.y] = await Promise.all(
      [this.visualTool.initBandXaxis(
        sevenDays.map((d) => this.visualUtility.getWeekdayShort(d)), this.width, 0.3),
      this.visualTool.initLinearYaxis(this.data, this.height - this.margin.label)]);

    const sevenDaysMax = d3Array.max(this.data, (d: number) => d)
    const sevenDaysMin = d3Array.min(this.data, (d: number) => d)
    this.y.domain([sevenDaysMin < 0 ? sevenDaysMin : 0,
                   sevenDaysMax])
    if(this.y.domain()[0] == this.y.domain()[1]) {
      this.y.domain([this.y.domain()[0], this.y.domain()[0] + 1]);
    }

    this.visualTool.drawXAxis(this.g, this.x, this.y(0) + this.margin.label)[1]
    .attr('fill', 'transparent');
    let textOnly = this.visualTool.drawXAxis(this.g, this.x, this.height)[0]
    textOnly
    .selectAll('line')
    .style("stroke", "transparent");
    textOnly
    .selectAll('path')
    .style("stroke", "transparent");

    this.visualTool.drawInteractiveBars(this.g, this.x, this.y,
      sevenDays.map((d) => this.visualUtility.getWeekdayShort(d)), this.data,
      this.height, this.margin.label, `${this.className}`);

    this.visualTool.drawChartLabel(this.g, chartTitle, this.width);

    const validData = this.data.filter((d, i) => !this.hollowArray[i]);

    const barChartText = this.visualTool.drawBarChartText(this.g, this.x, this.y,
      sevenDays.map((d) => this.visualUtility.getWeekdayShort(d)).filter((d, i) => !this.hollowArray[i]),
      validData,
      this.height, this.margin.label, `${this.className}2`);

    const minMaxMean = this.visualTool.drawMinMaxMean(this.svg, validData,
      this.margin.left, this.width - this.margin.right,
      this.height + this.margin.top + this.margin.bottom + this.margin.label * 1.8,
      this.margin.label / 2, this.dataUnit);

    if (this.dataType === 'time-point' && validData.length > 0) {
      if (this.className === 'Woke-up Time') {
        barChartText.text((d) => {
          return this.datetimeService.getDigitalClockTime(d.yData + new Date().setHours(4, 0, 0, 0));
        });
        const wokeupTimestampMean = Math.round(d3Array.mean(validData, (d: number) => d + new Date().setHours(4, 0, 0, 0)));
        minMaxMean[1].text(`${this.datetimeService.getDigitalClockTime(wokeupTimestampMean)}`);
        const wokeupTimestampMax = Math.round(d3Array.max(validData, (d: number) => d + new Date().setHours(4, 0, 0, 0)));
        minMaxMean[3].text(`${this.datetimeService.getDigitalClockTime(wokeupTimestampMax)}`);
        const wokeupTimestampMin = Math.round(d3Array.min(validData, (d: number) => d + new Date().setHours(4, 0, 0, 0)));
        minMaxMean[5].text(`${this.datetimeService.getDigitalClockTime(wokeupTimestampMin)}`);
      } else {
        barChartText.text((d) => {
          return this.datetimeService.getDigitalClockTime(d.yData + new Date().setHours(0, 0, 0, 0));
        });
        const timestampMean = Math.round(d3Array.mean(validData, (d: number) => d + new Date().setHours(0, 0, 0, 0)));
        minMaxMean[1].text(`${this.datetimeService.getDigitalClockTime(timestampMean)}`);
        const timestampMax = Math.round(d3Array.max(validData, (d: number) => d + new Date().setHours(0, 0, 0, 0)));
        minMaxMean[3].text(`${this.datetimeService.getDigitalClockTime(timestampMax)}`);
        const timestampMin = Math.round(d3Array.min(validData, (d: number) => d + new Date().setHours(0, 0, 0, 0)));
        minMaxMean[5].text(`${this.datetimeService.getDigitalClockTime(timestampMin)}`);
      }
    }

    const today = 'Today: ' + d3Array.max(sevenDays).toLocaleDateString('en-US');
    this.visualTool.drawDayRegion(
      this.svg, today, this.margin.left + this.width / 2,
      this.height + this.margin.top + this.margin.bottom + this.margin.label * 0.3
    );

  }

  updateCSS() {
    this.visualTool.updateCSS('barColorNormal', this.barColor);
    this.visualTool.updateCSS('barColorToday', this.barColor);
  }

  goToSharePopUp() {
    saveSvgAsPng.svgAsPngUri(this.svg.node())
      .then((uri) => {
        const shareOptions = {
          message: 'Lifebox App, download from https://xxx',
          subject: 'lifebox-outdoor-percentage',
          chooserTitle: 'Share your data with friends',
          files: [uri]
        };
        this.socialSharing.shareWithOptions(shareOptions)
          .then((res) => {
            console.log('Shared!');
          })
          .catch((e) => { console.log(e); });
      });
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeText() {
    this.subscriptions.add(this.language.text.visualization.barChart.header.get()
    .subscribe(res => this.text.header = res));
    this.subscriptions.add(this.language.text.visualization.barChart.inLast7Days.get()
    .subscribe(res => this.text.inLast7Days = res));
    this.subscriptions.add(this.language.text.visualization.barChart.today.get()
    .subscribe(res => this.text.today = res));
    this.subscriptions.add(this.language.text.visualization.barChart.average.get()
    .subscribe(res => this.text.average = res));
    this.subscriptions.add(this.language.text.visualization.barChart.max.get()
    .subscribe(res => this.text.max = res));
    this.subscriptions.add(this.language.text.visualization.barChart.min.get()
    .subscribe(res => this.text.min = res));
    this.subscriptions.add(this.language.text.visualization.shareButton.get()
    .subscribe(res => this.text.shareButton = res));
    this.subscriptions.add(this.language.text.visualization.weekDays.sun.get()
    .subscribe(res => this.text.weekDays.sun = res));
    this.subscriptions.add(this.language.text.visualization.weekDays.mon.get()
    .subscribe(res => this.text.weekDays.mon = res));
    this.subscriptions.add(this.language.text.visualization.weekDays.tue.get()
    .subscribe(res => this.text.weekDays.tue = res));
    this.subscriptions.add(this.language.text.visualization.weekDays.wed.get()
    .subscribe(res => this.text.weekDays.wed = res));
    this.subscriptions.add(this.language.text.visualization.weekDays.thu.get()
    .subscribe(res => this.text.weekDays.thu = res));
    this.subscriptions.add(this.language.text.visualization.weekDays.fri.get()
    .subscribe(res => this.text.weekDays.fri = res));
    this.subscriptions.add(this.language.text.visualization.weekDays.sat.get()
    .subscribe(res => this.text.weekDays.sat = res));
  }

}
