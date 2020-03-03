import { Injectable } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs/ngx';

export interface AlertOptions {
  message: string;
  title: string;
  buttonName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private dialog: Dialogs,
  ) { }

  loginKeyNotFound() {
    const options: AlertOptions = {
      message: 'Please generate a login key first.',
      title: 'Login key not found',
      buttonName: 'Generate Key',
    };
    return this.showAlert(options);
  }

  loginRequestFailed() {
    const options: AlertOptions = {
      message: 'Please check your Internet connectivity and try again.',
      title: 'Login failed',
      buttonName: 'OK',
    };
    return this.showAlert(options);
  }

  private showAlert(options: AlertOptions) {
    return this.dialog.alert(options.message, options.title, options.buttonName);
  }
}
