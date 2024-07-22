import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomizerSettingsService {

    private isDarkTheme: boolean;
    private isSidebarDarkTheme: boolean;
    private isRightSidebarTheme: boolean;
    private isHideSidebarTheme: boolean;
    private isHeaderDarkTheme: boolean;
    private isCardBorderTheme: boolean;
    private isCardBorderRadiusTheme: boolean;
    private isRTLEnabledTheme: boolean;
    private isAccordionDarkTheme:boolean;

    constructor() {
        this.isDarkTheme = false;
        this.isSidebarDarkTheme = true;
        this.isRightSidebarTheme = false;
        this.isHideSidebarTheme = false;
        this.isHeaderDarkTheme = true;
        this.isCardBorderTheme = false;
        this.isCardBorderRadiusTheme = false;
        this.isRTLEnabledTheme = false;
        this.isAccordionDarkTheme = true
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        localStorage.setItem('isDarkTheme', JSON.stringify(this.isDarkTheme));
    }

    toggleSidebarTheme() {
        this.isSidebarDarkTheme = !this.isSidebarDarkTheme;
        localStorage.setItem('isSidebarDarkTheme', JSON.stringify(this.isSidebarDarkTheme));
    }

    toggleRightSidebarTheme() {
        this.isRightSidebarTheme = !this.isRightSidebarTheme;
        localStorage.setItem('isRightSidebarTheme', JSON.stringify(this.isRightSidebarTheme));
    }

    toggleHideSidebarTheme() {
        this.isHideSidebarTheme = !this.isHideSidebarTheme;
        localStorage.setItem('isHideSidebarTheme', JSON.stringify(this.isHideSidebarTheme));
    }

    toggleHeaderTheme() {
        this.isHeaderDarkTheme = !this.isHeaderDarkTheme;
        localStorage.setItem('isHeaderDarkTheme', JSON.stringify(this.isHeaderDarkTheme));
    }

    toggleCardBorderTheme() {
        this.isCardBorderTheme = !this.isCardBorderTheme;
        localStorage.setItem('isCardBorderTheme', JSON.stringify(this.isCardBorderTheme));
    }

    toggleCardBorderRadiusTheme() {
        this.isCardBorderRadiusTheme = !this.isCardBorderRadiusTheme;
        localStorage.setItem('isCardBorderRadiusTheme', JSON.stringify(this.isCardBorderRadiusTheme));
    }

    toggleRTLEnabledTheme() {
        this.isRTLEnabledTheme = !this.isRTLEnabledTheme;
        localStorage.setItem('isRTLEnabledTheme', JSON.stringify(this.isRTLEnabledTheme));
    }
    toggleAccodionTheme() {
        this.isAccordionDarkTheme = !this.isAccordionDarkTheme;
        localStorage.setItem('isAccordionDarkTheme', JSON.stringify(this.isAccordionDarkTheme));
    }

    isDark() {
        return this.isDarkTheme;
    }

    isSidebarDark() {
        return this.isSidebarDarkTheme;
    }

    isRightSidebar() {
        return this.isRightSidebarTheme;
    }

    isHideSidebar() {
        return this.isHideSidebarTheme;
    }

    isHeaderDark() {
        return this.isHeaderDarkTheme;
    }

    isCardBorder() {
        return this.isCardBorderTheme;
    }

    isCardBorderRadius() {
        return this.isCardBorderRadiusTheme;
    }

    isRTLEnabled() {
        return this.isRTLEnabledTheme;
    }

    isAccordionDark() {
        return this.isAccordionDarkTheme;
    }

    private isToggled = new BehaviorSubject<boolean>(false);

    get isToggled$() {
        return this.isToggled.asObservable();
    }

    toggle() {
        this.isToggled.next(!this.isToggled.value);
    }


    private isRestartCount = new BehaviorSubject<boolean>(false);

    get isRestartCount$() {
        return this.isRestartCount.asObservable();
    }

    public restartCount() {
        this.isRestartCount.next(true);
    }


}