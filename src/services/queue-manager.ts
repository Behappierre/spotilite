import { SpotifyTrack } from '../types/spotify';

export interface QueuedTrack {
  id: string;
  track: SpotifyTrack;
  addedBy: string;
  addedAt: Date;
  estimatedStartTime?: Date;
}

export class QueueManager {
  private queue: QueuedTrack[] = [];
  private currentTrack: QueuedTrack | null = null;
  private maxSongsPerUser = 3;
  private userSongs: Map<string, number> = new Map();

  constructor() {
    this.loadQueueFromStorage();
  }

  // Add a track to the queue
  addToQueue(track: SpotifyTrack, user: string): { success: boolean; message: string } {
    // Check if user has reached their song limit
    const userSongCount = this.userSongs.get(user) || 0;
    if (userSongCount >= this.maxSongsPerUser) {
      return {
        success: false,
        message: `You can only have ${this.maxSongsPerUser} songs in the queue. Please wait for your songs to play.`
      };
    }

    // Check if track is already in queue
    if (this.queue.some(qt => qt.track.uri === track.uri)) {
      return {
        success: false,
        message: 'This song is already in the queue.'
      };
    }

    // Add track to queue
    const queuedTrack: QueuedTrack = {
      id: this.generateId(),
      track,
      addedBy: user,
      addedAt: new Date()
    };

    this.queue.push(queuedTrack);
    this.userSongs.set(user, userSongCount + 1);
    this.saveQueueToStorage();
    this.updateEstimatedTimes();

    return {
      success: true,
      message: `"${track.name}" added to queue!`
    };
  }

  // Remove a track from queue (only if added by the same user)
  removeFromQueue(trackId: string, user: string): { success: boolean; message: string } {
    const index = this.queue.findIndex(qt => qt.id === trackId);
    if (index === -1) {
      return { success: false, message: 'Track not found in queue.' };
    }

    const queuedTrack = this.queue[index];
    if (queuedTrack.addedBy !== user) {
      return { success: false, message: 'You can only remove your own songs from the queue.' };
    }

    // Update user song count
    const userSongCount = this.userSongs.get(user) || 0;
    this.userSongs.set(user, Math.max(0, userSongCount - 1));

    // Remove from queue
    this.queue.splice(index, 1);
    this.saveQueueToStorage();
    this.updateEstimatedTimes();

    return {
      success: true,
      message: `"${queuedTrack.track.name}" removed from queue.`
    };
  }

  // Get next track from queue
  getNextTrack(): QueuedTrack | null {
    if (this.queue.length === 0) return null;
    
    const nextTrack = this.queue.shift()!;
    
    // Update user song count
    const userSongCount = this.userSongs.get(nextTrack.addedBy) || 0;
    this.userSongs.set(nextTrack.addedBy, Math.max(0, userSongCount - 1));
    
    this.currentTrack = nextTrack;
    this.saveQueueToStorage();
    this.updateEstimatedTimes();
    
    return nextTrack;
  }

  // Get all tracks in queue as a list for Spotify context
  getQueueAsTrackList(): string[] {
    return this.queue.map(qt => qt.track.uri);
  }

  // Get current track URI
  getCurrentTrackUri(): string | null {
    return this.currentTrack ? this.currentTrack.track.uri : null;
  }

  // Get current track
  getCurrentTrack(): QueuedTrack | null {
    return this.currentTrack;
  }

  // Get queue
  getQueue(): QueuedTrack[] {
    return this.queue;
  }

  // Get queue with estimated start times
  getQueueWithTimes(): QueuedTrack[] {
    return this.queue.map((track, index) => {
      if (index === 0) {
        // First in queue starts after current track
        const currentDuration = this.currentTrack ? 180 : 0; // Assume 3 min if no current track
        track.estimatedStartTime = new Date(Date.now() + currentDuration * 1000);
      } else {
        // Subsequent tracks start after previous ones
        const previousDuration = 180; // Assume 3 min per track
        const previousStartTime = this.queue[index - 1].estimatedStartTime || new Date();
        track.estimatedStartTime = new Date(previousStartTime.getTime() + previousDuration * 1000);
      }
      return track;
    });
  }

  // Clear queue (admin function)
  clearQueue(): void {
    this.queue = [];
    this.userSongs.clear();
    this.saveQueueToStorage();
  }

  // Clear current track
  clearCurrentTrack(): void {
    this.currentTrack = null;
    this.saveQueueToStorage();
  }

  // Get user's current song count
  getUserSongCount(user: string): number {
    return this.userSongs.get(user) || 0;
  }

  // Get user's remaining song allowance
  getUserRemainingSongs(user: string): number {
    return Math.max(0, this.maxSongsPerUser - this.getUserSongCount(user));
  }

  // Update estimated start times based on current playback
  private updateEstimatedTimes(): void {
    // This will be called when queue changes or playback state changes
    // Implementation depends on actual track duration from Spotify
  }

  // Generate unique ID for queued tracks
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Save queue to localStorage
  private saveQueueToStorage(): void {
    try {
      const queueData = {
        queue: this.queue,
        currentTrack: this.currentTrack,
        userSongs: Array.from(this.userSongs.entries())
      };
      localStorage.setItem('jukebox_queue', JSON.stringify(queueData));
    } catch (error) {
      console.error('Failed to save queue to storage:', error);
    }
  }

  // Load queue from localStorage
  private loadQueueFromStorage(): void {
    try {
      const queueData = localStorage.getItem('jukebox_queue');
      if (queueData) {
        const parsed = JSON.parse(queueData);
        this.queue = parsed.queue || [];
        this.currentTrack = parsed.currentTrack || null;
        this.userSongs = new Map(parsed.userSongs || []);
      }
    } catch (error) {
      console.error('Failed to load queue from storage:', error);
    }
  }
}
