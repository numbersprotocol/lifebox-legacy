import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PhotoService } from '../../app/photo.service';

@Component({
  selector: 'page-camera',
  templateUrl: './camera.html',
  // styleUrls: ['./camera.css']
})
export class CameraPage {

  constructor(public navCtrl: NavController, public photoService: PhotoService) {

  }

  ngOnInit() {
    this.photoService.loadSaved();
  }

}
