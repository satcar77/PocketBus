import { Component, ElementRef,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { Events } from 'ionic-angular';
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-add-location',
  templateUrl: 'add-location.html',
})

export class AddLocationPage {
@ViewChild('map2') mapElement: ElementRef;
  map: any;
  marker : any;
  selectedCoord: [number, number]=[0,0];
  message:String="";
 self:any;
 location:any;
  constructor(private toastCtrl:ToastController,
  public events:Events,public navCtrl: NavController, public navParams: NavParams,public storage:Storage,public geolocation:Geolocation) {
  this.self=this;
}
ionViewDidLoad(){
  
    this.storage.get('busStop').then((value)=>{
    if(value != null)
    this.selectedCoord=value;
    else
    this.selectedCoord=[27.7172, 85.3240];
    if(typeof google==undefined || typeof google.maps==undefined){
      this.message="Error loading map. Please check your internet connection!";
  return;  
  }
    this.loadMap(); 
    });
}  
   loadMap() {
    let latLng = new google.maps.LatLng(this.selectedCoord[0], this.selectedCoord[1]);
    let mapOptions = {
      center: latLng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.loadMarker(latLng);  
  
}
 loadMarker(myLatlng:any){
   this.marker = new google.maps.Marker({
    position: myLatlng,
    map: this.map,
    draggable:true,
    title:"Drag me!"
});
let self=this;
  google.maps.event.addListener(this.marker, 'dragend', function (event) {
    self.selectedCoord[0]=event.latLng.lat();
    self.selectedCoord[1]=event.latLng.lng();
  });
 }
 trackMe(){
this.geolocation.getCurrentPosition().then((position) => {
  let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  this.map.setCenter(latLng);
  this.marker.setPosition(latLng);
  this.selectedCoord[0]=position.coords.latitude;
  this.selectedCoord[1]=position.coords.longitude;
   }).catch((error) => {
  console.log('Error getting location', error);
  this.message="Cannot get the device location. Make sure the GPS is turned on";
});
 }
 geoCoder(latlng:any){
   let geocoder=new google.maps.Geocoder;
   let self=this;
    geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
              self.location=results[1].formatted_address; 
              self.storage.set('busStopLocation',self.location).then(()=>self.events.publish('refresh',self.selectedCoord));
          } 
          } else {
            self.location="No Address Found";
          }
        });
 }
  
  onSave(){
    this.storage.set('busStop',this.selectedCoord);
    this.geoCoder(new google.maps.LatLng(this.selectedCoord[0], this.selectedCoord[1]));
    let toast = this.toastCtrl.create({
      message: 'Bus stop assigned successfully!',
      duration: 3000,
      position:'top'
    });
    this.navCtrl.pop();
    toast.present();
    
    
}
  

}
