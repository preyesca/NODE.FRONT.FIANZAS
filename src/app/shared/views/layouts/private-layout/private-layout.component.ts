import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomizerSettingsService } from 'src/app/shared/services/layout/customizer-settings.service';
import { ToggleService } from 'src/app/shared/services/layout/toggle.service';
import { UserStorageService } from 'src/app/shared/services/storage/user-storage.service';

@Component({
  selector: 'app-private-layout',
  templateUrl: './private-layout.component.html',
  styleUrls: ['./private-layout.component.scss'],
})
export class PrivateLayoutComponent {
  isToggled = false;

  constructor(
    public router: Router,
    private toggleService: ToggleService,
    public themeService: CustomizerSettingsService,
    public routeActivated: ActivatedRoute,
    public userStorageService:UserStorageService,
  ) {
    this.toggleService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
    const {proceso, codigo} = this.userStorageService.getCurrentUserInfo().proyecto
    const isMetlifeOnStringCode = codigo.toUpperCase().includes('METLIFE')
    const isSidebarAndHeaderDark = this.themeService.isSidebarDark() === true || this.themeService.isHeaderDark() === true
    if(proceso === 1 && isMetlifeOnStringCode){
      if(isSidebarAndHeaderDark){
        this.themeService.toggleSidebarTheme()
        this.themeService.toggleHeaderTheme()
        this.themeService.toggleAccodionTheme()
      }
    }
  }

  toggleRightSidebarTheme() {
    this.themeService.toggleRightSidebarTheme();
  }

  toggleHideSidebarTheme() {
    this.themeService.toggleHideSidebarTheme();
  }

  toggleCardBorderTheme() {
    this.themeService.toggleCardBorderTheme();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleCardBorderRadiusTheme() {
    this.themeService.toggleCardBorderRadiusTheme();
  }

  toggleRTLEnabledTheme() {
    this.themeService.toggleRTLEnabledTheme();
  }
}
