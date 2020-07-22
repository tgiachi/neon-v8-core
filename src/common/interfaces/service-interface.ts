export interface INeonService {
  name: string;
  version: string;
  start(): Promise<boolean>;
  configure(): Promise<boolean>;
}
