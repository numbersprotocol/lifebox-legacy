import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

const enum loadingMsg {
  general = 'Please wait...',
  keyGeneration = 'Generating a unique key to protect your data, please wait',
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(
    private loadingCtrl: LoadingController,
  ) { }

  async general<T>(promise: Promise<T>) {
    const loader = await this.createLoader(loadingMsg.general);
    await loader.present();
    await promise;
    await loader.dismiss();
  }

  async keyGeneration<T>(promise: Promise<T>) {
    return this.createLoader(loadingMsg.keyGeneration);
  }

  private createLoader(msg: string) {
    return this.loadingCtrl.create({
      message: msg,
    });
  }

}
