import { SpotifyAuthService } from './services/spotify-auth';
import { SpotifyApiService } from './services/spotify-api';
import { SpotifyPlayerService } from './services/spotify-player';
import { UIManager } from './components/ui-manager';
import { SpotifyTrack } from './types/spotify';

export class SpotiLiteApp {
  private ui: UIManager;
  private player: SpotifyPlayerService;
  private currentSearchResults: SpotifyTrack[] = [];

  constructor() {
    this.ui = new UIManager();
    this.player = new SpotifyPlayerService();
    
    this.setupEventListeners();
    this.boot();
  }

  private setupEventListeners(): void {
    // Search form
    const form = document.getElementById("searchForm") as HTMLFormElement;
    if (form) {
      form.addEventListener("submit", (e) => this.handleSearch(e));
    }

    // Playback controls
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
      playPauseBtn.onclick = () => this.handleTogglePlayback();
    }

    const stopBtn = document.getElementById('stopBtn');
    if (stopBtn) {
      stopBtn.onclick = () => this.handleStopPlayback();
    }

    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.onclick = () => this.handleNextTrack();
    }

    const prevBtn = document.getElementById('prevBtn');
    if (prevBtn) {
      prevBtn.onclick = () => this.handlePreviousTrack();
    }

    // Progress bar
    const progressBar = document.querySelector('.progress-bar') as HTMLElement;
    if (progressBar) {
      progressBar.onclick = (e: MouseEvent) => this.handleSeek(e);
    }

    // Custom events
    window.addEventListener('spotify-login', () => this.handleLogin());
    window.addEventListener('spotify-logout', () => this.handleLogout());
    window.addEventListener('play-track', (e: any) => this.handlePlayTrack(e.detail.uri));

    // Player state changes
    this.player.setOnStateChange((state) => {
      this.ui.updatePlaybackUI(state);
    });
  }

  private async boot(): Promise<void> {
    // Handle redirect back with ?code=
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const expectedState = localStorage.getItem(SpotifyAuthService.getStateKey());

    if (code) {
      if (expectedState && state !== expectedState) {
        this.ui.setNotice("State mismatch; please try logging in again.");
        return;
      }
      
      try {
        await SpotifyAuthService.exchangeCodeForToken(code);
      } catch (e: any) {
        this.ui.setNotice("Login failed: " + e.message);
      }
    }

    // If logged in, fetch profile for header UI
    const token = await SpotifyAuthService.getAccessToken();
    if (token) {
      try {
        const me = await SpotifyApiService.getProfile();
        this.ui.setAuthUI(me);
      } catch {
        this.ui.setAuthUI(null);
      }
    } else {
      this.ui.setAuthUI(null);
    }
  }

  private async handleLogin(): Promise<void> {
    await SpotifyAuthService.login();
  }

  private async handleLogout(): Promise<void> {
    SpotifyAuthService.logout();
  }

  private async handleSearch(e: Event): Promise<void> {
    e.preventDefault();
    
    const input = document.getElementById("q") as HTMLInputElement;
    const query = input.value.trim();
    
    if (!query) return;

    try {
      const types = this.ui.getSelectedTypes();
      if (types.length === 0) {
        this.ui.setNotice("Select at least one type (e.g. track, artist).");
        return;
      }

      this.ui.setNotice("");
      const data = await SpotifyApiService.search(query, types);
      
      // Store track results for auto-play functionality
      this.currentSearchResults = data.tracks?.items || [];
      this.player.setSearchResults(this.currentSearchResults);
      
      this.ui.renderSearchResults(data);
    } catch (err: any) {
      this.ui.setNotice("Search error: " + err.message);
    }
  }

  private async handlePlayTrack(uri: string): Promise<void> {
    try {
      const success = await this.player.playTrack(uri);
      if (success) {
        this.ui.setNotice("Starting playback...");
      } else {
        this.ui.setNotice("Failed to start playback");
      }
    } catch (error: any) {
      this.ui.setNotice("Playback error: " + error.message);
    }
  }

  private async handleTogglePlayback(): Promise<void> {
    try {
      await this.player.togglePlayback();
    } catch (error: any) {
      this.ui.setNotice("Toggle error: " + error.message);
    }
  }

  private async handleStopPlayback(): Promise<void> {
    try {
      await this.player.stopPlayback();
      this.ui.resetPlaybackUI();
    } catch (error: any) {
      this.ui.setNotice("Stop error: " + error.message);
    }
  }

  private async handleNextTrack(): Promise<void> {
    try {
      await this.player.playNextTrack();
      const trackIndex = this.player.getCurrentTrackIndex();
      const track = this.currentSearchResults[trackIndex];
      if (track) {
        this.ui.setNotice(`Playing: ${track.name}`);
      }
    } catch (error: any) {
      this.ui.setNotice(error.message);
    }
  }

  private async handlePreviousTrack(): Promise<void> {
    try {
      await this.player.playPreviousTrack();
      const trackIndex = this.player.getCurrentTrackIndex();
      const track = this.currentSearchResults[trackIndex];
      if (track) {
        this.ui.setNotice(`Playing: ${track.name}`);
      }
    } catch (error: any) {
      this.ui.setNotice(error.message);
    }
  }

  private async handleSeek(e: MouseEvent): Promise<void> {
    const progressBar = e.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const seekPercentage = clickX / progressBarWidth;
    
    try {
      await this.player.seekToPosition(Math.floor(seekPercentage * 1000));
      
      // Update progress bar immediately for better UX
      const progressFill = document.getElementById('progressFill');
      if (progressFill) {
        progressFill.style.width = (seekPercentage * 100) + '%';
      }
    } catch (error: any) {
      console.error('Seek error:', error);
    }
  }
}
