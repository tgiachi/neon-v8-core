import { NeonEngine } from '../../../services';
import { BaseComponent } from '../../../common/interfaces/base/base-component';
import { neonComponent } from '../../../common/decorators';
import * as telefraf from 'telegraf';

@neonComponent('Telegram', '1.0', 'telegram')
export class TelegramBotComponent extends BaseComponent {
  private token: string;
  private client: telefraf.Telegraf<telefraf.Context>;


  constructor() {
    super();
    this.initVersion(TelegramBotComponent.prototype);
  }
  defaultConfig() {
    return {
      isEnabled: false,
      token: '',
    };
  }
  loadConfig(config: any) {
    this.token = config.token;
  }
  start(_neonEngine: NeonEngine): Promise<boolean> {
    if (this.token != '') {
      this.client = new telefraf.Telegraf(this.token);
      this.client.on('text', (ctx) => {
       ctx.reply(`Hello! ${ctx.message.text} `);
      });
      this.client.launch();
    }

    return Promise.resolve(true);
  }
}
