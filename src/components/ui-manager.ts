import { SpotifyProfile, SpotifySearchResponse } from '../types/spotify';
import { QueuedTrack } from '../services/queue-manager';

export class UIManager {
  private authArea: HTMLElement;
  private notice: HTMLElement;
  private results: HTMLElement;
  private empty: HTMLElement;
  private typePills: HTMLElement;
  private selectedTypes: Set<string> = new Set(["track", "artist"]);
  private queueContainer: HTMLElement;
  private nowPlayingContainer: HTMLElement;
  private userInputContainer: HTMLElement;

  constructor() {
    this.authArea = document.getElementById("authArea")!;
    this.notice = document.getElementById("notice")!;
    this.results = document.getElementById("results")!;
    this.empty = document.getElementById("empty")!;
    this.typePills = document.getElementById("typePills")!;
    this.queueContainer = document.getElementById("queueContainer")!;
    this.nowPlayingContainer = document.getElementById("nowPlayingContainer")!;
    this.userInputContainer = document.getElementById("userInputContainer")!;
    
    this.initializeTypePills();
    this.initializeJukeboxUI();
  }

  private initializeTypePills(): void {
    const types = ["track", "artist", "album", "playlist"];
    types.forEach(type => {
      const pill = this.createTypePill(type);
      this.typePills.appendChild(pill);
    });
  }

  private initializeJukeboxUI(): void {
    // Initialize user input interface
    this.setupUserInput();
    
    // Initialize now playing display
    this.updateNowPlaying(null);
    
    // Initialize queue display
    this.updateQueueDisplay([]);
  }

  private setupUserInput(): void {
    if (!this.userInputContainer) return;
    
    this.userInputContainer.innerHTML = `
      <div class="user-input-section">
        <h3>🎵 Welcome to SpotiLite Jukebox!</h3>
        <div class="user-input-form">
          <input type="text" id="usernameInput" placeholder="Enter your name" class="username-input" maxlength="20">
          <button id="setUsernameBtn" class="btn btn-large">Start Adding Songs</button>
        </div>
        <div id="userStatus" class="user-status" style="display: none;">
          <span>Logged in as: <strong id="currentUsername"></strong></span>
          <button id="changeUserBtn" class="btn btn-secondary btn-small">Change User</button>
        </div>
      </div>
    `;

    // Add event listeners
    const setUsernameBtn = document.getElementById('setUsernameBtn');
    const usernameInput = document.getElementById('usernameInput') as HTMLInputElement;
    const changeUserBtn = document.getElementById('changeUserBtn');

    if (setUsernameBtn) {
      setUsernameBtn.onclick = () => {
        const username = usernameInput.value.trim();
        if (username) {
          window.dispatchEvent(new CustomEvent('set-username', { detail: { username } }));
        }
      };
    }

    if (changeUserBtn) {
      changeUserBtn.onclick = () => {
        window.dispatchEvent(new CustomEvent('change-user'));
      };
    }

    // Enter key support
    if (usernameInput) {
      usernameInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
          const username = usernameInput.value.trim();
          if (username) {
            window.dispatchEvent(new CustomEvent('set-username', { detail: { username } }));
          }
        }
      };
    }
  }

  private createTypePill(label: string): HTMLElement {
    const el = document.createElement("button");
    el.className = "pill" + (this.selectedTypes.has(label) ? " active" : "");
    el.textContent = label;
    el.onclick = () => {
      if (this.selectedTypes.has(label)) {
        this.selectedTypes.delete(label);
      } else {
        this.selectedTypes.add(label);
      }
      el.classList.toggle("active");
    };
    return el;
  }

  setAuthUI(profile: SpotifyProfile | null): void {
    this.authArea.innerHTML = "";
    
    if (!profile) {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = "Log in with Spotify";
      btn.onclick = () => {
        // This will be handled by the main app
        window.dispatchEvent(new CustomEvent('spotify-login'));
      };
      this.authArea.appendChild(btn);
    } else {
      const avatar = document.createElement("img");
      avatar.className = "avatar";
      avatar.src = profile?.images?.[0]?.url || "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
      
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = profile.display_name || profile.id;
      
      const out = document.createElement("button");
      out.className = "btn secondary";
      out.textContent = "Log out";
      out.onclick = () => {
        window.dispatchEvent(new CustomEvent('spotify-logout'));
      };
      
      this.authArea.append(avatar, tag, out);
    }
  }

  renderSearchResults(payload: SpotifySearchResponse): void {
    this.results.innerHTML = "";
    const blocks: HTMLElement[] = [];

    if (payload.tracks) {
      this.addItems(payload.tracks.items, "track", blocks);
    }
    if (payload.artists) {
      this.addItems(payload.artists.items, "artist", blocks);
    }
    if (payload.albums) {
      this.addItems(payload.albums.items, "album", blocks);
    }
    if (payload.playlists) {
      this.addItems(payload.playlists.items, "playlist", blocks);
    }

    if (!blocks.length) {
      this.empty.style.display = "block";
      this.results.innerHTML = "";
    } else {
      this.empty.style.display = "none";
      blocks.forEach(b => this.results.appendChild(b));
    }
  }

  private addItems(items: any[], kind: string, blocks: HTMLElement[]): void {
    items.forEach(item => {
      // Safety check for null/undefined items
      if (!item || typeof item !== 'object' || !item.name) {
        console.warn(`Skipping invalid ${kind} item:`, item);
        return;
      }

      const div = document.createElement("div");
      div.className = "item";
      
      // Debug: Log the item structure for tracks
      if (kind === "track") {
        console.log("Track item structure:", {
          name: item.name,
          album: item.album,
          albumImages: item.album?.images,
          hasImages: !!(item.images && Array.isArray(item.images)),
          images: item.images
        });
      }
      
      const imgSrc = this.getCardImage(item, kind);
      const link = (item?.external_urls?.spotify) || "#";
      
      // Debug: Log the final image source
      console.log(`${kind} "${item.name}" - Final image source:`, imgSrc);

      div.innerHTML = `
        ${imgSrc ? `<img class="cover" src="${imgSrc}" alt="">` : `<div class="cover" style="display:flex;align-items:center;justify-content:center;color:#8fa0b3;font-size:24px;">🎵</div>`}
        <div class="meta">
          <div class="row" style="justify-content:space-between;">
            <span class="pill" style="border-color:#1db95433;background:#0f1b12;color:#bfead0;">${kind}</span>
            ${kind === "track" ? `<span class="sub">${Math.round(item.popularity)||0}★</span>` : ""}
          </div>
          <div class="name">${this.escapeHtml(item.name)}</div>
          <div class="sub">${this.getSubtitle(item, kind)}</div>
          <div class="row" style="margin-top:6px; gap:8px;">
            ${kind === "track" ? 
              `<button class="btn-add-queue" data-track-id="${item.id}" data-track-name="${this.escapeHtml(item.name)}" data-track-artist="${this.escapeHtml(this.formatArtists(item.artists))}" data-track-uri="${item.uri}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Add to Queue
              </button>` : 
              `<button class="btn-view-tracks" data-item-id="${item.id}" data-item-type="${kind}" data-item-name="${this.escapeHtml(item.name)}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                View Tracks
              </button>`
            }
            <a class="open" href="${link}" target="_blank" rel="noopener">
              Open in Spotify
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3Zm5 14v2H5V5h2v12h12Z"/>
              </svg>
            </a>
          </div>
        </div>`;

      // Add click handler for add to queue button
      const addQueueBtn = div.querySelector('.btn-add-queue') as HTMLButtonElement;
      if (addQueueBtn) {
        addQueueBtn.onclick = () => {
          const trackId = addQueueBtn.dataset.trackId;
          const trackName = addQueueBtn.dataset.trackName;
          const trackArtist = addQueueBtn.dataset.trackArtist;
          const trackUri = addQueueBtn.dataset.trackUri;
          
          if (trackId && trackName && trackArtist && trackUri) {
            window.dispatchEvent(new CustomEvent('add-to-queue', { 
              detail: { 
                trackId, 
                trackName, 
                trackArtist, 
                trackUri,
                track: item
              } 
            }));
          }
        };
      }

      // Add click handler for view tracks button
      const viewTracksBtn = div.querySelector('.btn-view-tracks') as HTMLButtonElement;
      if (viewTracksBtn) {
        viewTracksBtn.onclick = () => {
          const itemId = viewTracksBtn.dataset.itemId;
          const itemType = viewTracksBtn.dataset.itemType;
          const itemName = viewTracksBtn.dataset.itemName;
          
          if (itemId && itemType && itemName) {
            window.dispatchEvent(new CustomEvent('view-tracks', { 
              detail: { 
                itemId, 
                itemType, 
                itemName,
                item: item
              } 
            }));
          }
        };
      }

      blocks.push(div);
    });
  }

  private getCardImage(item: any, kind: string): string {
    // Safety check for null item
    if (!item) {
      console.log(`getCardImage called with null item for kind: ${kind}`);
      return "";
    }

    if (kind === "track") {
      // For tracks, get image from album
      if (item.album && item.album.images && Array.isArray(item.album.images) && item.album.images.length > 0) {
        try {
          // Use middle-sized image (index 1) if available, otherwise first
          const imageIndex = item.album.images.length > 1 ? 1 : 0;
          const imageUrl = item.album.images[imageIndex]?.url;
          if (imageUrl) {
            console.log(`Track "${item.name}" - Album: "${item.album.name}", Image: ${imageUrl}`);
            return imageUrl;
          }
        } catch (error) {
          console.error(`Error getting track image for "${item.name}":`, error);
        }
      }
      console.log(`Track "${item.name}" - No album images found`);
      return "";
    }
    
    // For other types (artist, album, playlist), use their own images
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      try {
        // Use middle-sized image (index 1) if available, otherwise first
        const imageIndex = item.images.length > 1 ? 1 : 0;
        const imageUrl = item.images[imageIndex]?.url;
        if (imageUrl) {
          console.log(`${kind.charAt(0).toUpperCase() + kind.slice(1)} "${item.name}" - Image: ${imageUrl}`);
          return imageUrl;
        }
      } catch (error) {
        console.error(`Error getting ${kind} image for "${item.name}":`, error);
      }
    }
    
    console.log(`${kind.charAt(0).toUpperCase() + kind.slice(1)} "${item.name}" - No images found`);
    return "";
  }

  private getSubtitle(item: any, kind: string): string {
    if (!item) return "";
    
    switch (kind) {
      case "track":
        return `${this.formatArtists(item.artists)} · ${item.album?.name || ""}`;
      case "album":
        return this.formatArtists(item.artists);
      case "playlist":
        return `${item.tracks?.total || 0} tracks`;
      case "artist":
        return item.followers && item.followers.total 
          ? new Intl.NumberFormat().format(item.followers.total) + " followers"
          : "";
      default:
        return "";
    }
  }

  private formatArtists(artists: any[]): string {
    if (!artists || !Array.isArray(artists)) {
      return "";
    }
    return artists.map((a: any) => a?.name || "Unknown Artist").join(", ");
  }

  private escapeHtml(s: string): string {
    if (!s || typeof s !== 'string') {
      return '';
    }
    return s.replace(/[&<>'"]/g, (c: string) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[c] || c));
  }

  setNotice(message: string): void {
    this.notice.textContent = message;
  }

  getSelectedTypes(): string[] {
    return Array.from(this.selectedTypes);
  }

  // Update now playing display
  updateNowPlaying(queuedTrack: QueuedTrack | null): void {
    if (!this.nowPlayingContainer) return;

    if (queuedTrack) {
      const track = queuedTrack.track;
      this.nowPlayingContainer.innerHTML = `
        <div class="now-playing-card">
          <div class="now-playing-artwork">
            <img src="${this.getCardImage(track, 'track')}" alt="${track.name}" class="now-playing-image">
          </div>
          <div class="now-playing-info">
            <h2 class="now-playing-title">${this.escapeHtml(track.name)}</h2>
            <p class="now-playing-artist">${this.formatArtists(track.artists)}</p>
            <p class="now-playing-album">${track.album?.name || ''}</p>
            <p class="now-playing-user">Added by: <strong>${queuedTrack.addedBy}</strong></p>
          </div>
        </div>
      `;
    } else {
      this.nowPlayingContainer.innerHTML = `
        <div class="now-playing-card empty">
          <div class="now-playing-placeholder">
            <span class="music-icon">🎵</span>
            <h3>No track currently playing</h3>
            <p>Search for songs and add them to the queue to get started!</p>
          </div>
        </div>
      `;
    }
  }

  // Update queue display
  updateQueueDisplay(queue: QueuedTrack[]): void {
    if (!this.queueContainer) return;

    if (queue.length === 0) {
      this.queueContainer.innerHTML = `
        <div class="queue-empty">
          <span class="queue-icon">📋</span>
          <h3>Queue is empty</h3>
          <p>Search for songs and add them to start building your playlist!</p>
        </div>
      `;
      return;
    }

    const queueItems = queue.map((queuedTrack, index) => {
      const track = queuedTrack.track;
      const estimatedTime = queuedTrack.estimatedStartTime;
      const timeString = estimatedTime ? this.formatTimeUntil(estimatedTime) : '';
      
      return `
        <div class="queue-item" data-track-id="${queuedTrack.id}">
          <div class="queue-item-artwork">
            <img src="${this.getCardImage(track, 'track')}" alt="${track.name}" class="queue-image">
          </div>
          <div class="queue-item-info">
            <h4 class="queue-item-title">${this.escapeHtml(track.name)}</h4>
            <p class="queue-item-artist">${this.formatArtists(track.artists)}</p>
            <p class="queue-item-user">Added by: <strong>${queuedTrack.addedBy}</strong></p>
            ${timeString ? `<p class="queue-item-time">⏰ ${timeString}</p>` : ''}
          </div>
          <div class="queue-item-actions">
            <button class="btn-remove-queue" data-track-id="${queuedTrack.id}" title="Remove from queue">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    this.queueContainer.innerHTML = `
      <div class="queue-header">
        <h3>📋 Up Next (${queue.length} songs)</h3>
      </div>
      <div class="queue-list">
        ${queueItems}
      </div>
    `;

    // Add event listeners for remove buttons
    this.queueContainer.querySelectorAll('.btn-remove-queue').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const trackId = (e.currentTarget as HTMLElement).dataset.trackId;
        if (trackId) {
          window.dispatchEvent(new CustomEvent('remove-from-queue', { detail: { trackId } }));
        }
      });
    });
  }

  // Update user status display
  updateUserStatus(username: string | null): void {
    const userStatus = document.getElementById('userStatus');
    const currentUsername = document.getElementById('currentUsername');
    const userInputForm = document.querySelector('.user-input-form') as HTMLElement;

    if (username) {
      if (userStatus) userStatus.style.display = 'block';
      if (currentUsername) currentUsername.textContent = username;
      if (userInputForm) userInputForm.style.display = 'none';
    } else {
      if (userStatus) userStatus.style.display = 'none';
      if (userInputForm) userInputForm.style.display = 'block';
    }
  }

  // Format time until estimated start
  private formatTimeUntil(targetTime: Date): string {
    const now = new Date();
    const diffMs = targetTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Starting soon';
    if (diffMins < 60) return `In ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    return `In ${diffHours}h ${remainingMins}m`;
  }

  updatePlaybackUI(state: any): void {
    if (state.track_window.current_track) {
      const track = state.track_window.current_track;
      
      const titleEl = document.getElementById('nowPlayingTitle');
      const artistEl = document.getElementById('nowPlayingArtist');
      const audioPlayer = document.getElementById('audioPlayer');
      const playBtn = document.getElementById('playPauseBtn');
      
      if (titleEl) titleEl.textContent = track.name;
      if (artistEl) artistEl.textContent = track.artists.map((a: any) => a.name).join(', ');
      if (audioPlayer) audioPlayer.classList.add('active');
      
      // Update progress
      if (state.position && state.duration) {
        this.updateProgressBar(state.position, state.duration);
      }
      
      // Update play/pause button
      if (playBtn) {
        if (state.paused) {
          playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
          playBtn.title = 'Play';
        } else {
          playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
          playBtn.title = 'Pause';
        }
      }

      // Also update jukebox controls
      this.updateJukeboxControls(state.paused ? 'play' : 'pause');
    }
  }

  updateProgressBar(position: number, duration: number): void {
    if (position && duration) {
      const progress = (position / duration) * 100;
      const progressFill = document.getElementById('progressFill');
      if (progressFill) {
        progressFill.style.width = progress + '%';
      }
    }
  }

  resetPlaybackUI(): void {
    const audioPlayer = document.getElementById('audioPlayer');
    const titleEl = document.getElementById('nowPlayingTitle');
    const artistEl = document.getElementById('nowPlayingArtist');
    const progressFill = document.getElementById('progressFill');
    const playBtn = document.getElementById('playPauseBtn');
    
    if (audioPlayer) audioPlayer.classList.remove('active');
    if (titleEl) titleEl.textContent = 'No track playing';
    if (artistEl) artistEl.textContent = '';
    if (progressFill) progressFill.style.width = '0%';
    
    if (playBtn) {
      playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      playBtn.title = 'Play';
    }

    // Also update jukebox controls
    this.updateJukeboxControls('play');
  }

  // Update jukebox controls state
  private updateJukeboxControls(state: 'play' | 'pause'): void {
    const jukeboxPlayPauseBtn = document.getElementById('jukeboxPlayPauseBtn');
    if (!jukeboxPlayPauseBtn) return;

    if (state === 'play') {
      jukeboxPlayPauseBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
      jukeboxPlayPauseBtn.title = 'Play';
    } else {
      jukeboxPlayPauseBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      jukeboxPlayPauseBtn.title = 'Pause';
    }
  }

  // Display tracks from a specific item (playlist, album, artist) with back navigation
  displayTracksFromItem(tracks: any[], itemType: string, itemName: string, originalItem: any): void {
    if (!this.results) return;

    // Create back button
    const backButton = document.createElement('div');
    backButton.className = 'back-to-search';
    backButton.innerHTML = `
      <button class="btn-back" onclick="window.location.reload()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Search
      </button>
      <h2 class="tracks-header">${itemType.charAt(0).toUpperCase() + itemType.slice(1)}: ${this.escapeHtml(itemName)}</h2>
      <p class="tracks-subtitle">${tracks.length} tracks found</p>
    `;

    // Clear current results and add back button
    this.results.innerHTML = '';
    this.results.appendChild(backButton);

    // Display tracks
    const blocks: HTMLElement[] = [];
    this.addItems(tracks, 'track', blocks);
    
    if (blocks.length > 0) {
      blocks.forEach(b => this.results.appendChild(b));
    } else {
      this.results.innerHTML += '<div class="empty">No tracks found.</div>';
    }
  }
}
