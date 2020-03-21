export class Env {
  host(): string {
    return process.env.HOST || '127.0.0.1';
  }
}

export default new Env();
