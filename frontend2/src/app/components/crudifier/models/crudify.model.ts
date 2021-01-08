
/*
 * Copyright(c) Thomas Hansen thomas@servergardens.com, all right reserved
 */

/**
 * Crudify model used as input when user wants to crudify a database table,
 * to create a CRUD endpoint wrapping it.
 */
export class Crudify {

  /**
   * Database type, e.g. 'mysql' or 'mssql'.
   */
  databaseType: string;

  /**
   * Name of module to generate. Becomes the root folder
   * name beneath the modules folder on the server.
   */
  moduleName: string;

  /**
   * Module URL. Becomes the last entity in the URL of
   * the endpoint generated
   */
  moduleUrl: string;

  /**
   * Name of database where table can be found.
   */
  database: string;

  /**
   * Name of database table to crudify.
   */
  table: string;

  /**
   * Whether or not the ID should be returned from generated endpoint
   * as items are created. Only relevant for POST endpoint types.
   */
  returnId?: boolean;

  /**
   * Template filename to use for crudifying process.
   * This is the base template used when creating the endpoint Hyperlambda file.
   */
  template: string;

  /**
   * HTTP verb. POST, PUT, DELETE or GET.
   */
  verb: string;

  /**
   * Comma separated list of roles users must belong to to be able
   * to invoke endpoint.
   */
  auth?: string;

  /**
   * Log entry to create when endpoint is invoked.
   */
  log?: string;

  /**
   * Whether or not the crudify process should overwrite existing
   * endpoints or not. If false, the process will throw an exception
   * instead of overwriting previously generated endpoint files.
   */
  overwrite: boolean;

  /**
   * Arguments for endpoint. Basically primary keys and input arguments.
   */
  args: any[];

  /**
   * Input reactors such as validators, transformers, injectables, etc.
   */
  validators?: string;
}
  