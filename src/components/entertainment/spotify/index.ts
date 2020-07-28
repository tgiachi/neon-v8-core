import { BaseComponent } from '../../../common/interfaces/base/base-component';
import { neonComponent } from '../../../common/decorators';
import spotify = require('spotify-web-api-node');
import { NeonEngine } from '../../../services';

@neonComponent('Spotify', '1.0', 'spotify')
export class SpotifyComponent extends BaseComponent {
  private clientId: string;
  private clientSecret: string;
  private spotifyClient: spotify;

  constructor() {
    super();
    this.initVersion(SpotifyComponent.prototype);
  }

  loadConfig(config: any) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.spotifyClient = new spotify({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });
  }

  start(_neonEngine: NeonEngine): Promise<boolean> {
    return Promise.resolve(true);
  }

  defaultConfig() {
    return {
      isEnabled: false,
      clientId: '',
      clientSecret: '',
    };
  }
}
