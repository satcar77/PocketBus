import { Component, ViewChild,ElementRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import {AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
//import { LocalNotifications } from '@ionic-native/local-notifications';
import { ToastController } from 'ionic-angular';
import {AddLocationPage} from '../add-location/add-location';
import { Events } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  item:any;
  allcord:any;
  marker:any;
  sub: any;
  loading:any;
  sTime:any=0;
  time:{hour: number,seconds:number,minutes:number}={hour:0,seconds:0,minutes:0};
  userLoc: any;
  userMarker:any;
  scheduleStatus:boolean=false;
  public message: { name: String, description: String, error: String}={name:"",description:"",error:"Loading.."};

  constructor(private toastCtrl:ToastController,public af:AngularFireDatabase,public loadingCtrl: LoadingController,
//private localNotifications: LocalNotifications,
  public navCtrl: NavController,public events:Events, public platform: Platform,private storage:Storage,public connection: ConnectivityServiceProvider) {
       events.subscribe('refresh', (location) => {
    this.userLoc=location;
  });
   }
scheduleNotification(){
   let toast = this.toastCtrl.create({
      message: 'You will be notified '+this.sTime+' minutes before the arrival!',
      duration: 3000,
      position:'top'
    });
  if(this.scheduleStatus){
    this.scheduleStatus=false;
    toast.setMessage('Notification has been cancelled');
    toast.present();
//this.localNotifications.cancelAll();
    return;
  }
    
    toast.present();
//   this.localNotifications.schedule({
//   id: 1,
//   title:'Your bus is approaching',
//   at: new Date(new Date().getTime() + (this.time.seconds*1000-this.sTime*1000*60)),
//   text: 'Your selected bus '+ this.item.name + ' is approaching in '+ this.sTime,
//   led: 'FF0000',
// });

  this.scheduleStatus=true;
  
}
checkScheduleStatus(){
  //this.localNotifications.isScheduled(1).then((val)=>this.scheduleStatus=val);
}
rad (x) {
  return x * Math.PI / 180;
};

getDistance (p1, p2) {
  let R = 6378137; // Earth’s mean radius in meter
  let dLat = this.rad(p2[0] - p1[0]);
  let dLong = this.rad(p2[1] - p1[1]);
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.rad(p1[0])) * Math.cos(this.rad(p2[0])) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d; // returns the distance in meter
};
createUserMarker(){
let iconBase = 'https://storage.googleapis.com/material-icons/external-assets/v4/icons/svg/ic_beenhere_black_48px.svg';
  this.userMarker= new google.maps.Marker({
    position:new google.maps.LatLng(0,0) ,
    map: this.map,
    icon: iconBase 
  });
}
updateUserMarker(){
if(!(this.userMarker && this.userLoc))
return;
this.userMarker.setPosition(new google.maps.LatLng(this.userLoc[0],this.userLoc[1]));
}
getTime(){
  if(!this.userLoc)
  return;
  let velocity=4;
  this.time.seconds=this.getDistance(this.userLoc,[this.item.lat,this.item.lng])/velocity;
  this.time.minutes=Math.round(this.time.seconds / 60);
  this.time.hour=Math.round(this.time.minutes / 60);
  this.time.seconds=Math.round(this.time.seconds % 60);
}
ionViewDidLoad() {
      
     this.loading = this.loadingCtrl.create({
    content: 'Loading..'
  });
  
  //this.loading.present();

    this.loadMap();
    this.addMarker();
    this.createUserMarker();
    this.checkScheduleStatus();
    this.ionViewDidEnter();
}
updateMap(){
  if(this.map)
  this.map.panTo(new google.maps.LatLng(this.item.lat,this.item.lng));
}
   getItem(id: string) {
return this.af.object('/busLocation/'+id);
  }
  ionViewDidEnter(){
  this.storage.get('busStop').then((value)=>{
     if(value==null){
            this.navCtrl.push(AddLocationPage);
            return;
      } 
      this.userLoc=value;
      this.updateUserMarker();
  });
    this.storage.get('sTime').then((value)=>{
        
        this.sTime=value;
    });

    if(this.connection.isOffline()){
      this.message.error="You are offline!";
      return;
    }
  this.storage.get('selectedBus').then((val)=>{
      if(!val){
         this.message.error="No bus selected!";
         return;
      
      }
      this.track(val);
      // this.loading.dismiss();
      
      });
     
    // if(typeof this.map=="undefined" || typeof this.marker=="undefined"){
     
    //   this.loadMap();
    //   this.addMarker();
    // }
    
  
  }
  
  track(val){
      this.sub=this.getItem(val).subscribe(
        (x)=>{
        //  this.loading.dismiss();
          if(!(x.lat||x.lng)){
               this.message.error="The selected bus is not online!";
               this.item=null;
               return;
          }
          this.message.error="";
          this.message.name=x.name;
          this.message.description=x.description;
          this.item=x;
          this.getTime();
          this.updateMap();
          this.updateMarker();
      }
      )
  }
  loadMap() {
let latLng = new google.maps.LatLng(27.7172,85.3240);
 
    let mapOptions = {
      center: latLng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }
  addMarker(){
  this.marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: this.map.getCenter(),
  });
 
  //let content = this.item.description;          
 
  //this.addInfoWindow(content);
 
}
  addInfoWindow(content){
 
  let infoWindow = new google.maps.InfoWindow({
    content: content
  });
  
  google.maps.event.addListener(this.marker, 'click', () => {
   infoWindow.open(this.map, this.marker);
  });
 
}
updateMarker(){
  if(this.marker)
  this.marker.setPosition(new google.maps.LatLng(this.item.lat,this.item.lng));
}

}
