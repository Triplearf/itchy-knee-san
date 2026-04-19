import Navbar from '../components/Navbar'
import Image from 'next/image'
import InteractiveBackground from '../components/InteractiveBackground'
import facebook from '../public/facebook.svg'
import instagram from '../public/instagram.svg'
import github from '../public/github.svg'

import { getRecentTracks } from '@/lib/lastfm'
import SpotifyWidget from '@/components/SpotifyWidget'

import DrawingWidget from '@/components/DrawingWidget'

export default async function Page() {
  const recentTrack = await getRecentTracks();

  return (
    <main>
      {/* Section 1 */}
      <InteractiveBackground></InteractiveBackground>
      <div className="min-h-screen flex flex-col items-center justify-center gap-12">
        <div className='shadow-hard-br5 shadow-taupe-800 select-none bg-[#faf8f5] px-11 py-6 border-2 border-deep-mocha-900'>
          {/* Name drop */}
          <h1 className='text-9xl text-deep-mocha-900 text-shadow-hard-br4 shadow-[#E5C684] tracking-wider font-bold'>
            arf
          </h1>
    
          {/* Short description */}
          <p className='text-1xl text-deep-mocha-900 flex gap-2.5 justify-center shadow-amber-50'>
            <span className='transition hover:scale-110'>He/Any</span>
            <span>|</span>
            <span className='transition hover:scale-110'>19</span>
            <span>|</span>
            <span className='transition hover:scale-110'>Trying</span>
          </p>

          {/* Self-promo links w icons */}
          <div className='flex justify-center grid-cols-3 gap-5 pt-6'>
            <a href='https://www.facebook.com/arfarf.37910' target='_blank' rel="noopener noreferrer">
              <Image src={facebook} alt='Facebook' width={20} height={20}
              className='transition hover:scale-125'></Image>
            </a>
            <a href='https://www.instagram.com/barkbarkwoof70/' target='_blank' rel="noopener noreferrer">
              <Image src={instagram} alt='Facebook' width={20} height={20}
              className='transition hover:scale-125'></Image>
            </a>
            <a href='https://github.com/Triplearf' target='_blank' rel="noopener noreferrer">
              <Image src={github} alt='Facebook' width={20} height={20}
              className='transition hover:scale-125'></Image>
            </a>
          </div>
        </div>

        {/* Listening to */}
        <div className='grid grid-cols-2 gap-x-11 min-w-[50vw] shadow-hard-br5 shadow-taupe-800 select-none bg-[#faf8f5] px-11 pt-8 pb-6 border-2 border-deep-mocha-900'>
          <div className='flex items-center col-span-2 pb-4'>
            <h2 className='text-3xl text-deep-mocha-900 text-shadow-hard-br4 shadow-[#E5C684] tracking-wider font-bold'>
              Now Listening To:
            </h2>
          </div>

          {/* <div className='flex items-center col-span-2 pb-4'>
            <SpotifyWidget track={recentTrack}></SpotifyWidget>
          </div> */}
          
          <div className="bg-[#1E1E1E] w-full flex shadow-hard-br5 shadow-[#E5C684] px-0.5"> 
            <iframe 
              data-testid="embed-iframe" 
              src="https://open.spotify.com/embed/track/0IjdXwCEhZR7JIwq6Za8j5?utm_source=generator&theme=0"
              className="w-full"
              height="152" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>

          <div className="bg-[#1E1E1E] w-full flex shadow-hard-br5 shadow-[#E5C684] px-0.5"> 
            <iframe 
              data-testid="embed-iframe" 
              src="https://open.spotify.com/embed/track/11zLS4m2YVm0iy2uCGqEq5?utm_source=generator&theme=0" 
              className="w-full"
              height="152" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className='border-t-2 border-deep-mocha-800 h-[75vh] bg-[#faf8f5] flex items-center justify-center select-none'>
        <div className='select-text'>
          <p>
            Todo list basically <br></br>
            Things in brackets are planned <br></br>
            <br></br>

            1. Initial set up and making ripple effect
            <br></br>
            2. Improved ripple effect and made a function to autp click
            <br></br>
            3. Added self promo links w icons
            <br></br>
            4. Add the spaces for "Currently listening to"
            <br></br>
            5. [Add failsafe for if the viewport/screen is too big, dont draw the dots cuz lag], [Find a better color for the 2nd section in homepage]
          </p>
        </div>
      </div>

      {/* Section 3 */}
      <div className='border-t-2 border-[#868686] min-h-screen'>
        <DrawingWidget></DrawingWidget>
      </div>
    </main>
  )
}