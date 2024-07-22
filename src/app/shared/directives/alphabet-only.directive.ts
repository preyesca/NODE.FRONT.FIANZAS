import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[alphabetOnly]',
})
export class AlphabetOnlyDirective {
  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]+|(?<=\s)\s+/g, '');
  }
}
