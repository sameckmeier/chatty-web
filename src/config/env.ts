export class Env {
  apiUrl(): string {
    return `${this.apiHost()}:${this.apiPort()}`;
  }

  apiHost(): string {
    return process.env.API_HOST || 'ws://127.0.0.1';
  }

  apiPort(): string {
    return process.env.API_PORT || '4000';
  }
}

export default new Env();
