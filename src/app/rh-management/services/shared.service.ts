import { Component, Injectable } from '@angular/core';

//******* service for Preloader rh/list page *******

export interface ILoader {
  isLoading: boolean;
}

@Injectable()
export class SharedService {

  loader: ILoader = {isLoading: false};

  showLoader() {
    this.loader.isLoading = true;
  }

  hideLoader() {
    this.loader.isLoading = false;
  }

  constructor() { }

}
