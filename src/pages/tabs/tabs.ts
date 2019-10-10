import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { BusSelectionPage } from '../../pages/bus-selection/bus-selection';
import { MapPage } from '../../pages/map/map';
import { CardsPage } from '../../pages/cards/cards';
import { SettingsPage } from '../../pages/settings/settings';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = MapPage;
  tab2Root: any = BusSelectionPage;
  tab3Root: any = CardsPage;
  tab4Root: any = SettingsPage;

  tab1Title = "Home";
  tab2Title = "Select Bus";
  tab3Title = "Notice";
  tab4Title= "Settings";

}
