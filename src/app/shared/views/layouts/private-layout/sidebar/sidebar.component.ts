import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IResponse } from 'src/app/shared/helpers/interfaces/response';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { CustomizerSettingsService } from 'src/app/shared/services/layout/customizer-settings.service';
import { ToggleService } from 'src/app/shared/services/layout/toggle.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  userInfo!: IUserStorageUserDto;
  sidebar: ISideBar = <ISideBar>{ pathInicial: '', modulos: [] };

  panelOpenState = false;
  isToggled = false;

  constructor(
    private router: Router,
    private toggleService: ToggleService,
    public themeService: CustomizerSettingsService,
    private userStorageService: UserStorageService
  ) {
    this.userInfo = this.userStorageService.getCurrentUserInfo();

    this.toggleService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }

  ngOnInit(): void {
    this.toggleService.getMenu().subscribe((sidebar: IResponse<ISideBar>) => {
      sidebar.data.modulos.forEach((modulo: IModulo) => {
        modulo.menus = modulo.menus.map((menu: IMenu) => {
          const nee = {
            ...menu,
            expanded: menu.submenus.some(
              (sbm: ISubmenu) => sbm.path === this.router.url
            ),
          };
          return nee;
        });
      });

      this.sidebar = sidebar.data;
    });
  }

  toggle() {
    this.toggleService.toggle();
  }

  toggleSidebarTheme() {
    this.themeService.toggleSidebarTheme();
  }

  toggleHideSidebarTheme() {
    this.themeService.toggleHideSidebarTheme();
  }
}

export interface ISideBar {
  pathInicial: string;
  modulos: IModulo[];
}

export interface IModulo {
  descripcion: string;
  orden: number;
  menus: IMenu[];
}

export interface IMenu {
  descripcion: string;
  path: string;
  icono: string;
  orden: number;
  expanded: boolean;
  submenus: ISubmenu[];
}

export interface ISubmenu {
  descripcion: string;
  path: string;
  orden: number;
}
