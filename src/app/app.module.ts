import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { BusSelectionPage } from '../pages/bus-selection/bus-selection';
import { MapPage } from '../pages/map/map';
import { CardsPage } from '../pages/cards/cards';
import { SettingsPage } from '../pages/settings/settings';
import { TabsPage } from '../pages/tabs/tabs';
import { AddLocationPage } from '../pages/add-location/add-location';
import { AboutPage } from '../pages/about/about';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConnectivityServiceProvider } from '../providers/connectivity-service/connectivity-service';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications } from '@ionic-native/local-notifications';
//add your own firebase API key here
  export const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  };
@NgModule({
  declarations: [
    MyApp,
    BusSelectionPage,
    MapPage,
    CardsPage,
    SettingsPage,
    TabsPage,
    AddLocationPage,
    AboutPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    BusSelectionPage,
    MapPage,
    CardsPage,
    SettingsPage,
    TabsPage,
    AddLocationPage,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    Geolocation,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConnectivityServiceProvider
  ]
})
export class AppModule {}
