import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

import { LoadingController } from '@ionic/angular';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';

import { RestService } from '../../services/rest/rest.service';
import { defaultMessages } from '../../services/validation/validation.service';
import { LanguageService } from 'src/app/services/language/language.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  text = {
    birthday: '',
    city: '',
    changeProfilePicture: '',
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    male: '',
    female: '',
    nonbinary: '',
    header: '',
    language: '',
    nationality: '',
    preferNotToShow: '',
    updateButton: '',
  };
  subscriptions = new Subscription();
  languageSelection = 'en';
  profileForm: FormGroup;
  imgUrl: SafeUrl;
  genderSpec: [];
  nationalitySpec: [];
  public customOptions: {} = {
    buttons: [{
      text: 'Clear',
      handler: () => this.profileForm.controls.birthday.setValue(null)
    },
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'Confirm',
      handler: (value) => {
        this.profileForm.controls.birthday.setValue(
          value.year.text + '-' + value.month.text + '-' + value.day.text);
      }
    }]
  };
  formControls = [{
    title: 'First Name',
    name: 'first_name',
    placeholder: 'John',
    type: 'text',
    autoCapitalize: 'on',
    autoComplete: 'on',
    clearInput: true,
    validationMessages: defaultMessages,
  }, {
    title: 'Last Name',
    name: 'last_name',
    placeholder: 'Doe',
    type: 'text',
    autoCapitalize: 'on',
    autoComplete: 'on',
    clearInput: true,
    validationMessages: defaultMessages,
  }, {
    title: 'E-mail',
    name: 'email',
    placeholder: 'example@email.com',
    type: 'email',
    autoCapitalize: 'off',
    autoComplete: 'on',
    clearInput: true,
    validationMessages: defaultMessages,
  }];

  constructor(
    private configService: ConfigService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer,
    private language: LanguageService,
    private loadingController: LoadingController,
    private imagePicker: ImagePicker,
    private restService: RestService,
    private loginService: LoginService,
  ) {
    this.profileForm = this.formBuilder.group({
      user: this.formBuilder.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      }),
      image: [''],
      birthday: [''],
      gender: [''],
      nationality: [''],
      city: ['']
    });
    this.subscribeText();
  }

  async ngOnInit() {
    this.languageSelection = await this.configService.getLanguage();
    this.language.updateText();
    await this.presentLoading();
    await this.getProfileSchema()
      .then((response: any) => {
        this.genderSpec = response.actions.PUT.gender.choices;
        this.nationalitySpec = response.actions.PUT.nationality.choices;
        console.log('nationalities: ', this.nationalitySpec);
      })
      .catch(err => {
        console.log(err);
      });
    await this.getProfile().then(() => {
      console.log('Get profile done');
    });
    await this.dismissLoading();
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  async changeLanguageSelection() {
    return this.language.setLanguage(this.languageSelection);
  }

  async presentLoading() {
    const loader = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loader.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  async getProfile() {
    return this.restService.getProfile(this.loginService.session.uid)
      .then(data => {
        this.profileForm.patchValue(data);
        this.imgUrl = this.sanitizer.bypassSecurityTrustUrl(
          'data:image/*;base64,' + this.profileForm.controls.image.value);
        return Promise.resolve();
      });
  }

  getProfileSchema() {
    return this.restService.getProfileSchema(this.loginService.session.uid);
  }

  getInvalidFields(form: FormGroup): string[] {
    let invalidFields: string[] = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        if (controls[name] instanceof FormGroup) {
          const child: FormGroup = controls[name] as FormGroup;
          invalidFields = invalidFields.concat(this.getInvalidFields(child));
        } else {
          invalidFields.push(name.replace('_', ' '));
        }
      }
    }
    return invalidFields;
  }

  async updatePicture() {
    await this.imagePicker.requestReadPermission();
    if (await this.imagePicker.hasReadPermission()) {
      this.pickPicture().then(() => {
        this.updateProfile();
      }).catch(e => console.log(e));
    }
  }

  async updateProfile() {
    if (this.profileForm.valid) {
      await this.presentLoading();
      if (!this.profileForm.controls.birthday.value) {
        this.profileForm.patchValue({
          birthday: null
        });
      }
      this.restService.patchProfile(
        this.loginService.session.uid,
        this.profileForm.value
      ).then(async _ => {
        await this.getProfile();
        await this.dismissLoading();
      });
    } else {
      console.log('Form invalid');
      const invalidFields = this.getInvalidFields(this.profileForm);
      alert('Please fill these field(s):\n' + invalidFields.join('\n'));
    }
  }

  private async pickPicture() {
    return new Promise((resolve, reject) => {
      const options: ImagePickerOptions = {
        maximumImagesCount: 1,
        width: 800,
        height: 800,
        outputType: 1,
      };
      this.imagePicker.getPictures(options).then((res) => {
        if (res.length > 0) {
          this.profileForm.patchValue({
            image: res[0]
          });
          resolve();
        }
      }).catch(e => reject(e));
    });
  }

  private subscribeText() {
    this.subscriptions.add(this.language.text.profile.header.get().subscribe(res => this.text.header = res));
    this.subscriptions.add(this.language.text.profile.changeProfilePictureButton.get()
    .subscribe(res => this.text.changeProfilePicture = res));
    this.subscriptions.add(this.language.text.profile.firstName.get()
    .subscribe(res => this.formControls[0].title = res));
    this.subscriptions.add(this.language.text.profile.lastName.get()
    .subscribe(res => this.formControls[1].title = res));
    this.subscriptions.add(this.language.text.profile.email.get()
    .subscribe(res => this.formControls[2].title = res));
    this.subscriptions.add(this.language.text.profile.birthday.get()
    .subscribe(res => this.text.birthday = res));
    this.subscriptions.add(this.language.text.profile.city.get()
    .subscribe(res => this.text.city = res));
    this.subscriptions.add(this.language.text.profile.nationality.get()
    .subscribe(res => this.text.nationality = res));
    this.subscriptions.add(this.language.text.profile.gender.get()
    .subscribe(res => this.text.gender = res));
    this.subscriptions.add(this.language.text.profile.male.get()
    .subscribe(res => this.text.male = res));
    this.subscriptions.add(this.language.text.profile.female.get()
    .subscribe(res => this.text.female = res));
    this.subscriptions.add(this.language.text.profile.nonbinary.get()
    .subscribe(res => this.text.nonbinary = res));
    this.subscriptions.add(this.language.text.profile.preferNotToShow.get()
    .subscribe(res => this.text.preferNotToShow = res));
    this.subscriptions.add(this.language.text.profile.updateButton.get()
    .subscribe(res => this.text.updateButton = res));
    this.subscriptions.add(this.language.text.profile.language.get()
    .subscribe(res => this.text.language = res));
  }


}
