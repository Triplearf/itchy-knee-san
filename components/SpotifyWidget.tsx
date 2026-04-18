import { Track } from '@/lib/lastfm';

export default function SpotifyWidget({ track }: { track: Track | null }) {
  if (!track) {
    return (
      <div>
        No song rn sorry
      </div>
    )
  }

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex items-center gap-4 p-4 rounded-xl bg-[#181818] text-white max-w-sm border border-[#282828] hover:bg-[#282828] transition-colors duration-300"
    >
      <img
        src={track.image}
        alt={`${track.album} by ${track.artist}`}>
      </img>
    </a>
  )
}