import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from "@angular/core";
import { ControlValueAccessor, FormGroupDirective, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContentComponent),
      multi: true
    }
  ]
})
export class ContentComponent implements OnInit  {
  @ViewChild("backdrop") $backdrop!: ElementRef<HTMLDivElement>;
  @ViewChild("textarea") $textarea!: ElementRef<HTMLTextAreaElement>;

  onChanges!: ($value: any) => void;
  onTouched!: () => void;
  private textValue!: string;
  constructor(private parentFormGroup: FormGroupDirective) {
    
  }

  ngOnInit(): void {
    this.parentFormGroup.control.get('content')?.valueChanges.subscribe((value) => {
      this.textValue = value;
    })
  }

  get highlightedText () {
    return this.applyHighlights(this.textValue)
  }

  get formGroup() {
    return this.parentFormGroup.control
  }

  applyHighlights(text: string) {
    text = text ? text
      .replace(/\n$/g, "\n\n") : '';
    const source = this.parentFormGroup.control.get('keywords')?.value ?
      this.parentFormGroup.control.get('keywords')?.value.split(', ') :
      []
    source.forEach((x: string) => {
      text = text
      .replace(new RegExp(x, 'g'), "<mark>$&</mark>");
    })
    return text;
  }

  handleScroll() {
    var scrollTop = this.$textarea.nativeElement.scrollTop;
    this.$backdrop.nativeElement.scrollTop = scrollTop;

    var scrollLeft = this.$textarea.nativeElement.scrollLeft;
    this.$backdrop.nativeElement.scrollLeft = scrollLeft;
  }
}
