import { CurrencyPipe, getLocaleTimeFormat } from '@angular/common';
import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { GlobalService } from '../global.service';
import 'chartjs-plugin-streaming';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  updateTempDataFromServerFunction: any;
  temp_max : any = 0;
  humidity_max: any = 0;
  response : any[] = []
  temp: any[] = [];
  humidity: any[] = [];
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
  url: string = 'https://aa26-118-10-65-11.ngrok.io/Return';

  constructor(
    public gs: GlobalService
  ) {}

  ngOnInit(){ 
    this.set_Date();
    this.getData();
    this.drawChart();
    //this.addTemp();
    //this.addHumidity();
    this.addLabels();
    this.updateDataFromServer();
  }

  updateDataFromServer(){
    console.log('updateTempDataFromServerFunction() called');    
    this.updateTempDataFromServerFunction = setInterval(() => {
      console.log('called');
      //this.tempDataFromServer = Math.random() * 100;
      this.getData()
      //this.addTemp();
      //this.addHumidity();
      this.addLabels();
      this.get_Date();
      console.log('Add Current Data');
      this.drawChart();
    }, 5000)
  }

  getData = () => {
    const body = this.postObj;
    this.gs.http(this.url, body).subscribe(
      res => {
        this.response = res;
        if(this.response['device_id']){
          const current_temp: any = this.response['temperature']
          const current_humidity: any = this.response['humidity']

          if(this.temp.length > 24){
            this.temp.shift()
          }
          this.current_temp = current_temp.toFixed(1);
          this.temp.push(current_temp);

          if(this.humidity.length > 24){
            this.humidity.shift()
          }
          this.current_humidity = current_humidity.toFixed(1);
          this.humidity.push(current_humidity)
        }
        else{
          console.log('post error');
          const current_temp = 0.0;
          const current_humidity = 0.0;
        }
      }
    )
  }

  /*addTemp = () => {
    const current_temp: any = Math.random() * 100;
    if(this.temp.length > 24){
      this.temp.shift()
    }
    this.current_temp = current_temp.toFixed(1);
    this.temp.push(current_temp);
  }*/

  /*addHumidity = () => {
    const current_humidity: any = Math.random() * 10;
    if(this.humidity.length > 24){
      this.humidity.shift()
    }
    this.current_humidity = current_humidity.toFixed(1);
    this.humidity.push(current_humidity)
  }*/

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
    this.date = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate()
    localStorage.today = this.date
  }

  get_Date = () => {
    const date = new Date()
    this.date = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate()
    /*if(this.date != localStorage.date){
      localStorage.today = this.date
    }*/
    if(this.humidity.length > 24){
      this.resetDate()
    }
  }

  resetDate = () => {
    localStorage.temp = JSON.stringify(this.temp)
    localStorage.humidity = JSON.stringify(this.humidity)
    localStorage.labels = JSON.stringify(this.labels)
  }

  drawChart = () => {
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
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
            fontColor: '#ff66666'
          }
        },
        {
          id: 'y-humidity',
          type: 'linear',
          position: 'right',
          ticks: {
            max: 70.0,
            fontColor: '#005fff'
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