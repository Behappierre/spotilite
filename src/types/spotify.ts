export interface SpotifyToken {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at: number;
}

export interface SpotifyProfile {
  id: string;
  display_name: string;
  images?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  followers?: {
    total: number;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  artists: SpotifyArtist[];
}

export interface SpotifyTrack {
  id: string;
  uri: string;
  name: string;
  popularity: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls?: {
    spotify: string;
  };
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  images?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  tracks?: {
    total: number;
  };
  external_urls?: {
    spotify: string;
  };
}

export interface SpotifySearchResponse {
  tracks?: {
    items: SpotifyTrack[];
  };
  artists?: {
    items: SpotifyArtist[];
  };
  albums?: {
    items: SpotifyAlbum[];
  };
  playlists?: {
    items: SpotifyPlaylist[];
  };
}

export interface SpotifyPlayerState {
  position: number;
  duration: number;
  paused: boolean;
  track_window: {
    current_track: {
      name: string;
      artists: Array<{ name: string }>;
    };
  };
}
