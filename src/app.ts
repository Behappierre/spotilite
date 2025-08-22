import { SpotifyAuthService } from './services/spotify-auth';
import { SpotifyApiService } from './services/spotify-api';
import { SpotifyPlayerService } from './services/spotify-player';
import { UIManager } from './components/ui-manager';
import { QueueManager } from './services/queue-manager';
import { UserManager } from './services/user-manager';
import { SpotifyTrack } from './types/spotify';

export class SpotiLiteApp {
  private ui: UIManager;
  private player: SpotifyPlayerService;
  private queueManager: QueueManager;
  private userManager: UserManager;
  private currentSearchResults: SpotifyTrack[] = [];

  constructor() {
    this.ui = new UIManager();
    this.player = new SpotifyPlayerService();
    this.queueManager = new QueueManager();
    this.userManager = new UserManager();
    
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

          // Volume controls
          const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;
          const muteBtn = document.getElementById('muteBtn');
          const volumeLevel = document.getElementById('volumeLevel');

          if (volumeSlider) {
            volumeSlider.oninput = (e) => this.handleVolumeChange(e);
          }

          if (muteBtn) {
            muteBtn.onclick = () => this.handleMuteToggle();
          }

          // Initialize volume display
          if (volumeLevel) {
            volumeLevel.textContent = volumeSlider?.value + '%' || '50%';
          }

          // Jukebox controls
          const jukeboxPrevBtn = document.getElementById('jukeboxPrevBtn');
          const jukeboxPlayPauseBtn = document.getElementById('jukeboxPlayPauseBtn');
          const jukeboxNextBtn = document.getElementById('jukeboxNextBtn');
          const jukeboxStopBtn = document.getElementById('jukeboxStopBtn');
          const jukeboxVolumeSlider = document.getElementById('jukeboxVolumeSlider') as HTMLInputElement;
          const jukeboxMuteBtn = document.getElementById('jukeboxMuteBtn');

          if (jukeboxPrevBtn) {
            jukeboxPrevBtn.onclick = () => this.handlePreviousTrack();
          }

          if (jukeboxPlayPauseBtn) {
            jukeboxPlayPauseBtn.onclick = () => this.handleTogglePlayback();
          }

          if (jukeboxNextBtn) {
            jukeboxNextBtn.onclick = () => this.handleNextTrack();
          }

          if (jukeboxStopBtn) {
            jukeboxStopBtn.onclick = () => this.handleStopPlayback();
          }

          if (jukeboxVolumeSlider) {
            jukeboxVolumeSlider.oninput = (e) => this.handleJukeboxVolumeChange(e);
          }

          if (jukeboxMuteBtn) {
            jukeboxMuteBtn.onclick = () => this.handleJukeboxMuteToggle();
          }

              // Custom events
          window.addEventListener('spotify-login', () => this.handleLogin());
          window.addEventListener('spotify-logout', () => this.handleLogout());
          window.addEventListener('play-track', (e: any) => this.handlePlayTrack(e.detail.uri));
          
          // Jukebox events
          window.addEventListener('set-username', (e: any) => this.handleSetUsername(e.detail.username));
          window.addEventListener('change-user', () => this.handleChangeUser());
          window.addEventListener('add-to-queue', (e: any) => this.handleAddToQueue(e.detail));
          window.addEventListener('remove-from-queue', (e: any) => this.handleRemoveFromQueue(e.detail.trackId));

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

          // Initialize jukebox UI
          this.updateQueueDisplay();
          this.updateNowPlaying();
          
          // Update user status if user is already set
          if (this.userManager.isUserSet()) {
            this.ui.updateUserStatus(this.userManager.getCurrentUser());
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
      // Check if we have a queue and should start playing from it
      const queue = this.queueManager.getQueue();
      const currentTrack = this.queueManager.getCurrentTrack();
      
      if (queue.length > 0 && !currentTrack) {
        // Start playing from queue
        const trackUris = this.queueManager.getQueueAsTrackList();
        const success = await this.player.playFromQueue(trackUris, 0);
        
        if (success) {
          // Get the first track and set it as current
          const firstTrack = queue[0];
          this.queueManager.getNextTrack(); // This removes it from queue and sets as current
          this.updateNowPlaying();
          this.updateQueueDisplay();
          this.ui.setNotice(`Now playing: ${firstTrack.track.name}`);
        } else {
          this.ui.setNotice("Failed to start queue playback");
        }
      } else if (currentTrack) {
        // Toggle playback of current track
        await this.player.togglePlayback();
      } else {
        this.ui.setNotice("No tracks in queue. Add some songs first!");
      }
    } catch (error: any) {
      this.ui.setNotice("Toggle error: " + error.message);
    }
  }

  private async handleStopPlayback(): Promise<void> {
    try {
      await this.player.stopPlayback();
      
      // Clear current track from queue manager
      this.queueManager.clearCurrentTrack();
      
      this.ui.resetPlaybackUI();
      this.updateNowPlaying();
      this.updateQueueDisplay();
    } catch (error: any) {
      this.ui.setNotice("Stop error: " + error.message);
    }
  }

  private async handleNextTrack(): Promise<void> {
    try {
      const queue = this.queueManager.getQueue();
      const currentTrack = this.queueManager.getCurrentTrack();
      
      if (queue.length > 0) {
        // Play next track from queue
        const nextTrack = this.queueManager.getNextTrack();
        if (nextTrack) {
          const success = await this.player.playTrack(nextTrack.track.uri, 0);
          if (success) {
            this.updateNowPlaying();
            this.updateQueueDisplay();
            this.ui.setNotice(`Now playing: ${nextTrack.track.name}`);
          } else {
            this.ui.setNotice("Failed to play next track");
          }
        } else {
          this.ui.setNotice("No more tracks in queue");
        }
      } else {
        // Fallback to search results
        await this.player.playNextTrack();
        const trackIndex = this.player.getCurrentTrackIndex();
        const track = this.currentSearchResults[trackIndex];
        if (track) {
          this.ui.setNotice(`Playing: ${track.name}`);
        }
      }
    } catch (error: any) {
      this.ui.setNotice(error.message);
    }
  }

  private async handlePreviousTrack(): Promise<void> {
    try {
      // For now, previous track in queue context would require more complex logic
      // We'll fall back to search results for now
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

  // Jukebox event handlers
  private handleSetUsername(username: string): void {
    this.userManager.setCurrentUser(username);
    this.ui.updateUserStatus(username);
    this.ui.setNotice(`Welcome, ${username}! You can now add songs to the queue.`);
    
    // Update queue display with current user info
    this.updateQueueDisplay();
  }

  private handleChangeUser(): void {
    this.userManager.clearCurrentUser();
    this.ui.updateUserStatus(null);
    this.ui.setNotice('User cleared. Please enter a new username to continue.');
  }

  private handleAddToQueue(detail: any): void {
    if (!this.userManager.isUserSet()) {
      this.ui.setNotice('Please enter your username first before adding songs to the queue.');
      return;
    }

    const username = this.userManager.getCurrentUser()!;
    const result = this.queueManager.addToQueue(detail.track, username);
    
    if (result.success) {
      this.ui.setNotice(result.message);
      this.updateQueueDisplay();
      this.updateNowPlaying();
    } else {
      this.ui.setNotice(result.message);
    }
  }

  private handleRemoveFromQueue(trackId: string): void {
    if (!this.userManager.isUserSet()) {
      this.ui.setNotice('Please enter your username first.');
      return;
    }

    const username = this.userManager.getCurrentUser()!;
    const result = this.queueManager.removeFromQueue(trackId, username);
    
    if (result.success) {
      this.ui.setNotice(result.message);
      this.updateQueueDisplay();
      this.updateNowPlaying();
    } else {
      this.ui.setNotice(result.message);
    }
  }

  // Update queue display
  private updateQueueDisplay(): void {
    const queue = this.queueManager.getQueueWithTimes();
    this.ui.updateQueueDisplay(queue);
  }

  // Update now playing display
  private updateNowPlaying(): void {
    const currentTrack = this.queueManager.getCurrentTrack();
    this.ui.updateNowPlaying(currentTrack);
  }

  // Volume control handlers
  private async handleVolumeChange(e: Event): Promise<void> {
    const target = e.target as HTMLInputElement;
    const volume = parseInt(target.value);
    
    // Update volume display
    const volumeLevel = document.getElementById('volumeLevel');
    if (volumeLevel) {
      volumeLevel.textContent = volume + '%';
    }

    // Update mute button state
    const muteBtn = document.getElementById('muteBtn');
    if (muteBtn) {
      if (volume === 0) {
        muteBtn.classList.add('muted');
        muteBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
      } else {
        muteBtn.classList.remove('muted');
        muteBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
      }
    }

    // Store volume preference
    localStorage.setItem('jukebox_volume', volume.toString());
    
    // Actually control Spotify volume
    try {
      await this.player.setVolume(volume);
      this.ui.setNotice(`Volume set to ${volume}%`);
    } catch (error: any) {
      this.ui.setNotice(`Volume control failed: ${error.message}`);
    }
  }

  private async handleMuteToggle(): Promise<void> {
    const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;
    const muteBtn = document.getElementById('muteBtn');
    
    if (!volumeSlider || !muteBtn) return;

    if (muteBtn.classList.contains('muted')) {
      // Unmute - restore previous volume
      const previousVolume = localStorage.getItem('jukebox_volume') || '50';
      volumeSlider.value = previousVolume;
      await this.handleVolumeChange({ target: volumeSlider } as Event);
    } else {
      // Mute - store current volume and set to 0
      localStorage.setItem('jukebox_volume', volumeSlider.value);
      volumeSlider.value = '0';
      await this.handleVolumeChange({ target: volumeSlider } as Event);
    }
  }

  // Jukebox volume control handlers
  private async handleJukeboxVolumeChange(e: Event): Promise<void> {
    const target = e.target as HTMLInputElement;
    const volume = parseInt(target.value);
    
    // Update both volume sliders
    const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;
    if (volumeSlider) {
      volumeSlider.value = volume.toString();
    }
    
    // Update mute button state
    const muteBtn = document.getElementById('muteBtn');
    const jukeboxMuteBtn = document.getElementById('jukeboxMuteBtn');
    
    if (volume === 0) {
      if (muteBtn) muteBtn.classList.add('muted');
      if (jukeboxMuteBtn) jukeboxMuteBtn.classList.add('muted');
    } else {
      if (muteBtn) muteBtn.classList.remove('muted');
      if (jukeboxMuteBtn) jukeboxMuteBtn.classList.remove('muted');
    }

    // Store volume preference
    localStorage.setItem('jukebox_volume', volume.toString());
    
    // Actually control Spotify volume
    try {
      await this.player.setVolume(volume);
      this.ui.setNotice(`Volume set to ${volume}%`);
    } catch (error: any) {
      this.ui.setNotice(`Volume control failed: ${error.message}`);
    }
  }

  private async handleJukeboxMuteToggle(): Promise<void> {
    const jukeboxVolumeSlider = document.getElementById('jukeboxVolumeSlider') as HTMLInputElement;
    const jukeboxMuteBtn = document.getElementById('jukeboxMuteBtn');
    
    if (!jukeboxVolumeSlider || !jukeboxMuteBtn) return;

    if (jukeboxMuteBtn.classList.contains('muted')) {
      // Unmute - restore previous volume
      const previousVolume = localStorage.getItem('jukebox_volume') || '50';
      jukeboxVolumeSlider.value = previousVolume;
      await this.handleJukeboxVolumeChange({ target: jukeboxVolumeSlider } as Event);
    } else {
      // Mute - store current volume and set to 0
      localStorage.setItem('jukebox_volume', jukeboxVolumeSlider.value);
      jukeboxVolumeSlider.value = '0';
      await this.handleJukeboxVolumeChange({ target: jukeboxVolumeSlider } as Event);
    }
  }
}
