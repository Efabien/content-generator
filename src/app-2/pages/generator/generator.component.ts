import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { filter } from "rxjs";
import { GeneratorService } from "../../services/generator.service";

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit {
  public themes = ['Entrepreneurship', 'Science', 'Sport'];
  public tones = ['Professional', 'Casual', 'Humoristic'];
  public languages = ['English', 'French'];
  public form: UntypedFormGroup = new UntypedFormGroup({})
  constructor(
    private _generatorService: GeneratorService,
    private _formBuilder: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {
    this._initForm();
  }

  get isProcessing(): boolean {
    return this._generatorService.loadingResponse;
  }

  private _initForm() {
    this.form = this._formBuilder.group({
      theme: [this.themes[0]],
      tone: [this.tones[0]],
      keywords: [null],
      content: [null],
      language: 'English'
    });
  }

  public generate() {
    this.form.patchValue({ content: null });
    const parameters = this.form.value;
    this._generatorService.generate(
      parameters.theme,
      parameters.tone,
      parameters.language,
      parameters.keywords
    ).subscribe((partialText) => {
      if (partialText) this.form.patchValue({ content: partialText });
    })
  }
}
