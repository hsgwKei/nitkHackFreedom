import { CurrencyPipe, getLocaleTimeFormat } from '@angular/common';
import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { GlobalService } from '../global.service';
import 'chartjs-plugin-streaming';
import { templateJitUrl } from '@angular/compiler';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  updateTempDataFromServerFunction: any;
  temp: any[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  humidity: any[] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  current_temp: any = 0.0;
  current_humidity: any = 0.0;
  current_date: string = '';
  labels: any[] = [
    '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '',
  ]
  date: string = '';

  
  options: any;
  canvas: any;
  ctx: any;
  postObj: any = {};
  //url: string = 'http://c860-118-10-65-11.ngrok.io';

  constructor(
    public gs: GlobalService
  ) {}

  ngOnInit(){
    this.setData();
    this.set_Date();
    this.drawChart();
    this.addLabels();
    this.updateDataFromServer();
  }

  setData = () => {
    this.temp = JSON.parse(localStorage.temp)
    this.humidity = JSON.parse(localStorage.humidity)
    this.labels = JSON.parse(localStorage.labels
      )
    const current_temp: any = this.temp.reduce((acc, cur)=>{
      return acc + cur;
    }) / this.temp.length
    this.current_temp = current_temp.toFixed(1);

    const current_humidity: any = this.humidity.reduce((acc, cur)=>{
      return acc + cur;
    }) / this.humidity.length
    this.current_humidity = current_humidity.toFixed(1);
  }

  updateDataFromServer(){
    console.log('updateTempDataFromServerFunction() called');    
    /*this.updateTempDataFromServerFunction = setInterval(() => {
      console.log('called');
      //this.tempDataFromServer = Math.random() * 100;
      this.addTemp();
      this.addHumidity();
      this.addLabels();
      this.get_Date();
      console.log('Add Current Data');
      this.drawChart();
    }, 5000)*/
  }

  addTemp = () => {
    /*const body = this.postObj;
    this.gs.http(this.url, body).subscribe(
      res => {
        this.temp = res;
        if(this.temp['temperature']){
          this.tempDataFromServer = this.temp[''];
        }
        else{
          console.log('post error');
          this.tempDataFromServer = 0.0;
        }
      }
    )*/
    const current_temp: any = this.temp.reduce((acc, cur)=>{
      return acc + cur;
    }) / this.temp.length
    if(this.temp.length > 24){
      this.temp.shift()
    }
    this.current_temp = current_temp.toFixed(1);
    this.temp.push(current_temp);
  }

  addHumidity = () => {
    const current_humidity: any = this.humidity.reduce((acc, cur)=>{
      return acc + cur;
    }) / this.humidity.length
    if(this.humidity.length > 24){
      this.humidity.shift()
    }
    this.current_humidity = current_humidity.toFixed(1);
    this.humidity.push(current_humidity)
  }

  addLabels = () =>{
    console.log(this.labels.indexOf(''))
    const date = new Date()
    const now = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    if(this.labels.indexOf('') > -1){
      console.log(this.labels[this.labels.indexOf('')]);
      this.labels[this.labels.indexOf('')] = now;
    }
    else{
      this.labels.shift()
      this.labels.push(now);
    }
    this.current_date = now
  }

  set_Date = () => {
    const date = new Date()
    this.date = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + (date.getDate()-1)
    localStorage.yesterday = this.date
  }

  get_Date = () => {
    const date = new Date()
    this.date = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + (date.getDate()-1)
    if(this.date != localStorage.date){
      localStorage.yesterday = this.date
    }
  }

  drawChart = () => {
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas2');
    this.ctx = this.canvas.getContext('2d');

    this.options = {
      scales: {
        xAxes: [{
          ticks: {
            maxTicksLimit: 6
          }
        }],
        yAxes: [{
          id: "y-temp",
          type: "linear", 
          position: "left",
          ticks: {
            max: 27.0,
            stepSize: 4
          }
        },
        {
          id: 'y-humidity',
          type: 'linear',
          position: 'right',
          ticks: {
            max: 70.0,
            stepSize: 4
          }
        }],
      },
      /*title: {
        display: true,
        text: '気温（8月1日~8月7日）'
      }*/
    }


    new Chart(this.ctx, {
      data: {
        labels: this.labels,
        datasets: [
          {
            type: 'line',
            label: '気温',
            data: this.temp,
            borderColor: "#ff6666",
            backgroundColor: "rgba(0,0,0,0)",
            yAxisID: 'y-temp'
          },
          {
            type: 'line',
            label: '湿度',
            data: this.humidity,
            borderColor: "#005fff",
            backgroundColor: "rgba(0,0,0,0)",
            yAxisID: 'y-humidity'
          }
        ],
      },
      options: this.options
    })

    /*new Chart(this.ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: '気温',
          borderColor: '#00dd00',
          backgroundColor: '#00dd0025',
          lineTension: 0.1,
          data: this.dataList
        }]
      },
      options: {
        responsive: false
      }
    })*/
  }
}