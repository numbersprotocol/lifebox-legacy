import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }
}

export const defaultMessages = [
  { type: 'required', message: 'Required' },
  { type: 'email', message: 'Invalid e-mail address' },
  { type: 'pattern', message: 'Decimal place is limited to 1' }
];
