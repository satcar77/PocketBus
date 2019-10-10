import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable} from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';

@Component({
  selector: 'page-bus-selection',
  templateUrl: 'bus-selection.html'
})
export class BusSelectionPage {
  cardItems: any[];
  busList: FirebaseListObservable<any>;
  selectedbus:any;
  status:any;
  message: String="";
  buses:any[]=[];
  constructor(public navCtrl: NavController,private af:AngularFireDatabase,private storage:Storage, public network: ConnectivityServiceProvider) {
    af.list('/busInformations/').subscribe((items)=>{items.forEach(
      (item)=>{
        let a=item;
        a.online=false;
        af.list('/busLocation/').subscribe((online)=>{
           online.forEach(
            (snap)=>{
              if(snap.$key===a.$key)
              a.online=true;
            });
          
        });
        this.buses.push(a);
      }
    )
        
    });
  }
  ionViewDidLoad() {
    
  this.storage.get('selectedBus').then((val)=>{
  this.selectedbus=val;
   
}
  );
}
ionViewDidEnter() {
  if(this.network.isOffline()){
      this.message="You are Offline!";
  }else{
    this.message="";
  }
 
}

  select(item){
    this.selectedbus=item;
    this.storage.set('selectedBus',item);
  }
}
