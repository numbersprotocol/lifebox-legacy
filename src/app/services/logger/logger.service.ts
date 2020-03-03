import { Injectable } from '@angular/core';
import { RepoService } from '../repo/repo.service';
import { LogEntity } from 'src/app/entities/log.entity';
import { FindOption } from 'src/app/models/find-option.model';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  logs = new Subject<LogEntity[]>();
  newLog = new Subject<LogEntity>();
  subscriptions = new Subscription();

  constructor(
    private dialog: Dialogs,
    private repoService: RepoService,
    private toastService: ToastService,
  ) {}

  error(error: Error) {
    const now = new Date();
    const logTimestamp = this.createLogTimestamp(now);
    const errorLog = this.formatErrorLog(error, logTimestamp);
    console.error(errorLog);
    if (environment.production === true) {
      return;
    }
    const log = this.createLogEntity(now.getTime(), logTimestamp, 'Error', error.name, errorLog);
    this.addLog(log);
  }

  deleteAllLogs() {
    this.dialog.confirm(
      'Are you sure you want to delete all logs?',
      'Delete All Logs',
      ['Yes', 'No']
    ).then(buttonIndex => {
      if (buttonIndex !== 1) {
        return;
      }
      this.repoService.findLog()
      .then(logs => this.repoService.removeLog(logs))
      .then(() => this.fetchLogs());
    }).catch(e => {
      throw new Error(e);
    });
  }

  async fetchLogs() {
    this.logs.next(await this.repoService.findLog(FindOption.Desc()));
  }

  async fetchNewLog(log: LogEntity) {
    this.newLog.next(log);
  }

  showLogWithDialog(log: LogEntity) {
    this.dialog.alert(log.message, log.title, 'OK');
  }

  watchLogs() {
    return this.logs.asObservable();
  }

  registerErrorLogNotification() {
    this.subscriptions.add(this.newLog.subscribe(() => {
      this.toastService.showError();
    }));
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private async addLog(log: LogEntity) {
    return Promise.all([
      this.repoService.saveLog(log),
      this.fetchLogs(),
      this.fetchNewLog(log),
    ]);
  }

  private createLogEntity(timestamp: number, timeString: string, level: string, title: string, message: string) {
    const log = new LogEntity();
    log.dataTimestamp = timestamp;
    log.timeString = timeString;
    log.level = level;
    log.title = title;
    log.message = message;
    return log;
  }

  private createLogTimestamp(date: Date) {
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ssZ', 'en-US');
  }

  private formatErrorLog(error: Error, logTimestamp: string) {
    return `${logTimestamp} E/${error.name}: ${error.message}
            ${error.stack}`;
  }

}
