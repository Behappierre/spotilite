import { SpotifyAuthService } from './spotify-auth';
import { SpotifyApiService } from './spotify-api';
import { SpotifyTrack, SpotifyPlayerState } from '../types/spotify';

export class SpotifyPlayerService {
  private player: any = null;
  private deviceId: string | null = null;
  private currentSearchResults: SpotifyTrack[] = [];
  private currentTrackIndex: number = 0;
  private onStateChange?: (state: SpotifyPlayerState) => void;

  constructor() {
    this.initializePlayer();
  }

  private initializePlayer(): void {
    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      this.player = new (window as any).Spotify.Player({
        name: 'SpotiLite Web Player',
        getOAuthToken: (cb: (token: string) => void) => {
          SpotifyAuthService.getAccessToken().then(token => {
            if (token) cb(token);
          });
        }
      });

      this.setupPlayerListeners();
      this.player.connect();
    };
  }

  private setupPlayerListeners(): void {
    if (!this.player) return;

    this.player.addListener('initialization_error', ({ message }: { message: string }) => {
      console.error('Failed to initialize:', message);
    });

    this.player.addListener('authentication_error', ({ message }: { message: string }) => {
      console.error('Failed to authenticate:', message);
    });

    this.player.addListener('account_error', ({ message }: { message: string }) => {
      console.error('Failed to validate Spotify account:', message);
    });

    this.player.addListener('playback_error', ({ message }: { message: string }) => {
      console.error('Failed to perform playback:', message);
    });

    this.player.addListener('player_state_changed', (state: any) => {
      if (state && this.onStateChange) {
        this.onStateChange(state);
      }
    });

    this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
      this.deviceId = device_id;
      console.log('Ready with Device ID', device_id);
    });
  }

  setOnStateChange(callback: (state: SpotifyPlayerState) => void): void {
    this.onStateChange = callback;
  }

  async togglePlayback(): Promise<void> {
    if (!this.player || !this.deviceId) return;

    try {
      const state = await this.player.getCurrentState();
      
      if (state) {
        if (state.paused) {
          await this.player.resume();
        } else {
          await this.player.pause();
        }
      } else {
        await this.player.resume();
      }
    } catch (error) {
      console.error('Toggle playback error:', error);
      // Fallback to API
      await this.fallbackTogglePlayback();
    }
  }

  private async fallbackTogglePlayback(): Promise<void> {
    try {
      const token = await SpotifyAuthService.getAccessToken();
      if (!token) return;

      const stateResponse = await fetch('https://api.spotify.com/v1/me/player', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (stateResponse.ok) {
        const apiState = await stateResponse.json();
        
        if (apiState.is_playing) {
          await SpotifyApiService.pausePlayback();
        } else {
          await SpotifyApiService.resumePlayback();
        }
      }
    } catch (apiError) {
      console.error('API fallback error:', apiError);
    }
  }

  async stopPlayback(): Promise<void> {
    if (!this.player || !this.deviceId) return;

    try {
      await this.player.pause();
      await SpotifyApiService.pausePlayback();
    } catch (error) {
      console.error('Stop playback error:', error);
    }
  }

  async playTrack(spotifyUri: string, trackIndex: number = 0): Promise<boolean> {
    if (!this.deviceId) {
      throw new Error("Player not ready. Please wait...");
    }

    if (!spotifyUri) {
      throw new Error("Invalid track URI");
    }

    try {
      const success = await SpotifyApiService.playTrack(spotifyUri, this.deviceId);
      
      if (success) {
        this.currentTrackIndex = trackIndex;
      }
      
      return success;
    } catch (error) {
      console.error('Playback error:', error);
      throw error;
    }
  }

  async playNextTrack(): Promise<void> {
    if (this.currentSearchResults.length === 0) {
      throw new Error("No tracks available");
    }
    
    if (this.currentTrackIndex >= this.currentSearchResults.length - 1) {
      throw new Error("Already at the last track");
    }

    this.currentTrackIndex++;
    const nextTrack = this.currentSearchResults[this.currentTrackIndex];
    
    if (nextTrack && nextTrack.uri) {
      await this.playTrack(nextTrack.uri, this.currentTrackIndex);
    } else {
      throw new Error("Invalid track data");
    }
  }

  async playPreviousTrack(): Promise<void> {
    if (this.currentSearchResults.length === 0) {
      throw new Error("No tracks available");
    }
    
    if (this.currentTrackIndex <= 0) {
      throw new Error("Already at the first track");
    }

    this.currentTrackIndex--;
    const prevTrack = this.currentSearchResults[this.currentTrackIndex];
    
    if (prevTrack && prevTrack.uri) {
      await this.playTrack(prevTrack.uri, this.currentTrackIndex);
    } else {
      throw new Error("Invalid track data");
    }
  }

  async seekToPosition(positionMs: number): Promise<void> {
    if (!this.deviceId) return;

    try {
      await SpotifyApiService.seekToPosition(positionMs);
    } catch (error) {
      console.error('Seek error:', error);
    }
  }

  setSearchResults(tracks: SpotifyTrack[]): void {
    this.currentSearchResults = tracks;
    this.currentTrackIndex = 0;
  }

  getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
  }

  isReady(): boolean {
    return this.player !== null && this.deviceId !== null;
  }

  // Play from queue context
  async playFromQueue(trackUris: string[], startIndex: number = 0): Promise<boolean> {
    try {
      if (trackUris.length === 0) {
        throw new Error("No tracks in queue");
      }

      if (startIndex >= trackUris.length) {
        throw new Error("Invalid start index");
      }

      const startUri = trackUris[startIndex];
      return await this.playTrack(startUri, startIndex);
    } catch (error) {
      console.error('Failed to play from queue:', error);
      throw error;
    }
  }
}
