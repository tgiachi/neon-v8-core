export interface INeonService {
  start(): Promise<boolean>;
  name: string;
  version: string;
  configure(): Promise<boolean>;
}
