import { RestService } from './../../providers/rest/rest.service';
import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { File } from '@ionic-native/file/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx'
import { Signup } from '../../types/signup.type';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import Web3 from 'web3';

// TODO: Put keyFile variable to global as global const
const keyFile: string = 'web3_key.json';

@Component({
  selector: 'page-key-generation',
  templateUrl: 'key-generation.html'
})
export class KeyGenerationPage {
  web3: Web3 = new Web3('http://localhost:8545');
  signup: Signup = new Signup();
  formSignup: FormGroup;
  loader: Loading;
  fieldNameTable: object;

  constructor(public navCtrl: NavController,
              public file: File,
              public restService: RestService,
              public formBuilder: FormBuilder,
              public dialog: Dialogs,
              public loadingCtrl: LoadingController) {
    this.formSignup = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.compose([Validators.email,
                                      Validators.required
                                    ])
      ]
    });
    this.fieldNameTable = {
      first_name: 'First Name',
      last_name: 'Last Name',
      email: 'Email'
    }
  }

  ngOnInit() {
    this.file.checkFile(this.file.dataDirectory, keyFile)
    .then(_ => {
      alert('Key file ' + keyFile + ' found');
      this.navCtrl.popToRoot();
    })
    .catch(_ => {}); // we handle nothing when key file is not found
  }
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: 'Generating a unique key to protect your data, please wait'
    });
    this.loader.present();
  }

  dismissLoading() {
    this.loader.dismiss();
  }

  _generateKey() {
    this.presentLoading();
    this.file.checkFile(this.file.dataDirectory, keyFile)
    .then(_ => console.log('Key file ' + keyFile + ' found'))
    .catch(async err => {
      console.log('Key file ' + keyFile + ' doesn\'t exist')
      let account = this.web3.eth.accounts.create();
      let encryptedKey: string = JSON.stringify(account.encrypt(''));
      this.signup = this.formSignup.value;
      this.signup.username = account.address;
      console.log('Creating ', account.address);
      console.log('Saving file: ' + encryptedKey + ' to ' + keyFile);
      console.log('Creating account');
      this.restService.signup(this.signup)
      .then(res => {
        this.file.writeFile(this.file.dataDirectory, keyFile, encryptedKey)
        .catch(err => {
          console.log('File created failed: ' + err);
        });
        this.dismissLoading();
        this.navCtrl.popToRoot();
        console.log(res);
      })
      .catch(err => {
        this.dismissLoading();
        console.log(err);
        alert('Sign up failed, reason: invalid email');
      });
      this.dismissLoading();
      this.navCtrl.popToRoot();
    });
  }

  async generateKey(params) {
    if (!params) params = {};
    if (this.formSignup.valid) {
      await this.restService.getEmail(this.formSignup.value['email'])
      .then(emails => {
        console.log(emails);
        if (emails.length > 0) {
          this.dialog.confirm(
            "You have generated a key before, but it is not found on this phone. " +
            "Do you want to generate a new one?",
            "Duplicate email found",
            ["No", "Yes"]
          )
          .then(buttonID => {
            switch (buttonID) {
              case 0: // dismissed
                break;
              case 1: // No
                // We don't do anything for now,
                // but leave space for future implement
                break;
              case 2: // Yes
                this._generateKey();
                break;
            }
          })
        } else {
          // this should also run key gen
          this._generateKey();
        }
      })
      .catch(err => {
        console.log(err);
      });
    } else {
      const invalidFields = [];
      const controls = this.formSignup.controls;
      let errStr = '';
      console.log(this.formSignup);
      for (const name in controls) {
        if (controls[name].invalid) {
          if (controls[name].errors['required']) {
            invalidFields.push(this.fieldNameTable[name]);
          } else if (controls[name].errors['email']) {
            errStr += 'Email field format is wrong, please check.\n\n';
          }
        }
      }
      if (invalidFields.length > 0) {
        errStr += 'Please fill these field(s):\n' + invalidFields.join('\n');
      }
      alert(errStr);
    }
  }
}
