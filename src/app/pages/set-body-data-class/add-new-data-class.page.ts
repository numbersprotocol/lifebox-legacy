import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, Form } from '@angular/forms';

import { NavController } from '@ionic/angular';
import { ActivatedRoute } from "@angular/router";

import { DataService } from '../../services/data/data.service';
import { defaultMessages } from '../../services/validation/validation.service';
import { CustomClassEntity } from '../../entities/customClass.entity';
import { BloodDataClassEntity } from '../../entities/bloodDataClass.entity';
import { BloodstoreService } from '../../services/blood-data-store/bloodstore.service';
import { Storage } from '@ionic/storage';

import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';

const maxClass = 55;

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
  num = ["1", "2", 3, 4, 5, 6, 7];
  customClassForm: FormGroup;
  formControls = [
    {
      title: 'Interval',
      name: 'systolic',
      placeholder: '0',
      type: 'number',
      autoCapitalize: 'off',
      autoComplete: 'off',
      clearInput: true,
      validationMessages: defaultMessages,
    }, {
      title: 'Interval',
      name: 'diastolic',
      placeholder: '0',
      type: 'number',
      autoCapitalize: 'off',
      autoComplete: 'off',
      clearInput: true,
      validationMessages: defaultMessages,
    }, {
      title: 'Interval',
      name: 'heartbeat',
      placeholder: '0',
      type: 'number',
      autoCapitalize: 'off',
      autoComplete: 'off',
      clearInput: true,
      validationMessages: defaultMessages,
    }, {
      title: 'Interval',
      name: 'sugar',
      placeholder: '0',
      type: 'number',
      autoCapitalize: 'off',
      autoComplete: 'off',
      clearInput: true,
      validationMessages: defaultMessages,
    },
    {
      title: 'Expected Min',
      name: 'weight',
      placeholder: '0',
      type: 'number',
      autoCapitalize: 'off',
      autoComplete: 'off',
      clearInput: true,
      validationMessages: defaultMessages,
    }, {
      title: 'Expected Max',
      name: 'height',
      placeholder: '0',
      type: 'number',
      autoCapitalize: 'off',
      autoComplete: 'off',
      clearInput: true,
      validationMessages: defaultMessages,
    }, {
      title: 'Interval',
      name: 'urine',
      placeholder: '0',
      type: 'number',
      autoCapitalize: 'off',
      autoComplete: 'off',
      clearInput: true,
      validationMessages: defaultMessages,
    }


  ];
  text = {
    header: '',
    doneButton: '',
  };
  test123 = "99990";
  subscriptions = new Subscription();


  constructor(
    private storage: Storage,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private language: LanguageService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    public bloodstoreService: BloodstoreService
  ) {
    this.storage.get('bloodData').then((p) => {

      this.customClassForm.patchValue({
        systolic: p.systolic,
        diastolic: p.diastolic,
        heartbeat: p.heartbeat,
        sugar: p.sugar,
        weight: p.weight,
        height: p.height,
        urine: p.urine,
      })
      console.log('Your age is', p);
    });


    // this.route.queryParams.subscribe(p => {
    //   this.customClassForm.patchValue({
    //     weight: p.weight,
    //     height: p.height,
    //     urine: p.urine,
    //     sugar: p.sugar,
    //     heartbeat: p.heartbeat,
    //     diastolic: p.diastolic,
    //     systolic: p.systolic,
    //   })
    // });
    

    this.customClassForm = this.formBuilder.group({
      name: ['', Validators.required],
      systolic: [0, fpValidator],
      diastolic: [0, fpValidator],
      heartbeat: [0, fpValidator],
      sugar: [0, fpValidator],
      weight: [0, fpValidator],
      height: [0, fpValidator],
      urine: [0, fpValidator],
      max: ['0', fpValidator],
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

  async setNewClass() {
    this.navCtrl.navigateBack(['/tabs', 'home'], {
      queryParams: {
        height: this.customClassForm.getRawValue().height,

        weight: this.customClassForm.getRawValue().weight,
        urine: this.customClassForm.getRawValue().urine,
        sugar: this.customClassForm.getRawValue().sugar,
        heartbeat: this.customClassForm.getRawValue().heartbeat,
        diastolic: this.customClassForm.getRawValue().diastolic,
        systolic: this.customClassForm.getRawValue().systolic,
      }
    });
  }
  async saveNewClass() {
    await this.storage.set('bloodData', {
      height: this.customClassForm.getRawValue().height,
      weight: this.customClassForm.getRawValue().weight,
      urine: this.customClassForm.getRawValue().urine,
      sugar: this.customClassForm.getRawValue().sugar,
      heartbeat: this.customClassForm.getRawValue().heartbeat,
      diastolic: this.customClassForm.getRawValue().diastolic,
      systolic: this.customClassForm.getRawValue().systolic,
    });
    this.bloodstoreService.Bloodstore.emit('useraction');
    this.navCtrl.navigateBack(['/tabs', 'home']);
  }




  async addNewClass() {
    if (await this.dataService.isCustomClassReachMax(maxClass)) {
      alert('Reach max number of customize class: ' + maxClass);
    } else {
      this.createCustomClassRecordFromFormGroup(this.customClassForm);
    }
  }

  private createCustomClassRecordFromFormGroup(formGroup: FormGroup) {
    let customClassEntity = new BloodDataClassEntity();
    customClassEntity = formGroup.value;
    this.dataService.addNewCustomClass(customClassEntity)
      .then(() => {
        this.navCtrl.navigateBack(['/tabs', 'home']);
      }).catch(err => {
        console.log('db save err: ', err);
        alert('Class name is used, please choose another name' + err);
      });
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeText() {
    this.subscriptions.add(this.language.text.addBodyDataClass.header.get()
      .subscribe(res => this.text.header = res));
    this.subscriptions.add(this.language.text.addBodyDataClass.systolic.get()
      .subscribe(res => this.formControls[0].title = res));
    this.subscriptions.add(this.language.text.addBodyDataClass.diastolic.get()
      .subscribe(res => this.formControls[1].title = res));
    this.subscriptions.add(this.language.text.addBodyDataClass.heartbeat.get()
      .subscribe(res => this.formControls[2].title = res));
    this.subscriptions.add(this.language.text.addBodyDataClass.sugar.get()
      .subscribe(res => this.formControls[3].title = res));
    this.subscriptions.add(this.language.text.addBodyDataClass.weight.get()
      .subscribe(res => this.formControls[4].title = res));
    this.subscriptions.add(this.language.text.addBodyDataClass.height.get()
      .subscribe(res => this.formControls[5].title = res));
    this.subscriptions.add(this.language.text.addBodyDataClass.urine.get()
      .subscribe(res => this.formControls[6].title = res));
    this.subscriptions.add(this.language.text.addBodyDataClass.doneButton.get()
      .subscribe(res => this.text.doneButton = res));
  }
}
