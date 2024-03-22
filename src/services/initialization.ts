import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class InitializationService {
  private firstInit = true;

  isFirstInit(): boolean {
    return this.firstInit;
  }

  setFirstInit(value: boolean): void {
    this.firstInit = value;
  }
}