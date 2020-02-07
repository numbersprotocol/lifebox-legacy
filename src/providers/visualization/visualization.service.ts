import { Injectable } from '@angular/core';

import * as d3 from 'd3';
import * as d3Select from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

@Injectable()
export class VisualizationService {

  cssObject: Record<string,string> = {};

  defineCSS(){
    return {
        "barColorNormal": "#2A707A",
        "barColorToday": "#2A707A",
        "textFontSize": "32px",
        "textColor": "#D5B551",
        "titleFontSize": "46px",
        "titleColor": "#827A78",
        "infoColor": "#827A78",
        "infoFontSizeSmall": "46px",
        "infoFontSizeMedium": "56px",
        "infoMargin": "10px"

    }
  }

  constructor() {
    console.log('Hello NumbersDataVisualizationProvider Provider');
    this.cssObject = this.defineCSS()
  }

  initCSS(){
    this.cssObject = this.defineCSS();
  }

  updateCSS(cssKey, cssValue){
    if (cssKey in this.cssObject){
        this.cssObject[cssKey] = cssValue;
        console.log('Update %s', cssKey);
    }
    else{
        console.log('CSS key %s does not exist.', cssKey);
    }
  }

  initSvg(htmlElement, background=true, bgColor='white') {
    return new Promise(resolve => {
      let svg = d3Select.select(htmlElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 900 500');

      if (background){
        svg.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", bgColor);
      }

      resolve(svg)
    })
  }

  initBandXaxis(xData, width, paddingRatio=0) {
    return new Promise(resolve => {
      let xAxis = d3Scale.scaleBand().rangeRound([0, width]).padding(paddingRatio);
      xAxis.domain(xData);

      resolve(xAxis)
    })
  }


  initPointXaxis(xData, width, paddingRatio=0) {
    return new Promise(resolve => {
      let xAxis = d3Scale.scalePoint().rangeRound([0, width]).padding(paddingRatio);
      xAxis.domain(xData);

      resolve(xAxis)
    })
  }

  initLinearYaxis(yData, height) {
    return new Promise(resolve => {
      let yAxis = d3Scale.scaleLinear().rangeRound([height, 0]);
      yAxis.domain([0, d3Array.max(yData, (d) => d)]);
      /**
      yAxis.domain([d3Array.min(yData, (d) => d),
                    d3Array.max(yData, (d) => d)]);
      **/
      resolve(yAxis)
    })
  }

  drawXAxis(htmlElement, xAxis, height) {
    let drawing = htmlElement.append('g')
    .call(d3Axis.axisBottom(xAxis))
    .attr('transform', 'translate(0,' + height + ')')
    .attr('font-size', this.cssObject['textFontSize'])
    return [drawing,
            drawing
            .selectAll('text')
            .attr('fill', this.cssObject['textColor'])]
  }

  drawYAxis(htmlElement, yAxis) {
    return htmlElement.append('g')
      .attr('class', 'axis axis--y')
      .call(d3Axis.axisLeft(yAxis))
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('');
  }

  drawLineChart(htmlElement, xAxis, yAxis, xData, yData,
                lineColor, dotColor, dummyName='') {

    let combinedData = xData.map((d, i) => {return {"xData": d , "yData": yData[i]}})

    // define line
    let line = d3.line()
    .defined( d => !isNaN(d.yData))
    .x( d => xAxis(d.xData))
    .y( d => yAxis(d.yData));

    return [
    line,

    // draw line
    htmlElement.append("path")
    .datum(combinedData)
    .attr('fill', 'none')
    .attr("stroke", lineColor)
    .attr("stroke-width", 3)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("opacity", 0.5)
    .attr("d", line),

    // add dot
    htmlElement.selectAll(dummyName)
    .data(combinedData)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', (d) => xAxis(d.xData))
    .attr('cy', (d) => yAxis(d.yData))
    .attr('r', 15)
    .attr('opacity', (d, i) => {
      if (i == combinedData.length - 1){
        return 0.8
      } else {
        return 0.3
      }
    })
    .style('fill', dotColor)
    ]
    /*let myColor = d3.scaleLinear().domain([1,10]).range(["white", dotColor])
      if (i == combinedData.length - 1){
        return myColor(3)
      } else {
        return dotColor
      }*/
  }

  drawBars(htmlElement, xAxis, yAxis, xData, yData,
           height, dummyName='') {

      let combinedData = xData.map((d, i) => {return {"xData": d , "yData": yData[i]}})

      return htmlElement.selectAll(dummyName)
      .data(combinedData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xAxis(d.xData))
      .attr('y', (d) => yAxis(d.yData))
      .attr('width', xAxis.bandwidth())
      .attr('height', (d) => height - yAxis(d.yData))

  }

  drawInteractiveBars(htmlElement, xAxis, yAxis, xData, yData,
           height, marginT, dummyName='') {

      let combinedData = xData.map((d, i) => {return {"xData": d , "yData": yData[i]}})
      let normalColor = this.cssObject['barColorNormal']

      return htmlElement.selectAll(dummyName)
      .data(combinedData)
      .enter().append('rect')
      .style("fill", (d, i) => { //attr with if else statement does not work
         if (i == combinedData.length - 1){
              return this.cssObject['barColorToday']
         }
         else {return this.cssObject['barColorNormal']}
      })
      .attr('x', (d) => xAxis(d.xData))
      .attr('y', (d) => yAxis(d.yData) <= yAxis(0) ? yAxis(d.yData) + marginT : yAxis(0) + marginT)
      .attr('width', xAxis.bandwidth())
      .attr('height', (d) => yAxis(d.yData) <= yAxis(0) ? yAxis(0) - yAxis(d.yData) : yAxis(d.yData) - yAxis(0))
      .attr('opacity', (d, i) => {
        if (i == combinedData.length - 1){
             return 0.8
        }
        else {
          return 0.3
        }
     })
      .on('mouseenter', function (actual, i) {
        d3.selectAll('.value')
          .attr('opacity', 1)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('x', (d) => xAxis(d.xData) - 5)
          .attr('width', xAxis.bandwidth() + 10)
          .style("fill", '#666666')
      })
      .on('mouseleave', function () {
        d3.selectAll('.value')
          .attr('opacity', 0)

        d3.select(this)
          .transition()
          .duration(300)
          .attr('x', (d) => xAxis(d.xData))
          .attr('width', xAxis.bandwidth())
          .style("fill", normalColor)
      })
  }

  drawBarChartText(htmlElement, xAxis, yAxis, xData, yData,
           height, marginT, dummyName='') {

      let combinedData = xData.map((d, i) => {return {"xData": d , "yData": yData[i]}})

      return htmlElement.selectAll(dummyName)
      .data(combinedData)
      .enter().append('text')
      .attr('class', 'value')
      .attr('x', (d) => xAxis(d.xData) + xAxis.bandwidth()/2)
      .attr('y', (d) => {
        if (yAxis(d.yData) <= yAxis(0)){
          return (yAxis(0) - yAxis(d.yData) - marginT*0.8) <= 30? (((yAxis(0) - marginT/3) > 0) ? yAxis(0) + marginT - marginT/3 : yAxis(0) + marginT + marginT/3) : yAxis(d.yData) + marginT*1.8
        }
        else {
          return (yAxis(d.yData) - yAxis(0) - marginT*0.8) <= 30? (((height - yAxis(0) - marginT*4/3) > 0) ? yAxis(0) + marginT*4/3 : yAxis(0) + marginT*2/3) : yAxis(d.yData) + marginT*0.2 + 16  // 16 is textfonsize *2/4
        }
      })
      .attr('fill', this.cssObject['textColor'])
      .attr('font-size', this.cssObject['textFontSize'])
      .attr('text-anchor', 'middle')
      .text((d) => `${d.yData}`)
      .attr('opacity', 0)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JournalVisualizationPage');
  }

  drawChartLabel(htmlElement, label, width) {
    return  htmlElement.append('text')
      .attr('class', 'title')
      .attr('fill', this.cssObject['titleColor'])
      .attr('font-size', this.cssObject['titleFontSize'])
      .attr('x', width / 2)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .text(label)
  }

  drawDayRegion(htmlElement, today, x1, yStart) {

    return htmlElement.append('text')
      .attr('class', 'date')
      .attr('fill', this.cssObject['textColor'])
      .attr('font-size', this.cssObject['textFontSize'])
      .attr('x', x1)
      .attr('y', yStart)
      .attr('text-anchor', 'middle')
      .text(today)
  }

  drawMinMaxMean(htmlElement, dataArray, x1, x2, yStart, fontSize, unit='') {

    let preAddTextCat = () => {
      return htmlElement.append('text')
      .attr('x', x1)
      .attr('class', 'statistics_cat')
      .attr('opacity', 1)
      .attr('text-anchor', 'left')
      .attr('fill', this.cssObject['infoColor'])
      .attr('mergin', this.cssObject['infoMargin'])
      .attr('font-size', this.cssObject['infoFontSizeSmall'])
    }

    let preAddTextNum = () => {
      return htmlElement.append('text')
      .attr('x', x1 + fontSize*5)
      .attr('class', 'statistics_num')
      .attr('fill', this.cssObject['infoColor'])
      .attr('mergin', this.cssObject['infoMargin'])
      .attr('font-size', this.cssObject['infoFontSizeMedium'])
      .attr('opacity', 1)
      .attr('text-anchor', 'left')
    }

    let preAddLine = () => {
      return htmlElement.append('line')
      .attr('x1', x1)
      .attr('x2', x2)
      .style('stroke', 'black')
    }

    if (dataArray.length > 0){
      return [
        preAddTextCat()
        .attr('y', yStart)
        .text(`Average:\u00A0\u00A0`),

        preAddTextNum()
        .attr('y', yStart)
        .text(`${Math.round(d3Array.mean(dataArray, (d) => d) * 10) / 10} ${unit}`),

        preAddTextCat()
        .attr('y', yStart + fontSize * 2.5 )
        .text(`Max:\u00A0\u00A0`),

        preAddTextNum()
        .attr('y', yStart + fontSize * 2.5)
        .text(`${Math.round(d3Array.max(dataArray, (d) => d) * 10) / 10} ${unit}`),

        preAddTextCat()
        .attr('y', yStart + fontSize * 5 )
        .text(`Min:\u00A0\u00A0`),

        preAddTextNum()
        .attr('y', yStart + fontSize * 5)
        .text(`${Math.round(d3Array.min(dataArray, (d) => d) * 10) / 10} ${unit}`),
      ]
    }
    else {
      return [
        preAddTextCat()
        .attr('y', yStart)
        .text(`Average:\u00A0\u00A0`),

        preAddTextNum()
        .attr('y', yStart)
        .text(`- - ${unit}`),

        preAddTextCat()
        .attr('y', yStart + fontSize * 2.5 )
        .text(`Max:\u00A0\u00A0`),

        preAddTextNum()
        .attr('y', yStart + fontSize * 2.5)
        .text(`- - ${unit}`),

        preAddTextCat()
        .attr('y', yStart + fontSize * 5 )
        .text(`Min:\u00A0\u00A0`),

        preAddTextNum()
        .attr('y', yStart + fontSize * 5)
        .text(`- - ${unit}`),
      ]
    }

  }

  addHideableBox(htmlElement, x, y, boxColor, hideArray, dummyID, text='') {

    return [htmlElement.append('rect')
    .attr('id', dummyID)
    .attr('width', '50px')
    .attr('height', '50px')
    .attr('x', x)
    .attr('y', y)
    .attr('stroke', 'black')
    .attr('stroke-width', '5px')
    .style('fill', boxColor),

    htmlElement.append('rect')
    .attr('id', `${dummyID}2`)
    .attr('width', '70px')
    .attr('height', '70px')
    .attr('x', x - 10)
    .attr('y', y - 10)
    .style('fill', 'transparent')
    .on("click", (() => {
      let currentColor = boxColor;
      let opacityArray = hideArray.map((d) => d.nodes().map(node => d3.select(node).attr('opacity')))
      return () => {
        currentColor = currentColor == 'transparent' ? boxColor : 'transparent';
        htmlElement.select(`#${dummyID}`)
        .style('fill', currentColor)
          if (currentColor == boxColor) {
            hideArray.map((d, i) => d.attr('opacity', (dd, ii) => {
              if (d.nodes().map(node => d3.select(node).attr('updatedOpacity'))[ii]){
                return d.nodes().map(node => d3.select(node).attr('updatedOpacity'))[ii]
              }
              else {
                return opacityArray[i][ii]
              }
            }))
          } else {
            opacityArray = hideArray.map((d) => d.nodes().map(node => d3.select(node).attr('opacity')))
            hideArray.map((d) => d.attr('opacity', 0))
          }
        }
      })()),

    // the text y coordinate is so complicated because
    // I want to align text center to box center
    htmlElement.append('text')
    .attr('x', x + 50 + 15)
    .attr('y', y + 4 + 42 / 4 * 3)
    .attr('opacity', 1)
    .attr('text-anchor', 'left')
    .attr('font-size', '42px')
    .text(text)]

  }

  drawLineChartNoDataDashArray(htmlElement, xAxis, yAxis, xData, yData,
    lineColor, dotColor, hollowIndex, dummyName='') {

    let lineChart = this.drawLineChart(htmlElement, xAxis, yAxis,
      xData, yData, lineColor, dotColor, dummyName);

    lineChart[2]
    .filter((d, i) => { return hollowIndex[i]})
    .style('fill', 'transparent')
    .attr("stroke",  dotColor)
    .attr("stroke-width", 2.5)
    .attr("stroke-dasharray", '5,5')

    return lineChart

    }

  getAntiAdobeColor(adobeColor: string){
    let tempPair ={'0': 'F', '1': 'E', '2': 'D', '3': 'C', '4': 'B', '5': 'A',
                   '6': '9', '7': '8', '8': '7', '9': '6', 'A': '5', 'B': '4',
                   'C': '3', 'D': '2', 'E': '1', 'F': '0'}
    let antiColor = '#'
    for (let i = 1; i < adobeColor.length; i++) {
      antiColor += tempPair[adobeColor[i]];
    }

    return antiColor
  }

  addVisibleBox(htmlElement, x, y, boxColor, hideArray, dummyID, text='') {

    return [htmlElement.append('rect')
    .attr('id', dummyID)
    .attr('width', '50px')
    .attr('height', '50px')
    .attr('x', x)
    .attr('y', y)
    .attr('stroke', 'black')
    .attr('stroke-width', '5px')
    .style('fill', 'transparent'),

    htmlElement.append('rect')
    .attr('id', `${dummyID}2`)
    .attr('width', '70px')
    .attr('height', '70px')
    .attr('x', x - 10)
    .attr('y', y - 10)
    .style('fill', 'transparent')
    .on("click", (() => {
      let currentColor = 'transparent';
      let opacityArray = hideArray.map((d) => d.nodes().map(node => d3.select(node).attr('opacity')))
      hideArray.map((d) => d.attr('opacity', 0))
      return () => {
        currentColor = currentColor == 'transparent' ? boxColor : 'transparent';
        htmlElement.select(`#${dummyID}`)
        .style('fill', currentColor)
          if (currentColor == boxColor) {
            hideArray.map((d, i) => d.attr('opacity', (dd, ii) => {
              if (d.nodes().map(node => d3.select(node).attr('updatedOpacity'))[ii]){
                return d.nodes().map(node => d3.select(node).attr('updatedOpacity'))[ii]
              }
              else {
                return opacityArray[i][ii]
              }
            }))
          } else {
            opacityArray = hideArray.map((d) => d.nodes().map(node => d3.select(node).attr('opacity')))
            hideArray.map((d) => d.attr('opacity', 0))
          }
        }
      })()),

    // the text y coordinate is so complicated because
    // I want to align text center to box center
    htmlElement.append('text')
    .attr('x', x + 50 + 15)
    .attr('y', y + 4 + 42 / 4 * 3)
    .attr('opacity', 1)
    .attr('text-anchor', 'left')
    .attr('font-size', '42px')
    .text(text)]


  }

}
