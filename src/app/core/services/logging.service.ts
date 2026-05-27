import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  log(message: string) {
    if (!environment.production) { console.log(`[LOG]: ${message}`); }
  }
  error(message: string) {
    if (!environment.production) { console.error(`[ERROR]: ${message}`); }
  }
}
