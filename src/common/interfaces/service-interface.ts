export interface INeonService {
  name: string;
  description: string;
  version: string;
  start(): Promise<boolean>;
  configure(): Promise<boolean>;
}
