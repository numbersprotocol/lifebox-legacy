import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as saveSvgAsPng from 'save-svg-as-png';

/* import d3 */
import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

export const chartTitle = 'Steps Data In Last 7 Days'
export interface Pedometer {
  weekday: string;
  steps: number;
}

export const pedometerData: Pedometer[] = [
  {weekday: 'Mon', steps: 1586},
  {weekday: 'Tue', steps: 4582},
  {weekday: 'Wed', steps: 5824},
  {weekday: 'Thu', steps: 1425},
  {weekday: 'Fri', steps: 2547},
  {weekday: 'Sat', steps: 3258},
  {weekday: 'Sun', steps: 1011}
];
/* end of mockup data */

@Component({
  selector: 'page-journal-barchart',
  templateUrl: 'journal-barchart.html',
})
export class JournalBarchartPage implements OnInit{
  title = 'D3 Barchart with Ionic 4';
  width: number;
  height: number;
  margin = { top: 40, right: 60, bottom: 90, left: 60, label: 80 };
  /** x: x-scale, y: y-scale **/
  x: any;
  y: any;
  svg: any;
  g: any;
  makeYLines: any;

  //@ViewChild('barChart') barChart: ElementRef;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public socialSharing: SocialSharing) {
    /** 1. view width = 900 => total width = 900 + margin.right + margin.left
        2. view width: view height = 1.618 (golden ratio) => total height = 900/1.618 + margin.top + margin.bottom **/

    this.width = 1020 - this.margin.left - this.margin.right;
    this.height = 686 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.initSvg();
    this.initAxis();
    this.drawAxis();
    this.drawLabel();
    this.drawBars();
    this.drawText();
  }

  initSvg() {
    this.svg = d3.select('#barChart')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 1020 686');
    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  initAxis() {
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.3);
    this.y = d3Scale.scaleLinear().range([this.height, 0]).domain([0, 100]);
    this.x.domain(pedometerData.map((d) => d.weekday));
    this.y.domain([0, d3Array.max(pedometerData, (d) => d.steps)]);
    this.makeYLines = () => d3Axis.axisLeft().scale(this.y);
  }

  drawAxis() {
    this.g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x));

    /** Hide Y axis **
    this.g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(this.y))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('Steps');
    **/

    /** make horizontal lines
    this.g.append('g')
      .attr('class', 'grid')
      .call(this.makeYLines()
        .tickSize(-this.width, 0, 0)
        .tickFormat('')
      );
    **/
  }

  drawLabel() {
    this.svg.append('text')
      .attr('class', 'title')
      .attr('x', this.width / 2 + this.margin.label)
      .attr('y', this.height + this.margin.bottom + this.margin.top - 10)
      .attr('text-anchor', 'middle')
      .text(chartTitle)
  }

  drawBars() {
    /** must assign this.x to _x, because "this" will become the mouse event later" **/
    const _x = this.x
    this.g.selectAll('.bar')
      .data(pedometerData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => this.x(d.weekday))
      .attr('y', (d) => this.y(d.steps))
      .attr('width', this.x.bandwidth())
      .attr('height', (d) => this.height - this.y(d.steps))
      .attr('opacity', 0.8)
      .on('mouseenter', function (actual, i) {
        d3.selectAll('.value')
          .attr('opacity', 1)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('x', (d) => _x(d.weekday) - 5)
          .attr('width', _x.bandwidth() + 10)

      })
      .on('mouseleave', function () {
        d3.selectAll('.value')
          .attr('opacity', 0)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.8)
          .attr('x', (d) => _x(d.weekday))
          .attr('width', _x.bandwidth())
      })
  }

  drawText() {
    this.g.selectAll()
      .data(pedometerData)
      .enter().append('text')
      .attr('class', 'value')
      .attr('x', (d) => this.x(d.weekday) + this.x.bandwidth()/2)
      .attr('y', (d) => this.y(d.steps) + 30)
      .attr('text-anchor', 'middle')
      .text((d) => `${d.steps}`)
      .attr('opacity', 0)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JournalVisualizationPage');
  }

  goToSharePopUp() {
    saveSvgAsPng.svgAsPngUri(this.svg.node())
    .then((uri) => {
      let shareOptions = {
        message: 'Numbers App, download from https://xxx',
        subject: 'numbers-barchart',
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


