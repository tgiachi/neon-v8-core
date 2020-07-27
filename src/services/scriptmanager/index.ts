import { INeonService, logger, defaultConfig } from '../../common';
import { NeonEngine } from '../neon-core';
import { Logger } from 'winston';
import * as fs from 'fs';
import * as chokidar from 'chokidar';
import * as debug from 'debug';
import { VM } from 'vm2';
import * as path from 'path';

export class ScriptManagerService implements INeonService {
  name: string;
  description: string;
  version: string;
  logger: Logger;
  neonEngine: NeonEngine;
  private watchers: Map<string, chokidar.FSWatcher> = new Map();
  constructor() {
    this.name = 'scriptmanager-service';
    this.description = 'ScriptManager Service';
    this.version = 'v1.0.0';
    this.logger = logger.createLogger(this.name);
  }

  start(): Promise<boolean> {
    return Promise.resolve(true);
  }
  configure(_neonEngine: NeonEngine): Promise<boolean> {
    this.neonEngine = _neonEngine;
    this.loadScripts();
    this.startWatchDirectory(defaultConfig.scriptsDirectory);
    return Promise.resolve(true);
  }
  private loadScripts() {
    const files = fs
      .readdirSync(defaultConfig.scriptsDirectory)
      .filter((val) => val.endsWith('.js'));

    for (const f of files) {
      this.logger.info(`Loading file ${f}`);
      // this.executeScript(path.join(defaultConfig.scriptsDirectory, f));
    }
  }
  private startWatchDirectory(directoryName: string) {
    const watcher = chokidar.watch(directoryName, { persistent: true });
    watcher.on('add', this.watcherOnAdd.bind(this));
    watcher.on('change', this.watcherOnAdd.bind(this));
  }
  private watcherOnAdd(path: string) {
    if (path.endsWith('.js')) {
      this.executeScript(path);
    }
  }

  private executeScript(path: string) {
    try {
      const virtualMachine = new VM({
        timeout: 1000,
        sandbox: {...this.neonEngine.context },
      });
      this.logger.info(`Executing script ${path}`);
      const content = fs.readFileSync(path);

      virtualMachine.run(content.toString());
    } catch (err) {
      this.logger.error(`Error during execute script ${path} => ${err}`);
    }
  }

  exportedContext() {
    return {
      neonEngine: this.neonEngine,
      console: {
        log: (text) => {
          debug('script')(text);
        },
      },
      logger: logger.createLogger('script'),
    };
  }
}
