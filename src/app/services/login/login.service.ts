import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { RestService } from '../rest/rest.service';
import { QuickLoginPayload, LoginPayload } from 'src/app/models/api-payload.model';
import { Account, EncryptedKeystoreV3Json } from 'web3-eth-accounts';
import Web3 from 'web3';
import { LoginResponse } from 'src/app/models/api-response.model';
import { DialogService } from '../dialog/dialog.service';
import { NavController } from '@ionic/angular';

export interface Session {
  uid: number;
  token: string;
  loggedIn: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  keyFile = 'web3_key.json';
  session: Session;
  web3: Web3 = new Web3('http://localhost:8545');

  constructor(
    private dialogService: DialogService,
    private file: File,
    private navCtrl: NavController,
    private restService: RestService,
  ) {
    this.session = this.createEmptySession();
  }

  async keyExists() {
    return this.file.checkFile(this.file.dataDirectory, this.keyFile)
    .then(() => {
      return true;
    }).catch(() => {
      return false;
    });
  }

  async login() {
    if (!await this.keyExists()) {
      await this.dialogService.loginKeyNotFound();
      this.navCtrl.navigateRoot(['/key-generation'], {skipLocationChange: true});
      return;
    }
    let tempToken = '';
    return new Promise<boolean>(resolve => {
      Promise.all([
        this.restService.getWeb3Token(),
        this.getWeb3AccountFromKeyfile(this.keyFile),
      ]).then(([token, account]) => {
        const loginPayload = this.createLoginPayloadFromWeb3Account(account, token);
        tempToken = token;
        return this.restService.postLogin(loginPayload);
      }).then(loginResponse => {
        this.session = this.createLoginSession(loginResponse, tempToken);
        this.storeQuickLoginSessionInfo(this.session);
        resolve(true);
      }).catch(e => {
        const err = JSON.stringify(e);
        console.error(`Login failed. Reason: ${err}`);
        this.dialogService.loginRequestFailed();
        resolve(false);
      });
    });
  }

  signOut() {
    this.session = this.createEmptySession();
  }

  quickLogin() {
    const storedSession = this.loadQuickLoginSessionInfo();
    if (storedSession.uid === -1 || storedSession.token === '') {
      return Promise.resolve(false);
    }
    return new Promise<boolean>(resolve => {
      this.restService.postQuickLogin(storedSession)
      .then((res: QuickLoginPayload) => {
        this.session = this.createQuickLoginSession(res);
        this.storeQuickLoginSessionInfo(this.session);
        resolve(true);
      }).catch(() => resolve(false));
    });
  }

  private createLoginPayloadFromWeb3Account(account: Account, tokenStr: string): LoginPayload {
    return {
      address: this.web3.utils.toHex(account.address),
      signature: account.sign(tokenStr).signature,
      token: tokenStr,
    };
  }

  private createEmptySession(): Session {
    return {
      uid: -1,
      token: '',
      loggedIn: false,
    };
  }

  private createLoginSession(loginResponse: LoginResponse, loginToken: string): Session {
    return {
      uid: loginResponse.uid,
      token: loginToken,
      loggedIn: true,
    };
  }


  private createQuickLoginSession(quickLoginPayload: QuickLoginPayload): Session {
    return {
      uid: quickLoginPayload.uid,
      token: quickLoginPayload.token,
      loggedIn: true,
    };
  }

  private getWeb3AccountFromKeyfile(keyFile: string) {
    return new Promise<Account>((resolve, reject) => {
      this.file.readAsText(this.file.dataDirectory, keyFile)
      .then(fileStr => {
        const fileContent: EncryptedKeystoreV3Json = JSON.parse(fileStr);
        resolve(this.web3.eth.accounts.decrypt(fileContent, ''));
      }).catch(e => reject(e));
    });
  }

  private loadQuickLoginSessionInfo(): Session {
    return {
      uid: +localStorage.getItem('session-uid'),
      token: localStorage.getItem('session-token'),
      loggedIn: false,
    };
  }

  private storeQuickLoginSessionInfo(session: Session) {
    localStorage.setItem('session-uid', session.uid.toString());
    localStorage.setItem('session-token', session.token);
  }
}
