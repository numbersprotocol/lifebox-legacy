import { ViewContainerRef } from '@angular/core';
import { Injectable } from '@angular/core';
import { RestService } from './../../providers/rest/rest.service';
import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { LoadingController, NavController, Loading } from 'ionic-angular';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})

@Injectable()
export class ProfilePage {
  loader: Loading;
  profileForm: FormGroup;
  img_url: SafeUrl;
  genderSpec: [];
  nationalitySpec: [];
  public customOptions: any = {
    buttons: [{
      text: 'Clear',
      handler: () => this.profileForm.controls['birthday'].setValue(null)
    }]
  }

  constructor(public imagePicker: ImagePicker,
              public loadingController: LoadingController,
              public navCtrl: NavController,
              public restService: RestService,
              public viewContainerRef: ViewContainerRef,
              public sanitizer: DomSanitizer,
              public formBuilder: FormBuilder) {
    console.log('Create form')
    this.profileForm = this.formBuilder.group({
      user: this.formBuilder.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', Validators.required]
      }),
      image: [''],
      birthday: [''],
      gender: [''],
      nationality: [''],
      city: ['']
    });
  }

  async ngOnInit() {
    this.presentLoading();
    await this.getProfileSchema()
    .then(response => {
      this.genderSpec = response['actions']['PUT']['gender']['choices'];
      this.nationalitySpec = response['actions']['PUT']['nationality']['choices'];
      console.log('nationalities: ', this.nationalitySpec);
    })
    .catch(err => {
      console.log(err);
    });
    await this.getProfile().then(() => {
      console.log('Get profile done');
    });
    this.dismissLoading();
  }

  presentLoading() {
    this.loader = this.loadingController.create({
      content: 'Please wait...'
    });
    this.loader.present();
  }

  dismissLoading() {
    this.loader.dismiss();
  }

  async getProfile() {
    await this.restService.getProfile()
    .then(data => {
      this.profileForm.patchValue(data);
      this.img_url = this.sanitizer.bypassSecurityTrustUrl(
        "data:image/*;base64," + this.profileForm.controls['image'].value);
    });
  }

  getProfileSchema() {
    return this.restService.getProfileSchema()
  }

  getInvalidFields(form: FormGroup): string[] {
    var invalidFields: string[] = [];
    var controls = form.controls;
    for (var name in controls) {
      if (controls[name].invalid) {
        if (controls[name] instanceof FormGroup) {
          let child: FormGroup = <FormGroup>controls[name];
          invalidFields = invalidFields.concat(this.getInvalidFields(child));
        } else {
          invalidFields.push(name.replace('_', ' '));
        }
      }
    }
    return invalidFields;
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.presentLoading();
      console.log('Form valid');
      if (!this.profileForm.controls['birthday'].value) {
        this.profileForm.patchValue({
          birthday: null
        })
      }
      this.restService.patchProfile(this.profileForm.value)
      .then(async _ => {
        await this.getProfile();
        this.dismissLoading();
      });
    } else {
      console.log('Form invalid');
      const invalidFields = this.getInvalidFields(this.profileForm);
      alert('Please fill these field(s):\n' + invalidFields.join('\n'));
    }
  }

  updatePicture() {
    let options = {
      maximumImagesCount: 1,
      width: 800,
      height: 800,
      outputType: 1,
    }
    this.imagePicker.getPictures(options).then((results) => {
      this.profileForm.patchValue({
        image: results[0]
      });
      this.updateProfile();
    }, (err) => {console.log(err)});
  }

  goToMain(params){
    if (!params) params = {};
    this.navCtrl.push(HomePage);
  }
  goToTabController(params){
    if (!params) params = {};
    this.navCtrl.push(TabsControllerPage);
  }
}
