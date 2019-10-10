import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AddLocationPage } from '../add-location/add-location';
import { AboutPage } from '../about/about';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  // Our local settings object
  option1: any;
  sliderVal:any;
  timeBefore:any;
  dateTime: number=20; 
  sTime:any=0;
  location:string="Not Assigned ! ";
  constructor(public navCtrl: NavController,
   public navParams: NavParams,private storage:Storage,public events:Events ) {
       events.subscribe('refresh', (location) => {
     this.storage.get('busStopLocation').then((value)=>{
    if(value)
    this.location=value.replace(new RegExp(",", 'g'),'<br>');
  });
  });
  
}

ionViewDidLoad(){
  this.storage.get('busStopLocation').then((value)=>{
    this.location=value.replace(new RegExp(",", 'g'),'<br>');
  });
  this.storage.get('sTime').then((value)=>{
   if(value)
    this.sTime=value;
  });
 
}
  presentPopover() { 
    this.navCtrl.push(AddLocationPage);
    
  }
    presentAbout() { 
    this.navCtrl.push(AboutPage);
    
  }
  ionViewDidLeave(){
    this.storage.set('sTime',this.sTime);
  }

}
