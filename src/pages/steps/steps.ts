import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { VisualizationService } from '../../providers/visualization/visualization.service';
import { VisualizationUtility } from '../../providers/visualization/utility.service';
import { DataService } from '../../providers/data/data.service';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as saveSvgAsPng from 'save-svg-as-png';

/* import d3 */
import * as d3 from 'd3';
import * as d3Array from 'd3-array';


export const chartTitle = 'Steps Data In Last 7 Days';

@Component({
  selector: 'page-steps',
  templateUrl: 'steps.html'
})

export class StepsPage {
  width: number;
  height: number;
  margin = { top: 60, right: 60, bottom: 90, left: 60, label: 80 };
  x: any;
  y: any;
  svg: any;
  g: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dataservice: DataService,
              public visualTool: VisualizationService,
              public visualUtility: VisualizationUtility,
              public socialSharing: SocialSharing) {
    this.width = 900;
    this.height = 636;
  }

  updateCSS(){
    //this.visualTool.updateCSS("barColorToday", "#3E303D")
  }
  async ngOnInit() {
    // if not define visualTool's CSS again, we may get a contaminated CSS
    this.visualTool.initCSS()
    this.updateCSS()
    let sevenDays = d3.range(6, -1, -1)
      .map((d) => new Date(new Date().setHours(0, 0, 0, 0) - d * 86400000));

    let sevenDaysData;
    let sevenDaysHollow;
    [sevenDaysData, sevenDaysHollow] = await this.dataservice.getStepsByDate(new Date(), 7);

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
        this.visualTool.initLinearYaxis(sevenDaysData, this.height - this.margin.label)]);
    /**
        .toLocaleDateString('en-US')), this.width, 0.3),
    **/

    let sevenDaysMax = d3Array.max(sevenDaysData, (d) => d)
    this.y.domain([0, sevenDaysMax == 0 ? 1 : sevenDaysMax])

    this.visualTool.drawXAxis(this.g, this.x, this.height);

    this.visualTool.drawInteractiveBars(this.g, this.x, this.y,
      sevenDays.map((d) => this.visualUtility.getWeekdayShort(d)), sevenDaysData,
      this.height, this.margin.label, 'steeeps')

    /**
    .style('fill', (d, i) => {
      let myColor = d3.scaleLinear().domain([1,10]).range(["white", 'black'])
      if (i == sevenDaysData.length - 1){
        return myColor(3)
      } else {
        return 'black'
      }
    });
    **/

    this.visualTool.drawChartLabel(this.g, chartTitle, this.width)

    this.visualTool.drawBarChartText(this.g, this.x, this.y,
      sevenDays.map((d) => this.visualUtility.getWeekdayShort(d)).filter((d, i) => !sevenDaysHollow[i]),
      sevenDaysData.filter((d, i) => !sevenDaysHollow[i]),
      this.height, this.margin.label, 'steeeps');
      //sevenDays.map((d) => d.toLocaleDateString('en-US')), sevenDaysData,

    this.visualTool.drawMinMaxMean(this.svg, sevenDaysData.filter((d, i) => !sevenDaysHollow[i]),
                                   this.margin.left, this.width - this.margin.right,
                                   this.height + this.margin.top + this.margin.bottom + this.margin.label*1.8,
                                   this.margin.label/2)
    let today = 'Today: ' + d3Array.max(sevenDays).toLocaleDateString('en-US')
    this.visualTool.drawDayRegion(
        this.svg, today, this.margin.left + this.width/2,
        this.height + this.margin.top + this.margin.bottom + this.margin.label*0.3
    )

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StsPage');
  }

  goToSharePopUp() {
    saveSvgAsPng.svgAsPngUri(this.svg.node())
    .then((uri) => {
      let shareOptions = {
        message: 'Numbers App, download from https://xxx',
        subject: 'numbers-outdoor-percentage',
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
