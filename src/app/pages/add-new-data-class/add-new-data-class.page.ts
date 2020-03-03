import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, Form } from '@angular/forms';

import { NavController } from '@ionic/angular';

import { DataService } from '../../services/data/data.service';
import { defaultMessages } from '../../services/validation/validation.service';
import { CustomClassEntity } from '../../entities/customClass.entity';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';

const maxClass = 15;

const fpValidator = Validators.compose([
  Validators.required,
  Validators.pattern('^\-?[0-9]+(?:\.[0-9]{1})?$')
]);

const rangeValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  const min = formGroup.get('min').value as number;
  const max = formGroup.get('max').value as number;
  if (min == null || max == null) {
    return null;
  }
  return (min < max) ? null : { range: { min, max } };
};

@Component({
  selector: 'app-add-new-data-class',
  templateUrl: './add-new-data-class.page.html',
  styleUrls: ['./add-new-data-class.page.scss'],
})
export class AddNewDataClassPage implements OnInit {
  customClassForm: FormGroup;
  formControls = [{
    title: 'Name',
    name: 'name',
    placeholder: 'Calories',
    type: 'text',
    autoCapitalize: 'on',
    autoComplete: 'on',
    clearInput: true,
    validationMessages: defaultMessages,
  }, {
    title: 'Expected Min',
    name: 'min',
    placeholder: '0',
    type: 'number',
    autoCapitalize: 'off',
    autoComplete: 'off',
    clearInput: true,
    validationMessages: defaultMessages,
  }, {
    title: 'Expected Max',
    name: 'max',
    placeholder: '2000',
    type: 'number',
    autoCapitalize: 'off',
    autoComplete: 'off',
    clearInput: true,
    validationMessages: defaultMessages,
  }, {
    title: 'Interval',
    name: 'interval',
    placeholder: '0',
    type: 'number',
    autoCapitalize: 'off',
    autoComplete: 'off',
    clearInput: true,
    validationMessages: defaultMessages,
  }, {
    title: 'Unit',
    name: 'unit',
    placeholder: 'kcal',
    type: 'text',
    autoCapitalize: 'off',
    autoComplete: 'on',
    clearInput: true,
    validationMessages: defaultMessages,
  }];
  text = {
    header: '',
    doneButton: '',
  };
  subscriptions = new Subscription();

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private language: LanguageService,
    private navCtrl: NavController
  ) {
    this.customClassForm = this.formBuilder.group({
      name: ['', Validators.required],
      max: ['', fpValidator],
      min: [0, fpValidator],
      interval: [0, fpValidator],
      unit: [''],
    }, { validator: rangeValidator });
    this.subscribeText();
  }

  ngOnInit() {
    this.language.updateText();
  }

  // TODO: copy-paste from profile.ts, need to modulize this for reusing
  getInvalidFields(form: FormGroup, fieldNameTable: object): string[] {
    let invalidFields: string[] = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        if (controls[name] instanceof FormGroup) {
          const child: FormGroup = controls[name] as FormGroup;
          invalidFields = invalidFields.concat(this.getInvalidFields(child, fieldNameTable));
        } else {
          invalidFields.push(fieldNameTable[name]);
        }
      }
    }
    return invalidFields;
  }

  async addNewClass() {
    if (await this.dataService.isCustomClassReachMax(maxClass)) {
      alert('Reach max number of customize class: ' + maxClass);
    } else {
      this.createCustomClassRecordFromFormGroup(this.customClassForm);
    }
  }

  private createCustomClassRecordFromFormGroup(formGroup: FormGroup) {
    let customClassEntity = new CustomClassEntity();
    customClassEntity = formGroup.value;
    this.dataService.addNewCustomClass(customClassEntity)
      .then(() => {
        this.navCtrl.navigateBack(['/tabs', 'home']);
      }).catch(err => {
        console.log('db save err: ', err);
        alert('Class name is used, please choose another name');
      });
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeText() {
    this.subscriptions.add(this.language.text.addDataClass.header.get()
    .subscribe(res => this.text.header = res));
    this.subscriptions.add(this.language.text.addDataClass.name.get()
    .subscribe(res => this.formControls[0].title = res));
    this.subscriptions.add(this.language.text.addDataClass.expectedMin.get()
    .subscribe(res => this.formControls[1].title = res));
    this.subscriptions.add(this.language.text.addDataClass.expectedMax.get()
    .subscribe(res => this.formControls[2].title = res));
    this.subscriptions.add(this.language.text.addDataClass.interval.get()
    .subscribe(res => this.formControls[3].title = res));
    this.subscriptions.add(this.language.text.addDataClass.unit.get()
    .subscribe(res => this.formControls[4].title = res));
    this.subscriptions.add(this.language.text.addDataClass.calories.get()
    .subscribe(res => this.formControls[0].placeholder = res));
    this.subscriptions.add(this.language.text.addDataClass.kcal.get()
    .subscribe(res => this.formControls[4].placeholder = res));
    this.subscriptions.add(this.language.text.addDataClass.doneButton.get()
    .subscribe(res => this.text.doneButton = res));
  }
}
