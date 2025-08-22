import { SpotifyToken } from '../types/spotify';

export class SpotifyAuthService {
  private static readonly CLIENT_ID = "62d29f2066a04424b311e12cb4d58027";
  private static readonly REDIRECT_URI = window.location.origin + window.location.pathname;
  private static readonly SCOPES = ["user-read-email", "user-read-private", "streaming"];
  private static readonly STATE_KEY = "spotilite_state_v1";

  static generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return Array.from(values).map(v => possible[v % possible.length]).join('');
  }

  static async sha256(plain: string): Promise<ArrayBuffer> {
    const enc = new TextEncoder().encode(plain);
    return await crypto.subtle.digest('SHA-256', enc);
  }

  static base64url(arrayBuffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
      .replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  }

  static async login(): Promise<void> {
    const codeVerifier = this.generateRandomString(64);
    localStorage.setItem("code_verifier", codeVerifier);
    
    const codeChallenge = this.base64url(await this.sha256(codeVerifier));
    const state = this.generateRandomString(16);
    localStorage.setItem(this.STATE_KEY, state);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.CLIENT_ID,
      scope: this.SCOPES.join(" "),
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: this.REDIRECT_URI,
      state
    });

    window.location.assign(`https://accounts.spotify.com/authorize?${params.toString()}`);
  }

  static async exchangeCodeForToken(code: string): Promise<string> {
    const code_verifier = localStorage.getItem("code_verifier");
    if (!code_verifier) throw new Error("No code verifier found");

    const body = new URLSearchParams({
      client_id: this.CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: this.REDIRECT_URI,
      code_verifier
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error_description || data.error);

    const expires_at = Date.now() + (data.expires_in * 1000) - 10_000;
    const token: SpotifyToken = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      token_type: data.token_type,
      expires_at
    };

    localStorage.setItem("spotilite_token", JSON.stringify(token));
    history.replaceState({}, document.title, this.REDIRECT_URI);
    
    return data.access_token;
  }

  static async refreshToken(): Promise<string | null> {
    const raw = localStorage.getItem("spotilite_token");
    if (!raw) return null;

    const tok: SpotifyToken = JSON.parse(raw);
    if (!tok.refresh_token) return null;

    const body = new URLSearchParams({
      client_id: this.CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: tok.refresh_token
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error_description || data.error);

    const expires_at = Date.now() + (data.expires_in * 1000) - 10_000;
    const updated: SpotifyToken = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || tok.refresh_token,
      token_type: data.token_type || tok.token_type,
      expires_at
    };

    localStorage.setItem("spotilite_token", JSON.stringify(updated));
    return updated.access_token;
  }

  static async getAccessToken(): Promise<string | null> {
    const raw = localStorage.getItem("spotilite_token");
    if (!raw) return null;

    const tok: SpotifyToken = JSON.parse(raw);
    if (Date.now() < tok.expires_at && tok.access_token) {
      return tok.access_token;
    }

    try {
      return await this.refreshToken();
    } catch {
      this.logout();
      return null;
    }
  }

  static logout(): void {
    localStorage.removeItem("spotilite_token");
    localStorage.removeItem("code_verifier");
    localStorage.removeItem(this.STATE_KEY);
    location.reload();
  }

  static getStateKey(): string {
    return this.STATE_KEY;
  }
}
