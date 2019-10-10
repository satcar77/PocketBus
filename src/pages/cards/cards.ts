import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  notices:any;
  message:string="";

 constructor(public navCtrl: NavController,af:AngularFireDatabase, public network: ConnectivityServiceProvider) {
    this.notices= af.list('/notice',{query: {
    orderByKey: false,
    limitToLast: 10,
     } });
  }
  ionViewDidEnter() {
  if(this.network.isOffline())
      this.message="You are Offline!";
  else
    this.message="";
}
}
