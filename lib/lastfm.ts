const API_KEY = process.env.LASTFM_API_KEY;
const USERNAME = process.env.LASTFM_USERNAME;

export interface Track {
  song: string;
  artist: string;
  album: string;
  image: string;
  url: string;
  isPlaying: boolean;
}

// 2. Add : Promise<Track | null> to the function
export async function getRecentTracks(): Promise<Track | null> {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`;

    try {
        const response = await fetch( url, {
            next: {revalidate: 10},
        });

        if (!response.ok) {
            throw new Error('Filed to fetch Last.fm data')
        }

        const data = await response.json();
        const tracks = data.recenttracks?.track;

        if (!tracks || tracks.length === 0) {
            return null;
        }

        const latestTrack = tracks[0]
        const isPlaying = latestTrack['@attr']?.nowplaying === 'true';

        return {
            song: latestTrack.name,
            artist: latestTrack.artist['#text'],
            album: latestTrack.album['#text'],
            image: latestTrack.image[3]['#text'], 
            url: latestTrack.url,
            isPlaying,
        }
    } catch (error) {
        console.error('Error fetching Last.fm: ', error);
        return null;
    }
}