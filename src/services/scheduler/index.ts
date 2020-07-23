import {
  INeonService,
  subscribeMessageToBus,
  EventBusMessageType,
  logger,
} from '../../common';
import * as scheduler from 'node-schedule';
import { Logger } from 'winston';
import { NeonEngine } from '..';

export class SchedulerService implements INeonService {
         name: string;
         version: string;
         logger: Logger;
         description: string;
         private jobs: Map<string, scheduler.Job> = new Map();
         constructor() {
           this.name = 'scheduler-service';
           this.description = 'Scheduler service';
           this.version = 'v1.0.0';
         }

         async start(): Promise<boolean> {
           return true;
         }
         async configure(_neonEngine: NeonEngine): Promise<boolean> {
           this.logger = logger.createLogger('scheduler-service');
           subscribeMessageToBus(
             EventBusMessageType.SERVICE_SCHEDULER_ADD_JOB,
             {
               callback: (payload: any) => {
                 this.logger.info(
                   `Adding job name ${payload.name}: CRON: ${payload.cron} `,
                 );
                 const job = scheduler.scheduleJob(
                   payload.name,
                   payload.name,
                   payload.callback,
                 );
                 this.jobs.set(payload.name, job);
               },
             },
           );

           subscribeMessageToBus(
             EventBusMessageType.SERVICE_SCHEDULER_CANCEL_JOB,
             {
               callback: (payload: any) => {
                 this.logger.info(`Cancelling job: ${payload.name}`);
                 if (this.jobs.get(payload.name) !== undefined) {
                   this.jobs.get(payload.name).cancel();
                 }
               },
             },
           );
           return true;
         }
       }
