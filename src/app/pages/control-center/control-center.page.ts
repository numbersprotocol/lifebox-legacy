import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

import { ConfigService } from '../../services/config/config.service';
import { RepoService } from 'src/app/services/repo/repo.service';
import { SensorService } from '../../services/sensor/sensor.service';

import { CustomClassEntity } from 'src/app/entities/customClass.entity';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';
import { DataService } from '../../services/data/data.service';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.page.html',
  styleUrls: ['./control-center.page.scss'],
})
export class ControlCenterPage implements OnInit {
  locationEnabled: boolean;
  pedometerEnabled: boolean;
  gyroscopeEnabled: boolean;

  customClasses: CustomClassEntity[];

  text = {
    header: '',
    sensors: '',
    pedometer: '',
    location: '',
    gyroscope: '',
    beta: '',
    customClass: '',
    updateButton: '',
  };
  locationCoords: any;
  latitude: number;
  longitude: number;
  timetest: any;
  localData: any;
  S: number;
  W: number;
  E: number;
  N: number;
  inHome: any;
  subscriptions = new Subscription();

  constructor(
    private alertController: AlertController,
    private configService: ConfigService,
    private language: LanguageService,
    private navCtrl: NavController,
    private sensorService: SensorService,
    private repoService: RepoService,
    private dataService: DataService,

    private storage: Storage,

    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy

  ) {
    this.storage.get('coords').then((p) => {
      this.latitude = p.latitude,
        this.longitude = p.longitude,
        console.log('Your coords is', p);
    });

    this.locationCoords = {
      latitude: "",
      longitude: "",
      accuracy: "",
      timestamp: ""
    }
    this.subscribeText();
    this.timetest = Date.now();

  }
  // async saveNewClass() {
  //   await this.storage.set('bloodData', {
  //     height: this.customClassForm.getRawValue().height,
  //     weight: this.customClassForm.getRawValue().weight,
  //     urine: this.customClassForm.getRawValue().urine,
  //     sugar: this.customClassForm.getRawValue().sugar,
  //     heartbeat: this.customClassForm.getRawValue().heartbeat,
  //     diastolic: this.customClassForm.getRawValue().diastolic,
  //     systolic: this.customClassForm.getRawValue().systolic,
  //   });
  //   this.bloodstoreService.Bloodstore.emit('useraction');
  //   this.navCtrl.navigateBack(['/tabs', 'home']);
  // }
  async startCalc() {
    // var homeLatitude = 24.147911; 
    // var homeLongitude = 120.673141;
    await this.checkGPSPermission()
    var homeLatitude = this.latitude;
    var homeLongitude = this.longitude;
    this.storage.get('coords').then((p) => {
      homeLatitude = p.latitude,
        homeLongitude = p.longitude,
        console.log('Your coords is', p);
    });
    var c = 0.5;//ＫＭ
    var lat_diff = c / 110.574;  //利用距離的比例來算出緯度上的比例
    var lon_distance = 111.320 * Math.cos(homeLatitude * Math.PI / 180); //算出該緯度上的經度長度
    var lon_diff = c / lon_distance; //利用距離的比例來算出經度上的比例


    this.N = homeLatitude + Math.abs(lat_diff),
      this.S = homeLatitude - Math.abs(lat_diff),
      this.E = homeLongitude + Math.abs(lon_diff),
      this.W = homeLongitude - Math.abs(lon_diff);


    if (this.W < this.longitude && this.longitude < this.E && this.S < this.latitude && this.latitude < this.N) {
      alert('location OK');
      this.inHome = "OK";
    } else {
      alert('location NO');
    }
  }

  async getHomeLocltion() {
    await this.checkGPSPermission()
    this.storage.set('coords', {
      latitude: this.latitude,
      longitude: this.longitude
    });
  }

  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {
          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        alert(err);
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              alert('requestPermission Error requesting location permissions ' + error)
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getLocationCoordinates()
      },
      error => alert('Error requesting location permissions ' + JSON.stringify(error))
    );
  }

  // Methos to get device accurate coordinates using device GPS
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;
      console.log(this.latitude)
      console.log(this.longitude)
      //  this.storage.set('coords', {
      //   latitude:this.latitude,
      //   longitude:this.longitude
      // });
      // return { latitude:this.latitude,
      //   longitude:this.longitude}
    }).catch((error) => {
      alert('Error getting location' + error);
    });
  }

  ngOnInit() {
    this.language.updateText();
    this.locationEnabled = this.configService.isLocationSensorOn();
    this.pedometerEnabled = this.configService.isPedometerSensorOn();
    this.gyroscopeEnabled = this.configService.isGyroscopeSensorOn();
  }

  async ionViewWillEnter() {
    this.customClasses = await this.repoService.getCustomClassWithRecordOrderByIdDesc();
  }

  handleLocationToggleChange() {
    this.sensorService.updateLocationSensorStatus(this.locationEnabled);
  }

  handlePedometerToggleChange() {
    this.sensorService.updatePedometerSensorStatus(this.pedometerEnabled);
  }

  handleGyroscopeToggleChange() {
    this.sensorService.updateGyroscopeSensorStatus(this.gyroscopeEnabled);
  }
  GetLocation() {
    this.dataService.addLocationStatus(false).then(res => {
      console.log('locationStatus added: ', res);
      console.log('longitude: ', res);
      console.log('latitude: ', res);
    });
  }
  async delete(customClass: CustomClassEntity) {
    const alert = await this.alertController.create({
      header: 'Delete data class confirmation',
      message: `Are you sure you want to delete ${customClass.name}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Yes',
          handler: async () => {
            await this.repoService.removeCustomClass([customClass]);
            this.customClasses = await this.repoService.getCustomClassWithRecordOrderByIdDesc();
          }
        }
      ]
    });
    await alert.present();
  }

  update() {
    const updates = [];
    this.customClasses.forEach(async element => {
      updates.push(this.repoService.saveCustomClass(element));
      updates.push(this.repoService.saveCustomClassRecord(element.records));
    });
    Promise.all(updates)
      .then(_ => {
        this.navCtrl.navigateRoot(['/tabs']);
      })
      .catch(err => {
        console.log(err);
      });
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeText() {
    this.subscriptions.add(this.language.text.record.header.get()
      .subscribe(res => this.text.header = res));
    this.subscriptions.add(this.language.text.record.sensors.get()
      .subscribe(res => this.text.sensors = res));
    this.subscriptions.add(this.language.text.record.pedometer.get()
      .subscribe(res => this.text.pedometer = res));
    this.subscriptions.add(this.language.text.record.location.get()
      .subscribe(res => this.text.location = res));
    this.subscriptions.add(this.language.text.record.gyroscope.get()
      .subscribe(res => this.text.gyroscope = res));
    this.subscriptions.add(this.language.text.record.beta.get()
      .subscribe(res => this.text.beta = res));
    this.subscriptions.add(this.language.text.record.customClass.get()
      .subscribe(res => this.text.customClass = res));
    this.subscriptions.add(this.language.text.record.updateButton.get()
      .subscribe(res => this.text.updateButton = res));
  }

}