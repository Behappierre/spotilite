export class UserManager {
  private currentUser: string | null = null;
  private readonly storageKey = 'jukebox_current_user';

  constructor() {
    this.loadUserFromStorage();
  }

  // Set current user
  setCurrentUser(username: string): void {
    this.currentUser = username.trim();
    this.saveUserToStorage();
  }

  // Get current user
  getCurrentUser(): string | null {
    return this.currentUser;
  }

  // Check if user is set
  isUserSet(): boolean {
    return this.currentUser !== null && this.currentUser.trim() !== '';
  }

  // Clear current user
  clearCurrentUser(): void {
    this.currentUser = null;
    this.saveUserToStorage();
  }

  // Get user display name (with fallback)
  getUserDisplayName(): string {
    return this.currentUser || 'Guest';
  }

  // Save user to localStorage
  private saveUserToStorage(): void {
    try {
      if (this.currentUser) {
        localStorage.setItem(this.storageKey, this.currentUser);
      } else {
        localStorage.removeItem(this.storageKey);
      }
    } catch (error) {
      console.error('Failed to save user to storage:', error);
    }
  }

  // Load user from localStorage
  private loadUserFromStorage(): void {
    try {
      const savedUser = localStorage.getItem(this.storageKey);
      if (savedUser && savedUser.trim() !== '') {
        this.currentUser = savedUser;
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
    }
  }
}
