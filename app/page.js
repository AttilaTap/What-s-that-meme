/* eslint-disable @next/next/no-img-element */
"use client";

import algoliasearch from "algoliasearch/lite";
import Link from "next/link";
import { useState } from "react";
import { InstantSearch, SearchBox } from "react-instantsearch";
import InfiniteHits from "./components/infiniteHits";

export default function Home() {
  const [isMessageVisible, setMessageVisible] = useState(true);
  const originalSearchClient = algoliasearch("W0VJU3M8Q7", "41486e21b0254ba83fa465a7bf0ead54");

  const searchClient = {
    ...originalSearchClient,
    search(requests) {
      if (requests.every(({ params }) => !params.query)) {
        return Promise.resolve({
          results: requests.map(() => ({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            processingTimeMS: 0,
          })),
        });
      }

      setMessageVisible(false);
      return originalSearchClient.search(requests);
    },
  };

  return (
    <main className='flex min-h-screen flex-col justify-between items-center'>
      <InstantSearch
        searchClient={searchClient}
        indexName='meme data'
      >
        <div className='mb-8'>
          <SearchBox
            className='flex items-center search-box-class search-box-width ais-Searchbox-form max-w-2xl'
            placeholder='Search for memes'
          />
        </div>
        {isMessageVisible && (
        <div className='mx-5 py-8 px-4 text-center border rounded-xl'>
            <p>
              Welcome to What was that meme? <br />
              <br /> Start searching for memes... <br />
              (The database is not too big right now, start upload you favourites!) <br />
              <br />
              Stay tuned for exciting new features!
            </p>
            <ul className='pl-5 my-2'>
              <li>Desktop optimization</li>
              <li>Easy share functionality</li>
              <li>User profiles</li>
              <li>User-generated meme collections</li>
              <li>Integration with social media platforms</li>
              <li>...and more!</li>
            </ul>
            <a
              className='flex items-center justify-center px-4 py-2 bg-my-moonstone text-white font-medium rounded-full shadow-lg cursor-pointer hover:bg-my-moonstoneshade'
              target='_blank'
              href='https://www.buymeacoffee.com/attilatapai'
              rel='noreferrer'
            >
              <img
                className='h-6 w-6 mr-2'
                src='https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg'
                alt='Buy me a coffee'
              />
              <span className='text-sm'>Buy me a coffee</span>
            </a>
        </div>
        )}
        <div className='mt-8 max-w-xl'>
          <InfiniteHits />
        </div>
      </InstantSearch>

      <Link
        href='/upload'
        passHref
        className='fixed bottom-5 right-5 inline-flex items-center justify-center w-12 h-12 bg-my-tangelo text-white rounded-full shadow-lg cursor-pointer hover:bg-my-vanilla'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12 4v16m8-8H4'
          />
        </svg>
      </Link>
    </main>
  );
}
