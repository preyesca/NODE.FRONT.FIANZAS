import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  CountdownComponent,
  CountdownConfig,
  CountdownEvent,
  CountdownStatus,
} from 'ngx-countdown';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { FnzSearchDataService } from 'src/app/modules/fianzas/services/fnz-search.service';
import { IUserStorageUserDto } from 'src/app/shared/helpers/interfaces/storage/user-storage.interface';
import { CustomizerSettingsService } from 'src/app/shared/services/layout/customizer-settings.service';
import { ToggleService } from 'src/app/shared/services/layout/toggle.service';
import { SwalService } from 'src/app/shared/services/notification/swal.service';
import { AuthStorageService } from 'src/app/shared/services/storage/auth-storage.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userInfo!: IUserStorageUserDto;
  isSticky: boolean = false;
  isToggled = false;

  configCountDown: CountdownConfig = { leftTime: 2400 };
  @ViewChild('cdLogout', { static: false })
  private countdown!: CountdownComponent;

  constructor(
    private readonly swal: SwalService,
    private toggleService: ToggleService,
    private datePipe: DatePipe,
    public themeService: CustomizerSettingsService,
    private userStorageService: UserStorageService,
    private authStorageService: AuthStorageService,
    // private searchDataService: SearchDataService,
    private searchDataServiceFnz: FnzSearchDataService,
    private authService: AuthService
  ) {
    this.userInfo = this.userStorageService.getCurrentUserInfo();

    this.toggleService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });

    this.themeService.isRestartCount$.subscribe((isRestartCount) => {
      if (isRestartCount && this.countdown != undefined) {
        this.countdown.restart();
      }
    });
  }

  ngOnInit(): void {
    this.authService.getTimeLogout().subscribe((data: any) => {
      this.configCountDown = { leftTime: Number(data.data) * 60 };
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
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

  toggleCardBorderTheme() {
    this.themeService.toggleCardBorderTheme();
  }

  toggleHeaderTheme() {
    this.themeService.toggleHeaderTheme();
  }

  toggleCardBorderRadiusTheme() {
    this.themeService.toggleCardBorderRadiusTheme();
  }

  toggleRTLEnabledTheme() {
    this.themeService.toggleRTLEnabledTheme();
  }

  currentDate: Date = new Date();
  formattedDate: any = this.datePipe.transform(
    this.currentDate,
    'dd MMMM yyyy'
  );

  logout(): void {
    this.swal
      .question({
        html: 'Se cerrará la sesión actual </br>¿Está seguro?',
      })
      .then((response) => {
        if (response.isConfirmed) this.authStorageService.logout();
      });
  }

  sendData(data: any) {
    //this.searchDataService.setValueSearch(data);
    this.searchDataServiceFnz.setValueSearch(data);
  }

  countEvent(event: CountdownEvent) {
    if (event.status == CountdownStatus.done) {
      this.authStorageService.logout();
    }
  }
}
