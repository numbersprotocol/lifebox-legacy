import { Component, OnInit } from '@angular/core';
import { LogEntity } from 'src/app/entities/log.entity';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-log-viewer',
  templateUrl: './log-viewer.page.html',
  styleUrls: ['./log-viewer.page.scss'],
})
export class LogViewerPage implements OnInit {
  logs: LogEntity[] = [];
  subscriptions = new Subscription();

  constructor(
    private logger: LoggerService,
  ) {
    this.subscriptions.add(this.logger.watchLogs()
    .subscribe(res => this.logs = res));
  }

  async ngOnInit() {
    this.logger.fetchLogs();
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  deleteAllLogs() {
    this.logger.deleteAllLogs();
  }

  showAllLogs(log) {
    this.logger.showLogWithDialog(log);
  }

}
