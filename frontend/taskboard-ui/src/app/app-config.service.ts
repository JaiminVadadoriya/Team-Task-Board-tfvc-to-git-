import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  loadConfig(): Promise<void> {
    if (!environment.production) {
      return Promise.resolve();
    }
    return firstValueFrom(this.http.get<{ apiUrl: string }>('/config.json'))
      .then(config => {
        if (config && config.apiUrl) {
          this.apiUrl = config.apiUrl;
        }
      })
      .catch(err => {
        console.error('Could not load production configuration from asset:', err);
      });
  }

  get apiBase(): string {
    return this.apiUrl;
  }
}
