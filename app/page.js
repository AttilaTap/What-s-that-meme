/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { InstantSearch, SearchBox } from "react-instantsearch";
import algoliasearch from "algoliasearch/lite";
import Link from "next/link";
import InfiniteHits from "./components/infiniteHits";

export default function Home() {
  const [isMessageVisible, setMessageVisible] = useState(true);
  const originalSearchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_API_KEY);

  useEffect(() => {
    // Create a MutationObserver to observe changes in the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!mutation.addedNodes) return;

        // Check for the search input element
        const searchInput = document.querySelector(".ais-SearchBox-input");
        if (searchInput) {
          const handleInput = (event) => {
            console.log("User typed in search box:", event.target.value);
            setMessageVisible(false);
          };
          searchInput.addEventListener("input", handleInput);

          // Disconnect observer after attaching the event listener
          observer.disconnect();
        }
      });
    });

    // Observe changes in the entire body of the page
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      // Disconnect the observer on cleanup
      observer.disconnect();
    };
  }, []);

  return (
    <main className='flex min-h-screen flex-col items-center mx-4'>
      <InstantSearch
        searchClient={originalSearchClient}
        indexName='meme data'
      >
        <div className='max-w-screen-sm mx-4 w-full'>
          <SearchBox
            className='search-box-class ais-Searchbox-form'
            placeholder='Search for memes'
            autoFocus={true}
          />
        </div>
        {isMessageVisible && (
          <div className='max-w-screen-sm p-8 mb-8 text-center border rounded-xl w-full'>
            <p>
              Welcome to What was that meme? <br />
              <br /> Start searching for memes... <br />
              (The database is not too big right now, start upload you favourites!) <br />
              <br />
              Stay tuned for exciting new features!
            </p>
            <br />
            <a
              className='flex items-center justify-center px-4 py-2 bg-my-moon2 text-white font-medium rounded-full shadow-lg cursor-pointer hover:bg-my-moon3'
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
        <div className='max-w-screen-sm'>
          <InfiniteHits />
        </div>
      </InstantSearch>

      <Link
        href='/upload'
        passHref
        className='fixed bottom-4 right-4 inline-flex items-center justify-center w-12 h-12 bg-my-tangelo text-white rounded-full shadow-lg cursor-pointer hover:bg-my-tangelo2'
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
