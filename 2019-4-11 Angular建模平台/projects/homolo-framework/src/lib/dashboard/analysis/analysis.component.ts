import { Component, OnInit } from '@angular/core';
import * as G2 from '@antv/g2';
import {
  startOfDay,
  startOfMonth,
  startOfISOYear,
  startOfWeek
} from 'date-fns';
@Component({
  selector: 'hf-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['../../../assets/scss/homolo-framework.scss']
})
export class AnalysisComponent implements OnInit {
  histogram = {};
  bar = {};
  ring = {};
  line = {};
  sele = {};
  visit = {};
  chart;
  ranges: any = {
    今日: [startOfDay(new Date()), new Date()],
    本周: [startOfWeek(new Date()), new Date()],
    本月: [startOfMonth(new Date()), new Date()],
    全年: [startOfISOYear(new Date()), new Date()]
  };
  constructor() {}
  ngOnInit() {
    setTimeout(() => {
      this.chartData();
      this.barData();
      this.ringData();
      this.lineData();
      this.seleData();
      this.visitData();
    }, 0);
  }
  chartData() {
    this.histogram = [
      { year: '1951 年', sales: 38 },
      { year: '1952 年', sales: 52 },
      { year: '1956 年', sales: 61 },
      { year: '1957 年', sales: 145 },
      { year: '1958 年', sales: 48 },
      { year: '1959 年', sales: 38 },
      { year: '1960 年', sales: 38 },
      { year: '1962 年', sales: 38 }
    ];
    this.chart = new G2.Chart({
      container: 'histogram', // 指定图表容器 ID
      forceFit: true,
      height: 300,
      padding: [10, 10, 30, 30]
    });
    this.chart.axis('year', {
      label: false,
      tickLine: false
    });
    this.chart.source(this.histogram);
    this.chart.interval().position('year*sales');
    //  渲染图表
    this.chart.render();
  }
  barData() {
    this.bar = [
      { type: '汽车', value: 34 },
      { type: '建材家居', value: 85 },
      { type: '住宿旅游', value: 103 },
      { type: '交通运输与仓储邮政', value: 142 },
      { type: '建筑房地产', value: 401 },
      { type: '教育', value: 367 },
      { type: 'IT 通讯电子', value: 491 }
    ];
    this.chart = new G2.Chart({
      container: 'bar',
      forceFit: true,
      height: 300,
      padding: [20, 40, 50, 124]
    });
    this.chart.source(this.bar, {
      value: {
        max: 1300,
        min: 0,
        nice: false,
        alias: '销量（百万）'
      }
    });
    this.chart.axis('type', {
      label: {
        textStyle: {
          fill: '#8d8d8d',
          fontSize: 12
        }
      },
      tickLine: {
        alignWithLabel: false,
        length: 0
      },
      line: {
        lineWidth: 0
      }
    });
    this.chart.axis('value', {
      label: null,
      title: {
        offset: 30,
        textStyle: {
          fontSize: 12,
          fontWeight: 300
        }
      }
    });
    this.chart.legend(false);
    this.chart.coord().transpose();
    this.chart
      .interval()
      .position('type*value')
      .size(26)
      .opacity(1)
      .label('value', {
        textStyle: {
          fill: '#8d8d8d'
        },
        offset: 10
      });
    this.chart.render();
  }
  ringData() {
    this.ring = [
      {
        item: '事例一',
        count: 40,
        percent: 0.4
      },
      {
        item: '事例二',
        count: 21,
        percent: 0.21
      },
      {
        item: '事例三',
        count: 17,
        percent: 0.17
      },
      {
        item: '事例四',
        count: 13,
        percent: 0.13
      },
      {
        item: '事例五',
        count: 9,
        percent: 0.09
      }
    ];
    this.chart = new G2.Chart({
      container: 'ring',
      forceFit: true,
      height: 300,
      animate: false
    });
    this.chart.source(this.ring, {
      percent: {
        formatter: function formatter(val) {
          val = val * 100 + '%';
          return val;
        }
      }
    });
    this.chart.coord('theta', {
      radius: 0.75,
      innerRadius: 0.6
    });
    this.chart.tooltip({
      showTitle: false,
      itemTpl:
        '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
    });
    // 辅助文本
    this.chart.guide().html({
      position: ['50%', '50%'],
      html:
        '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;">' +
        '主机<br><span style="color:#8c8c8c;font-size:20px">200</span>台</div>',
      alignX: 'middle',
      alignY: 'middle'
    });
    const interval = this.chart
      .intervalStack()
      .position('percent')
      .color('item')
      .label('item', {
        formatter: function formatter(val) {
          return val;
        }
      })
      .tooltip('item*percent', (item: any, percent: any) => {
        percent = percent * 100 + '%';
        return {
          name: item,
          value: percent
        };
      })
      .style({
        lineWidth: 1,
        stroke: '#fff'
      });
    this.chart.render();
    interval.setSelected(this.ring[0]);
  }
  lineData() {
    this.line = [
      { year: '1991', value: 3 },
      { year: '1992', value: 4 },
      { year: '1993', value: 3.5 },
      { year: '1994', value: 5 },
      { year: '1995', value: 4.9 },
      { year: '1996', value: 6 },
      { year: '1997', value: 7 },
      { year: '1998', value: 9 },
      { year: '1999', value: 13 }
    ];
    this.chart = new G2.Chart({
      container: 'line',
      forceFit: true,
      height: 300
    });
    this.chart.source(this.line);
    this.chart.scale('value', {
      min: 0
    });
    this.chart.scale('year', {
      range: [0, 1]
    });
    this.chart.tooltip({
      crosshairs: {
        type: 'line'
      }
    });
    this.chart.line().position('year*value');
    this.chart
      .point()
      .position('year*value')
      .size(4)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1
      });
    this.chart.render();
  }
  seleData() {
    this.sele = [
      { month: '一月', sales: 380 },
      { month: '二月', sales: 520 },
      { month: '三月', sales: 601 },
      { month: '四月', sales: 145 },
      { month: '五月', sales: 480 },
      { month: '六月', sales: 308 },
      { month: '七月', sales: 908 },
      { month: '八月', sales: 580 },
      { month: '九月', sales: 680 },
      { month: '十月', sales: 678 },
      { month: '十一月', sales: 438 },
      { month: '十二月', sales: 738 }
    ];
    this.chart = new G2.Chart({
      container: 'sele', // 指定图表容器 ID
      forceFit: true,
      height: 250,
      padding: [10, 10, 20, 40]
    });
    this.chart.axis('month', {
      label: null,
      tickLine: null
    });
    this.chart.source(this.sele);
    this.chart.interval().position('month*sales');
    //  渲染图表
    this.chart.render();
  }
  visitData() {
    this.visit = [
      { month: '一月', sales: 380 },
      { month: '二月', sales: 520 },
      { month: '三月', sales: 601 },
      { month: '四月', sales: 145 },
      { month: '五月', sales: 480 },
      { month: '六月', sales: 308 },
      { month: '七月', sales: 908 },
      { month: '八月', sales: 580 },
      { month: '九月', sales: 680 },
      { month: '十月', sales: 678 },
      { month: '十一月', sales: 438 },
      { month: '十二月', sales: 738 }
    ];
    this.chart = new G2.Chart({
      container: 'visit', // 指定图表容器 ID
      forceFit: true,
      height: 250,
      padding: [10, 10, 20, 40]
    });
    // this.chart.axis('month', {
    //   label: null,
    //   tickLine: null
    // });
    this.chart.source(this.visit);
    this.chart.interval().position('month*sales');
    //  渲染图表
    this.chart.render();
  }
}
