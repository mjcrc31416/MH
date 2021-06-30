import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[MinuteNumber]'
})
export class MinuteNumberDirective {

  constructor(private el: ElementRef) {
  }

  @Input() MinuteNumber: boolean;

  @HostListener('keydown', ['$event'])
  onKeyDown(event) {
    let e = <KeyboardEvent> event;
    if ( this.MinuteNumber ) {
      if ( [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+V
        (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39) ) {
        // let it happen, don't do anything
        return;
      }
      // Ensure that it is a number and stop the keypress
      if ( (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) ) {
        console.log(this.el.nativeElement.value);
        e.preventDefault();
      }

      console.log(this.el.nativeElement.value);
      console.log(e.key);

      let tempVal = this.el.nativeElement.value.toString() + e.key.toString();
      console.log(tempVal);
      if (tempVal.toString().length>2) {
        tempVal = tempVal.substring(1,3);
      }
      console.log(tempVal);

      if ( !(+tempVal >= 0 && +tempVal <= 59) ) {
        e.preventDefault();
      } else {
        // if (tempVal.toString().length <= 1) {
        //   this.el.nativeElement.value = '0'+ tempVal.toString();
        // } else {
        //   this.el.nativeElement.value = tempVal;
        // }
      }
    }
  }

}
