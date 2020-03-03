import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VisualizationService } from 'src/app/services/visualization/visualization.service';
import { VisualizationUtilityService } from 'src/app/services/visualization/visualization-utility.service';
import { DataService } from 'src/app/services/data/data.service';
import { DatetimeService } from 'src/app/services/datetime/datetime.service';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as saveSvgAsPng from 'save-svg-as-png';

/* import d3 */
import * as d3 from 'd3';
import * as d3Array from 'd3-array';


@Component({
  selector: 'app-custom-data-barchart',
  templateUrl: './custom-data-barchart.page.html',
  styleUrls: ['./custom-data-barchart.page.scss'],
})
export class CustomDataBarchartPage implements OnInit {
  width: number = 900;
  height: number = 636;
  margin = { top: 60, right: 60, bottom: 90, left: 60, label: 80 };
  x: any;
  y: any;
  svg: any;
  g: any;
  data: any;
  min: number;
  max: number;
  className: string;
  dataType: string;
  dataUnit: string;
  barColor: string;
  hollowArray: any;

  constructor(
    private route: ActivatedRoute,
    private dataservice: DataService,
    private visualTool: VisualizationService,
    private visualUtility: VisualizationUtilityService,
    private socialSharing: SocialSharing,
    private datetimeService: DatetimeService) {}

  async ngOnInit() {

    await this.route.queryParams.subscribe(params => {
      this.data = params.data.map(d => +d);
      this.className = params.class;
      this.dataType = params.type;
      this.dataUnit = params.unit ? params.unit : '';
      this.barColor = params.barColor;
      this.hollowArray = params.hollowArray.map(d => +d);
      this.min = +params.min;
      this.max = +params.max;
    });

    this.visualTool.initCSS()
    this.updateCSS()

    const chartTitle = `${this.className} In Last 7 Days`;

    let sevenDays = d3.range(6, -1, -1)
      .map((d) => new Date(new Date().setHours(0, 0, 0, 0) - d * 86400000));

    this.svg = await this.visualTool.initSvg('#barChart')

    /** 1. view width = 900 => total width = 900 + margin.right + margin.left
        2. view width: view height = 1.618 (golden ratio)
           => total height = (900/1.618 + margin.label)
                             + margin.top + margin.bottom
                             + text area 400
    **/

    this.svg.attr('viewBox', '0 0 1020 1186')

    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    [this.x, this.y] = await Promise.all(
       [this.visualTool.initBandXaxis(
          sevenDays.map((d) => this.visualUtility.getWeekdayShort(d)), this.width, 0.3),
        this.visualTool.initLinearYaxis(this.data, this.height - this.margin.label)]);

    let sevenDaysMax = d3Array.max(this.data, (d) => +d);
    let sevenDaysMin = d3Array.min(this.data, (d) => +d);
    this.y.domain([sevenDaysMin < this.min ? sevenDaysMin : this.min,
                   sevenDaysMax > this.max ? sevenDaysMax : this.max])
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
      this.height, this.margin.label, `${this.className}`)

    this.visualTool.drawChartLabel(this.g, chartTitle, this.width)

    let validData = this.data.filter((d, i) => !this.hollowArray[i]);

    let barChartText = this.visualTool.drawBarChartText(this.g, this.x, this.y,
      sevenDays.map((d) => this.visualUtility.getWeekdayShort(d)).filter((d, i) => !this.hollowArray[i]),
      validData,
      this.height, this.margin.label,  `${this.className}2`);

    let minMaxMean = this.visualTool.drawMinMaxMean(this.svg, validData,
                                   this.margin.left, this.width - this.margin.right,
                                   this.height + this.margin.top + this.margin.bottom + this.margin.label*1.8,
                                   this.margin.label/2, this.dataUnit)

    let today = 'Today: ' + d3Array.max(sevenDays).toLocaleDateString('en-US')
    this.visualTool.drawDayRegion(
        this.svg, today, this.margin.left + this.width/2,
        this.height + this.margin.top + this.margin.bottom + this.margin.label*0.3
    )

  }

  updateCSS(){
    this.visualTool.updateCSS("barColorNormal", this.barColor)
    this.visualTool.updateCSS("barColorToday", this.barColor)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomDatabarchartPage');
  }

  goToSharePopUp() {
    saveSvgAsPng.svgAsPngUri(this.svg.node())
    .then((uri) => {
      let shareOptions = {
        message: 'Lifebox App, download from https://xxx',
        subject: 'lifebox-outdoor-percentage',
        chooserTitle: 'Share your data with friends',
        files: [uri]
      }
      this.socialSharing.shareWithOptions(shareOptions)
      .then((res) => {
        console.log('Shared!');
      })
      .catch((e) => {console.log(e)});
    });
  }

}
