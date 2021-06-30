import {
  A,
  Z
} from '@angular/cdk/keycodes';
import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  OnInit,
  Renderer2,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appUppercase]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UppercaseDirective),
      multi: true,
    },
  ],
})
export class UppercaseDirective implements ControlValueAccessor {
  /** implements ControlValueAccessorInterface */
  _onChange: (_: any) => void;

  /** implements ControlValueAccessorInterface */
  _touched: () => void;

  constructor( @Self() private _el: ElementRef, private _renderer: Renderer2) { }

  /** Trata as teclas */
  @HostListener('keyup', ['$event'])
  onKeyDown(evt: KeyboardEvent) {
    const keyCode = evt.keyCode;
    const key = evt.key;
    console.log(evt);

    let value = this._el.nativeElement.value.toUpperCase();
    value = value.replace(/Á/g, "A");
    value = value.replace(/É/g, "E");
    value = value.replace(/Í/g, "I");
    value = value.replace(/Ó/g, "O");
    value = value.replace(/Ú/g, "U");
    value = value.replace(/´/g, "");
    console.log(value);
    this._renderer.setProperty(this._el.nativeElement, 'value', value);
    this._onChange(value);
    evt.preventDefault();


    // if (keyCode >= A && keyCode <= Z || keyCode === 186 || keyCode === 222) {
    //   let value = this._el.nativeElement.value.toUpperCase();
    //   value = value.replace(/Á/g, "A");
    //   value = value.replace(/É/g, "E");
    //   value = value.replace(/Í/g, "I");
    //   value = value.replace(/Ó/g, "O");
    //   value = value.replace(/Ú/g, "U");
    //   value = value.replace(/´/g, "");
    //   console.log(value);
    //   this._renderer.setProperty(this._el.nativeElement, 'value', value);
    //   this._onChange(value);
    //   evt.preventDefault();
    //   return;
    // }
    //
    // if (keyCode === 222 || keyCode === 229) {
    //   const value = this._el.nativeElement.value.toUpperCase();
    //   console.log(value);
    //   this._renderer.setProperty(this._el.nativeElement, 'value', value.substr(0, value.length-1));
    //   this._onChange(value);
    //   evt.preventDefault();
    //   return;
    // }
  }

  /** Trata as teclas */
  @HostListener('keydown', ['$event'])
  onKeyDown2(evt: KeyboardEvent) {
    const keyCode = evt.keyCode;
    const key = evt.key;
    console.log(evt);
    if (keyCode === 222 || keyCode === 229 || key === 'Dead') {
      console.log('PREVENT DEFAULT');
      evt.preventDefault();
    } else {
      return;
    }
  }

  @HostListener('blur', ['$event'])
  onBlur() {
    this._touched();
  }

  /** Implementation for ControlValueAccessor interface */
  writeValue(value: any): void {
    this._renderer.setProperty(this._el.nativeElement, 'value', value);
  }

  /** Implementation for ControlValueAccessor interface */
  registerOnChange(fn: (_: any) => void): void {
    this._onChange = fn;
  }

  /** Implementation for ControlValueAccessor interface */
  registerOnTouched(fn: () => void): void {
    this._touched = fn;
  }

  /** Implementation for ControlValueAccessor interface */
  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._el.nativeElement, 'disabled', isDisabled);
  }
}
