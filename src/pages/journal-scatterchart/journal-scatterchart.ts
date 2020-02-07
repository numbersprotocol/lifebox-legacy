import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { VisualizationService } from '../../providers/visualization/visualization.service';
import { VisualizationUtility } from '../../providers/visualization/utility.service';
import { DataService } from '../../providers/data/data.service';
import { WeatherService } from '../../providers/weather/weather.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as saveSvgAsPng from 'save-svg-as-png';

/* import d3 */
import * as d3 from 'd3'
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';


/**
 * Generated class for the JournalScatterchartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-journal-scatterchart',
  templateUrl: 'journal-scatterchart.html',
})
export class JournalScatterchartPage implements OnInit {
  title = 'Visualization';
  width: number;
  height: number;
  margin = { top: 60, right: 60, bottom: 90, left: 60, label: 80 };
  svg: any;
  svg2: any;
  g: any;

  constructor(public dataService: DataService,
              public navCtrl: NavController,
              public navParams: NavParams,
              public visualTool: VisualizationService,
              public visualUtility: VisualizationUtility,
              public weatherService: WeatherService,
              public socialSharing: SocialSharing
              ) {
    this.width = 900;
    this.height = 636;
  }

  async ngOnInit() {

    let sevenDays = d3.range(6, -1, -1)
    .map((d) => new Date(new Date().setHours(0, 0, 0, 0) - d * 86400000));

    let dataArray, hollowArray;

     [[dataArray, hollowArray],
      this.svg, this.svg2] = await Promise.all(
                              [this.dataService.getJournalDataByDate(new Date(), 7),
                               this.visualTool.initSvg('#scatterPlot'),
                               this.visualTool.initSvg('#scatterPlot')]
                             );

    let nameArray = ['steps', 'outdoor', 'sleeping time', 'wokeup time', 'temperature', 'RH', 'AQI'];
    let colorArray = ['#2A707A', '#76A6A1', '#3E303D', '#827A78', '#BF1B1B', '#549FBF', '#F2B138']
    let origVisibleArray = ['steps', 'outdoor', 'sleeping time'];

    this.svg.attr('viewBox', '0 0 1020 920');
    this.svg2.attr('viewBox', '0 920 1020 790');

    this.g = this.svg.append('g')
    .attr('transform', 'translate(' + this.margin.left + ',' + (this.margin.top + 80) + ')');

    const chartTitle = "Data of Past"
    this.visualTool.drawChartLabel(this.svg, chartTitle, this.width)
    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    let xTick = sevenDays.map((d) => this.visualUtility.getWeekdayShort(d));
    let xAxis
    let yArray;

    // why I do not use dataArray.map((d) => this.visualTool.initLinearYaxis(d, this.height)),
    // is that I want to maintain flexibility. some data might be better to use log axis or somehow
    [xAxis, yArray] = await Promise.all([
      this.visualTool.initPointXaxis(xTick, this.width, 0.3),
      Promise.all([
        this.visualTool.initLinearYaxis(dataArray[0], this.height),
        this.visualTool.initLinearYaxis(dataArray[1], this.height),
        this.visualTool.initLinearYaxis(dataArray[2], this.height),
        this.visualTool.initLinearYaxis(dataArray[3], this.height),
        this.visualTool.initLinearYaxis(dataArray[4], this.height),
        this.visualTool.initLinearYaxis(dataArray[5], this.height),
        this.visualTool.initLinearYaxis(dataArray[6], this.height)
      ])
    ]);

    yArray.forEach((d, i) => {
      if (d.domain()[0] == d.domain()[1]){
        yArray[i].domain([d.domain()[0], d.domain()[0] + 1]);
      }
    });

    let lineChartArray = dataArray.map((data, i) => {
      let tempLineChart = this.visualTool.drawLineChartNoDataDashArray(this.g, xAxis, yArray[i],
        xTick, data, colorArray[i], colorArray[i], hollowArray[i], `${nameArray[i].replace(/\s/g, '')}${Math.round(Math.random() * 1000)}`);

      if (origVisibleArray.includes(nameArray[i])) {
        this.visualTool.addHideableBox(this.svg2, this.margin.left, 990 + 100 * i, colorArray[i],
          [tempLineChart[1], tempLineChart[2]], `${nameArray[i].replace(/\s/g, '')}${Math.round(Math.random() * 1000)}line`, nameArray[i]);
      }
      else {
        this.visualTool.addVisibleBox(this.svg2, this.margin.left, 990 + 100 * i, colorArray[i],
          [tempLineChart[1], tempLineChart[2]], `${nameArray[i].replace(/\s/g, '')}${Math.round(Math.random() * 1000)}line`, nameArray[i]);
      }

      return tempLineChart
    })


    // if domain is [0, 0], let it be [0, 1]
    yArray.map((d, i) => {
      if (d.domain()[0] == d.domain()[1]){
        yArray[i].domain([d.domain()[0], d.domain()[0] + 1]);
      }
    });

    let drawingXaxis = this.visualTool.drawXAxis(this.g, xAxis, this.height);

    let dayRegion = (d3Array.min(sevenDays).toLocaleDateString('en-US')) + '~' + (d3Array.max(sevenDays).toLocaleDateString('en-US'))
    let drawingDayRegion = this.visualTool.drawDayRegion(
        this.svg, dayRegion, this.margin.left + this.width/2,
        this.height + this.margin.top + this.margin.bottom + this.margin.label * 0.3 + 80
    )

    console.log(dataArray)


    this.svg.append('polygon')
    .attr('points', '60,882 100,857 100,907')
    .attr('id', 'hahaha')
    .style('fill', 'black');
    this.svg.append('rect')
    .attr('id', 'hahaha2')
    .attr('width', '60px')
    .attr('height', '60px')
    .attr('x', '50')
    .attr('y', '852')
    .style('fill', 'transparent')
    .on("click", (async() => {
      sevenDays.unshift(new Date((d3Array.min(sevenDays).setHours(0, 0, 0, 0) - 86400000)));
      sevenDays.pop();
      let newDataPoints = await this.dataService.getJournalDataByDate(d3Array.min(sevenDays), 1)

      dataArray = newDataPoints[0].map((d, i) => {
        let tempArray = d.concat(dataArray[i]);
        tempArray.pop();
        return tempArray
      });
      hollowArray = newDataPoints[1].map((d, i) => {
        let tempArray = d.concat(hollowArray[i]);
        tempArray.pop();
        return tempArray
      });

      console.log(dataArray)

      this.updateLineChart(sevenDays, dataArray, hollowArray, lineChartArray, colorArray,
        xAxis, drawingXaxis, yArray, drawingDayRegion)

    }));

    this.svg.append('polygon')
    .attr('points', '960,882 920,857 920,907')
    .attr('id', 'hehehe1')
    .style('fill', 'black');
    this.svg.append('rect')
    .attr('id', 'hehehe2')
    .attr('width', '60px')
    .attr('height', '60px')
    .attr('x', '890')
    .attr('y', '852')
    .style('fill', 'transparent')
    .on("click", (async() => {
      sevenDays.push(new Date((d3Array.max(sevenDays).setHours(0, 0, 0, 0) + 86400000)));
      sevenDays.shift();
      let newDataPoints = await this.dataService.getJournalDataByDate(d3Array.max(sevenDays), 1)

      dataArray = newDataPoints[0].map((d, i) => {
        let tempArray = dataArray[i].concat(d);
        tempArray.shift();
        return tempArray
      });
      hollowArray = newDataPoints[1].map((d, i) => {
        let tempArray = hollowArray[i].concat(d);
        tempArray.shift();
        return tempArray
      });

      console.log(dataArray)

      this.updateLineChart(sevenDays, dataArray, hollowArray, lineChartArray, colorArray,
        xAxis, drawingXaxis, yArray, drawingDayRegion);

    }))

  }

  updateLineChart(sevenDays, dataArray, hollowArray, lineChartArray, colorArray,
    xAxis, drawingXaxis, yArray, drawingDayRegion) {

    let xTick = sevenDays.map((d) => this.visualUtility.getWeekdayShort(d));
    xAxis.domain(xTick);

    drawingXaxis[0].call(d3Axis.axisBottom(xAxis))
    .selectAll('text')
    .attr('fill', this.visualTool.cssObject['textColor'])

    yArray.forEach((d, i) => {d.domain([0, d3Array.max(dataArray[i])])});
    // if domain is [0, 0], let it be [0, 1]
    yArray.forEach((d, i) => {
      if (d.domain()[0] == d.domain()[1]){
        yArray[i].domain([d.domain()[0], d.domain()[0] + 1]);
      }
    });

    dataArray.forEach((d, i) => {
      let combinedData = xTick.map((day, index) => {return {"xData": day , "yData": d[index]}});
      let tempLine = lineChartArray[i][0]
      .x(d => xAxis(d.xData))
      .y(d => yArray[i](d.yData));

      lineChartArray[i][1]
      .datum(combinedData)
      .attr("d", tempLine);

      lineChartArray[i][2]
      .data(combinedData)
      .attr('cx', (d) => xAxis(d.xData))
      .attr('cy', (d) => yArray[i](d.yData))
      .filter((dummy, index) => { return hollowArray[i][index]})
      .style('fill', 'transparent')
      .attr("stroke",  colorArray[i])
      .attr("stroke-width", 2.5)
      .attr("stroke-dasharray", '5,5');

      lineChartArray[i][2]
      .filter((dummy, index) => { return !hollowArray[i][index]})
      .style('fill', colorArray[i])
      .attr("stroke",  'none')
      .attr("stroke-width", 'none')
      .attr("stroke-dasharray", 'none');

      lineChartArray[i][2]
      .attr('updatedOpacity', (dot, index) => {
        if (sevenDays[index].getTime() == new Date().setHours(0, 0, 0, 0)){
          return 0.8
        } else {
          return 0.3
        }
      })

      if (lineChartArray[i][2].attr('opacity') != 0) {
        lineChartArray[i][2]
        .attr('opacity', (dot, index) => {
          if (sevenDays[index].getTime() == new Date().setHours(0, 0, 0, 0)){
            return 0.8
          } else {
            return 0.3
          }
        })
      }
    })

    let dayRegion = (d3Array.min(sevenDays).toLocaleDateString('en-US')) + '~' + (d3Array.max(sevenDays).toLocaleDateString('en-US'));
    drawingDayRegion.text(dayRegion)

  }

  goToSharePopUp() {
    saveSvgAsPng.svgAsPngUri(this.svg.node())
    .then((uri) => {
      let shareOptions = {
        message: 'Numbers App, download from https://xxx',
        subject: 'numbers-journal-linechart',
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad JournalScatterchartPage');
  }

}
