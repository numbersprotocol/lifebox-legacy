import { Injectable } from '@angular/core';
import { ToastController, NavController } from '@ionic/angular';
import { ToastButton, ToastOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
  ) { }

  async showError() {
    const showDetailButton: ToastButton = {
      text: 'LogG Viewer',
      handler: () => this.navCtrl.navigateForward(['/log-viewer']),
    };
    const options: ToastOptions = {
      message: 'An error has occurred.',
      duration: 10000,
      position: 'bottom',
      showCloseButton: true,
      buttons: [showDetailButton],
    };
    const toast = await this.toastCtrl.create(options);
    toast.present();
  }
}
