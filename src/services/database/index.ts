import { Logger } from 'winston';
import { logger, INeonService, defaultConfig } from '../../common';
import path = require('path');
import fs = require('fs');
import Datastore = require('nedb');

export class DatabaseService implements INeonService {
  private logger: Logger;
  private datastore: IDataStore = {};
  private dbFullPath: string;
  name: string;
  version: string;

  constructor() {
    this.name = 'Database Service';
    this.version = 'v1.0.0';
    this.logger = logger.createLogger('database-service');
  }
  async configure(): Promise<boolean> {
    this.dbFullPath = defaultConfig.defaultDatabasePath;
    if (fs.existsSync(this.dbFullPath) === false) {
      fs.mkdirSync(this.dbFullPath);
    }

    this.logger.info(`Scanning db directory ${this.dbFullPath} `);
    this.loadDatabases(this.dbFullPath);

    this.insertRecord('users', {
      userId: 'admi4n',
      password: 'Ok',
      isEnabled: true,
    });

    return true;
  }

  insertRecord(tableName: string, data: any) {
    if (this.datastore[tableName] === undefined) {
      this.logger.info(`Loading database ${tableName}`);
      this.datastore[tableName] = new Datastore({
        filename: path.join(this.dbFullPath, `${tableName}.db`),
        autoload: true,
      });
    }

    this.datastore[tableName].insert(data);
    // this.datastore[tableName].loadDatabase();
  }

  loadDatabases(directory: string) {
    const files = fs.readdirSync(directory);
    for (const f of files) {
      if (f.endsWith('.db')) {
        const baseName = path.basename(f).replace('.db', '');
        this.logger.info(`Loading database ${f}`);
        this.datastore[baseName] = new Datastore({
          filename: path.join(this.dbFullPath, f),
          autoload: true,
        });
      }
    }
  }

  public async start(): Promise<boolean> {
    this.logger.log('info', 'Starting database service');
    return true;
  }
}

export interface IDataStore {
  [key: string]: Datastore;
}
