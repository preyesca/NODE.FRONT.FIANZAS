import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[InputRestriction]'
})
export class InputRestrictionDirective {

  @Input('InputRestriction') InputRestriction!: string;

  constructor(
    private element: ElementRef,
    private readonly control: NgControl,
    private renderer: Renderer2,
  ) {

  }

  @HostListener('keypress', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    const inputRestriction = this.InputRestriction.toUpperCase();
    const charCode = !event.charCode ? event.which : event.charCode;
    const charStr = String.fromCharCode(charCode);
    let regex: RegExp;

    switch (inputRestriction) {
      case 'UPPERCASE':
        regex = new RegExp('[0-9A-ZÑÁÉÍÓÚ ]');
        break;
      case 'NAMES':
        regex = new RegExp('[0-9A-ZÑ.ÁÉÍÓÚ ]');
        break;
      case 'NUMBERS':
        regex = new RegExp('[0-9]');
        break;
      case 'DATE':
        regex = new RegExp('[0-9/]');
        break;
      default:
        // Si la restricción no está definida, no se aplica ninguna restricción
        return true;
    }

    if (regex.test(charStr)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  @HostListener('blur')
  onBlur() {
    let valuefield = (this.element.nativeElement as HTMLInputElement).value;
    var reestriction = this.InputRestriction.toUpperCase();

    switch (reestriction) {
      case 'UPPERCASE':
        valuefield = valuefield.toUpperCase().replace(/ +/g, ' ');
        break;
      case 'NAMES':
        let words = valuefield.split(" ");

        for (let i = 0; i < words.length; i++) {
          words[i] = words[i].trim()

          if (words[i].length > 0) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
          }
        }
        valuefield = words.join(" ").replace(/ +/g, ' ');
        break;
      case 'NUMBERS':
        valuefield = valuefield.replace(/ +/g, '');
        break;

    }

    this.control.control?.setValue(valuefield.trim());
  }
}
