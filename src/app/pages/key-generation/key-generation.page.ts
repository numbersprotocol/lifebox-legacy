import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController, LoadingController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';

import Web3 from 'web3';

import { defaultMessages } from 'src/app/services/validation/validation.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { SignupPayload } from 'src/app/models/api-payload.model';

// TODO: Put keyFile variable to global as global const
const keyFile = 'web3_key.json';

@Component({
  selector: 'app-key-generation',
  templateUrl: './key-generation.page.html',
  styleUrls: ['./key-generation.page.scss'],
})
export class KeyGenerationPage implements OnInit {
  web3: Web3 = new Web3('http://localhost:8545');
  signup: SignupPayload;
  signUpForm: FormGroup;
  fieldNameTable: object;
  isGenerating = false;
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
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private file: File,
    private dialog: Dialogs,
    private restService: RestService
  ) {
    this.signUpForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]]
    });
  }

  ngOnInit() {
    this.file.checkFile(this.file.dataDirectory, keyFile)
      .then(_ => {
        alert('Key file ' + keyFile + ' found');
        this.navCtrl.navigateRoot(['/login']);
      })
      .catch(_ => {
        console.log('no key file');
      }); // we handle nothing when key file is not found
  }

  async presentLoading() {
    const loader = await this.loadingController.create({
      message: 'Generating a unique key to protect your data, please wait'
    });
    await loader.present();
  }

  async dismissLoading() {
    await this.loadingController.dismiss();
  }

  async _generateKey() {
    await this.presentLoading();
    this.file.checkFile(this.file.dataDirectory, keyFile)
      .then(_ => console.log('Key file ' + keyFile + ' found'))
      .catch(async _ => {
        console.log('Key file ' + keyFile + ' doesn\'t exist');
        const account = this.web3.eth.accounts.create();
        const encryptedKey: string = JSON.stringify(account.encrypt(''));
        this.signup = this.signUpForm.value;
        this.signup.username = account.address;
        console.log('Creating ', account.address);
        console.log('Saving file: ' + encryptedKey + ' to ' + keyFile);
        console.log('Creating account');
        this.restService.signup(this.signup)
          .then(async res => {
            this.file.writeFile(this.file.dataDirectory, keyFile, encryptedKey)
              .catch(err => {
                console.log('File created failed: ' + err);
              });
            await this.dismissLoading();
            this.navCtrl.navigateRoot(['/login']);
            console.log(res);
          })
          .catch(async err => {
            await this.dismissLoading();
            console.log(err);
            alert('Sign up failed, reason: invalid email');
          });
        await this.dismissLoading();
        this.navCtrl.navigateRoot(['/login']);
      });
  }
  async generateKey() {
    this.isGenerating = true;
    await this.restService.getEmail(this.signUpForm.value.email)
      .then(async emails => {
        console.log(emails);
        if (emails.length > 0) {
          this.dialog.confirm(
            'You have generated a key before, but it is not found on this phone. ' +
            'Do you want to generate a new one?',
            'Duplicate email found',
            ['No', 'Yes']
          ).then(async buttonID => {
            switch (buttonID) {
              case 0: // dismissed
                break;
              case 1: // No
                // We don't do anything for now,
                // but leave space for future implement
                break;
              case 2: // Yes
                await this._generateKey();
                break;
              default:
                console.error('Unknown buttonID');
            }
          });
        } else {
          // this should also run key gen
          await this._generateKey();
        }
      })
      .catch(err => {
        console.log(err);
      });
    this.isGenerating = false;
  }
}
