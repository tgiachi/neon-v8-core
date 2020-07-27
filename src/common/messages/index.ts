import { sendMessageToBus, EventBusMessageType } from '../eventbus';

const buildSchedulerAddJob = (name: string, cron: string, callback: any) => {
  sendMessageToBus(EventBusMessageType.SERVICE_SCHEDULER_ADD_JOB, {
    name,
    cron,
    callback,
  });
};

const buildEvent = (component: string, data: any) => {
  sendMessageToBus(EventBusMessageType.SERVICE_EVENT_ADD, {
    component,
    data,
  });
};

export const messagesHelper = {
  buildSchedulerAddJob,
  buildEvent
};
