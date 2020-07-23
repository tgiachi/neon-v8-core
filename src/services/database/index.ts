import { Logger } from 'winston';
import {
  logger,
  INeonService,
  defaultConfig,
  subscribeMessageToBus,
  EventBusMessageType,
} from '../../common';
import path = require('path');
import fs = require('fs');
import Datastore = require('nedb');
import { NeonEngine } from '..';

export class DatabaseService implements INeonService {
  private logger: Logger;
  private datastore: IDataStore = {};
  private dbFullPath: string;
  name: string;
  version: string;
  description: string;

  constructor() {
    this.name = 'database-service';
    this.description = 'Database Service';
    this.version = 'v1.0.0';
    this.logger = logger.createLogger(this.name);
  }

  async configure(_neonEngine: NeonEngine): Promise<boolean> {
    this.dbFullPath = defaultConfig.defaultDatabasePath;
    if (fs.existsSync(this.dbFullPath) === false) {
      fs.mkdirSync(this.dbFullPath);
    }

    this.logger.info(`Scanning db directory ${this.dbFullPath} `);
    this.loadDatabases(this.dbFullPath);

    subscribeMessageToBus(EventBusMessageType.SERVICE_DATABASE_PERSIST_DATA, {
      callback: (_type, payload) => {
        for (const record of payload.records) {
          this.logger.debug(`Persisting data ${payload.database} ${record} `);
          this.insertRecord(payload.database, record);
        }
      },
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

  public loadAll(dbName: string): any[] {
    return this.datastore[dbName].getAllData();
  }

  public async start(): Promise<boolean> {
    this.logger.log('info', 'Starting database service');
    return true;
  }
}

export interface IDataStore {
  [key: string]: Datastore;
}
