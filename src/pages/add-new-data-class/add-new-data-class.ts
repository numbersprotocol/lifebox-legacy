import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { getRepository, Repository } from 'typeorm';
import { CustomClassEntity } from '../../entities/customClass.entity';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Icons } from './icons';
import { CustomClassRecordEntity } from '../../entities/customClassRecord.entity';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';

const maxClass: number = 15;

const rangeValidator: ValidatorFn = (formGroup: FormGroup): ValidationErrors | null => {
  const min = +<number>formGroup.get('min').value;
  const max = +<number>formGroup.get('max').value;

  if (min == null || max == null) {
    return null;
  }

  return (min < max)
  ? null
  : { rangeFailed: true };
};

@Component({
  selector: 'page-add-new-data-class',
  templateUrl: 'add-new-data-class.html'
})
export class AddNewDataClassPage {
  customClassRepo: Repository<CustomClassEntity>;
  customClassRecordsRepo: Repository<CustomClassRecordEntity>;
  customClassForm: FormGroup;
  fieldNameTable: object;

  constructor(public navCtrl: NavController,
              private formBuilder: FormBuilder) {
    this.customClassForm = this.formBuilder.group({
      name: ['', Validators.required],
      max: ['', Validators.required],
      min: ['', Validators.required],
      unit: [''],
      interval: ['', Validators.required],
    }, { validator: rangeValidator });
    this.fieldNameTable = {
      name: "Class Name",
      max: "Expected Max",
      min: "Expected Min",
      unit: "Unit",
      interval: "Interval"
    };
  }

  ngOnInit() {
    return new Promise((resolve, rejects) => {
      this.customClassRepo = getRepository(CustomClassEntity);
      this.customClassRecordsRepo = getRepository(CustomClassRecordEntity);
      resolve(true);
    });
  }

  // TODO: copy-paste from profile.ts, need to modulize this for reusing
  getInvalidFields(form: FormGroup, fieldNameTable: object): string[] {
    var invalidFields: string[] = [];
    var controls = form.controls;
    for (var name in controls) {
      if (controls[name].invalid) {
        if (controls[name] instanceof FormGroup) {
          let child: FormGroup = <FormGroup>controls[name];
          invalidFields = invalidFields.concat(this.getInvalidFields(child, fieldNameTable));
        } else {
          invalidFields.push(fieldNameTable[name]);
        }
      }
    }
    return invalidFields;
  }

  async addNewClass() {
    await this.customClassRepo.count()
    .then(async count => {
      if (count >= maxClass) {
        alert('Reach max number of customize class: ' + maxClass);
      } else {
        console.log('Custom class form: ', this.customClassForm);
        if (this.customClassForm.valid) {
          console.log('Form valid');

          let newClass = new CustomClassEntity();
          newClass = this.customClassForm.value;
          this.customClassRepo.save(newClass)
          .then(newClass => {
            let newRecord = new CustomClassRecordEntity();
            newRecord.class = newClass;
            newRecord.value = 0;
            newRecord.dateTimeStamp = new Date().getTime();
            this.customClassRecordsRepo.save(newRecord)
            .then(() => {
              console.log('New class value: ', newRecord);
              this.navCtrl.push(TabsControllerPage);
            })
            .catch(err => {
              console.log('db save err: ', err);
              alert('Class name is used, please choose another name');
            });
          })
        } else {
          let errMsg: string = '';
          console.log('Form invalid', this.customClassForm);
          if (this.customClassForm.errors) {
            if (this.customClassForm.errors.rangeFailed) {
              errMsg += 'Expected Max is smaller than Expected Min\n\n';
            }
          }
          let invalidFields = this.getInvalidFields(this.customClassForm, this.fieldNameTable);
          console.log(invalidFields);
          if (invalidFields.length > 0) {
            errMsg += ('Please fill these field(s):\n' + invalidFields.join('\n'));
          }
          alert(errMsg);
        }
      }
    })
    .catch(err => {
      console.log('customClassRepo count fetch failed: ', err);
      return;
    });
  }
}
