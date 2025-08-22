import { SpotifyAuthService } from './spotify-auth';
import { SpotifySearchResponse, SpotifyProfile } from '../types/spotify';

export class SpotifyApiService {
  static async fetchJSON<T>(url: string, token: string): Promise<T> {
    const res = await fetch(url, { 
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (res.status === 401) {
      // Token expired, try to refresh
      const newToken = await SpotifyAuthService.refreshToken();
      if (!newToken) throw new Error("Auth expired");
      return this.fetchJSON(url, newToken);
    }
    
    if (!res.ok) {
      throw new Error(`${res.status}: ${await res.text()}`);
    }
    
    return res.json();
  }

  static async search(query: string, types: string[]): Promise<SpotifySearchResponse> {
    const token = await SpotifyAuthService.getAccessToken();
    if (!token) throw new Error("No access token");

    const params = new URLSearchParams({
      q: query,
      type: types.join(","),
      limit: "24"
    });

    return this.fetchJSON<SpotifySearchResponse>(
      `https://api.spotify.com/v1/search?${params.toString()}`,
      token
    );
  }

  static async getProfile(): Promise<SpotifyProfile> {
    const token = await SpotifyAuthService.getAccessToken();
    if (!token) throw new Error("No access token");

    return this.fetchJSON<SpotifyProfile>(
      "https://api.spotify.com/v1/me",
      token
    );
  }

  static async playTrack(spotifyUri: string, deviceId: string): Promise<boolean> {
    const token = await SpotifyAuthService.getAccessToken();
    if (!token) throw new Error("No access token");

    const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: [spotifyUri]
      })
    });

    return response.ok;
  }

  static async pausePlayback(): Promise<boolean> {
    const token = await SpotifyAuthService.getAccessToken();
    if (!token) throw new Error("No access token");

    const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return response.ok;
  }

  static async resumePlayback(): Promise<boolean> {
    const token = await SpotifyAuthService.getAccessToken();
    if (!token) throw new Error("No access token");

    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return response.ok;
  }

  static async seekToPosition(positionMs: number): Promise<boolean> {
    const token = await SpotifyAuthService.getAccessToken();
    if (!token) throw new Error("No access token");

    const response = await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return response.ok;
  }

  static async setVolume(volumePercent: number, deviceId: string): Promise<void> {
    const token = await SpotifyAuthService.getAccessToken();
    if (!token) throw new Error("No access token");

    try {
      // Spotify API expects volume as 0-100
      const volume = Math.max(0, Math.min(100, volumePercent));
      
      const response = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}&device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Volume control failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Volume control error:', error);
      throw error;
    }
  }

  static async getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    const token = await SpotifyAuthService.getAccessToken();
    if (!token) throw new Error("No access token");

    try {
      const response = await this.fetchJSON<any>(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        token
      );
      
      return response.items.map((item: any) => item.track).filter((track: any) => track !== null);
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      throw error;
    }
  }

  static async getAlbumTracks(albumId: string): Promise<SpotifyTrack[]> {
    const token = await SpotifyAuthService.getAccessToken();
    if (!token) throw new Error("No access token");

    try {
      const response = await this.fetchJSON<any>(
        `https://api.spotify.com/v1/albums/${albumId}/tracks`,
        token
      );
      
      // Album tracks don't include full track info, so we need to fetch each track
      const trackIds = response.items.map((item: any) => item.id);
      if (trackIds.length === 0) return [];
      
      const tracksResponse = await this.fetchJSON<any>(
        `https://api.spotify.com/v1/tracks?ids=${trackIds.join(',')}`,
        token
      );
      
      return tracksResponse.tracks;
    } catch (error) {
      console.error('Error fetching album tracks:', error);
      throw error;
    }
  }

  static async getArtistTopTracks(artistId: string): Promise<SpotifyTrack[]> {
    const token = await SpotifyAuthService.getAccessToken();
    if (!token) throw new Error("No access token");

    try {
      // Get artist's top tracks (default market is user's country)
      const response = await this.fetchJSON<any>(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=from_token`,
        token
      );
      
      return response.tracks;
    } catch (error) {
      console.error('Error fetching artist top tracks:', error);
      throw error;
    }
  }
}
