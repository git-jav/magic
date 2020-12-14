
/*
 * Copyright(c) Thomas Hansen thomas@servergardens.com, all right reserved
 */

// Angular and system imports.
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

// Application specific imports.
import { HttpService } from './http.service';
import { FileService } from './file.service';
import { Response } from '../models/response.model';

/**
 * Setup service, allows you to setup, read, and manipulate your configuration
 * settings.
 */
@Injectable({
  providedIn: 'root'
})
export class SqlService {

  /**
   * Creates an instance of your service.
   * 
   * @param httpService HTTP service to use for backend invocations
   * @param fileService Used to retrieve and update snippets from your backend
   */
  constructor(
    private httpService: HttpService,
    private fileService: FileService) { }

  /**
   * Executes a piece of SQL and returns its result.
   * 
   * @param databaseType Type of database, for instance 'mssql' or 'mysql'.
   * @param database Database connection string (reference to appsettings.json)
   * @param sql SQL to evaluate
   * @param safeMode If true will only return the first 1.000 records
   */
  public execute(databaseType: string, database: string, sql: string, safeMode: boolean) {

    // Invoking backend and returning observable to caller.
    return this.httpService.post<any[]>('/magic/modules/system/sql/evaluate', {
      databaseType,
      database,
      sql,
      safeMode,
    });
  }
}