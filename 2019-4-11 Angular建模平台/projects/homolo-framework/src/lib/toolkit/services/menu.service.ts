import { Injectable } from '@angular/core';
import { RestClient } from '../../core/services/rest-client.service';
import { Menu } from '../models/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private accessMenu: Menu;

  constructor(private restClient: RestClient) { }

  setMenu(menu: Menu) {
    this.accessMenu = menu;
  }

  getMenu(): Menu {
    return this.accessMenu;
  }
}

