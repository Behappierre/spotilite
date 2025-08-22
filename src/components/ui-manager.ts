import { SpotifyProfile, SpotifySearchResponse } from '../types/spotify';

export class UIManager {
  private authArea: HTMLElement;
  private notice: HTMLElement;
  private results: HTMLElement;
  private empty: HTMLElement;
  private typePills: HTMLElement;
  private selectedTypes: Set<string> = new Set(["track", "artist"]);

  constructor() {
    this.authArea = document.getElementById("authArea")!;
    this.notice = document.getElementById("notice")!;
    this.results = document.getElementById("results")!;
    this.empty = document.getElementById("empty")!;
    this.typePills = document.getElementById("typePills")!;
    
    this.initializeTypePills();
  }

  private initializeTypePills(): void {
    const types = ["track", "artist", "album", "playlist"];
    types.forEach(type => {
      const pill = this.createTypePill(type);
      this.typePills.appendChild(pill);
    });
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
      const div = document.createElement("div");
      div.className = "item";
      
      // Debug: Log the item structure for tracks
      if (kind === "track") {
        console.log("Track item structure:", {
          name: item.name,
          album: item.album,
          albumImages: item.album?.images,
          hasImages: !!item.images,
          images: item.images
        });
      }
      
      const imgSrc = this.getCardImage(item, kind);
      const link = (item.external_urls && item.external_urls.spotify) || "#";
      
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
              `<button class="btn-play" data-uri="${item.uri}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Play Full
              </button>` : ''
            }
            <a class="open" href="${link}" target="_blank" rel="noopener">
              Open in Spotify
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3Zm5 14v2H5V5h2v12h12Z"/>
              </svg>
            </a>
          </div>
        </div>`;

      // Add click handler for play button
      const playBtn = div.querySelector('.btn-play') as HTMLButtonElement;
      if (playBtn) {
        playBtn.onclick = () => {
          const uri = playBtn.dataset.uri;
          if (uri) {
            window.dispatchEvent(new CustomEvent('play-track', { detail: { uri } }));
          }
        };
      }

      blocks.push(div);
    });
  }

  private getCardImage(item: any, kind: string): string {
    if (kind === "track") {
      // For tracks, get image from album
      if (item.album?.images && item.album.images.length > 0) {
        // Use middle-sized image (index 1) if available, otherwise first
        const imageIndex = item.album.images.length > 1 ? 1 : 0;
        const imageUrl = item.album.images[imageIndex].url;
        console.log(`Track "${item.name}" - Album: "${item.album.name}", Image: ${imageUrl}`);
        return imageUrl;
      }
      console.log(`Track "${item.name}" - No album images found`);
      return "";
    }
    
    // For other types (artist, album, playlist), use their own images
    if (item.images && item.images.length > 0) {
      // Use middle-sized image (index 1) if available, otherwise first
      const imageIndex = item.images.length > 1 ? 1 : 0;
      const imageUrl = item.images[imageIndex].url;
      console.log(`${kind.charAt(0).toUpperCase() + kind.slice(1)} "${item.name}" - Image: ${imageUrl}`);
      return imageUrl;
    }
    
    console.log(`${kind.charAt(0).toUpperCase() + kind.slice(1)} "${item.name}" - No images found`);
    return "";
  }

  private getSubtitle(item: any, kind: string): string {
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
    return (artists || []).map((a: any) => a.name).join(", ");
  }

  private escapeHtml(s: string): string {
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
  }
}
