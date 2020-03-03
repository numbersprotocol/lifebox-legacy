import { Injectable, ErrorHandler } from '@angular/core';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(
    private logger: LoggerService,
  ) { }

  handleError(error: Error) {
    this.logger.error(error);
  }

}
