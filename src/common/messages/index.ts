import { sendMessageToBus, EventBusMessageType } from '../eventbus'

const buildSchedulerAddJob = (name: string, cron: string, callback: any) => {
  sendMessageToBus(EventBusMessageType.SERVICE_SCHEDULER_ADD_JOB, {
    name,
    cron,
    callback,
  });
}


export const messagesHelper = {
  buildSchedulerAddJob
}
