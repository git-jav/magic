
/*
 * Copyright(c) Thomas Hansen thomas@servergardens.com, all right reserved
 */

// Angular and system imports.
import { Injectable } from '@angular/core';

// Application specific imports.
import { HttpService } from './http.service';
import { Status } from '../models/status.model';
import { Response } from '../models/response.model';

/**
 * Setup service, allows you to setup, read, and manipulate your configuration
 * settings.
 */
@Injectable({
  providedIn: 'root'
})
export class SetupService {

  /**
   * Creates an instance of your service.
   * 
   * @param httpService HTTP service to use for backend invocations
   */
  constructor(private httpService: HttpService) { }

  /**
   * Returns the status of the backend.
   */
  public status() {

    // Invoking backend and returning observable to caller.
    return this.httpService.get<Status>('/magic/modules/system/setup/status');
  }

  /**
   * Loads your backend's configuration.
   */
  public loadConfig() {

    /*
     * Invoking backend and returning observable to caller.
     * Notice, we can't use a strong type here, since configuration might
     * change as user adds his own settings to the configuration file.
     */
    return this.httpService.get<any>('/magic/modules/system/setup/load-config-file');
  }

  /**
   * Will setup your system according to the specified arguments.
   * 
   * @param databaseType Default database type to use for your magic database
   * @param password Root user's password to use
   * @param settings Configuration for your system
   */
  public setup(databaseType: string, password: string, settings: any) {

    // Invoking backend and returning observable to caller.
    return this.httpService.post<Response>('/magic/modules/system/setup/setup', {
      databaseType,
      password,
      settings: JSON.stringify(settings),
    });
  }

  /**
   * Applies a license to the system.
   * 
   * @param license License content
   */
  public saveLicense(license: string) {

    // Invoking backend and returning observable to caller.
    return this.httpService.post<Response>('/magic/modules/system/setup/save-license', {
      license,
    });
  }
}