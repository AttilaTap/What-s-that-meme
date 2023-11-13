/* eslint-disable @next/next/no-img-element */
"use client";

import algoliasearch from "algoliasearch/lite";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { InstantSearch, SearchBox, useInfiniteHits } from "react-instantsearch";

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

  function InfiniteHits(props) {
    const { hits, isLastPage, showMore } = useInfiniteHits(props);
    const sentinelRef = useRef(null);

    useEffect(() => {
      if (sentinelRef.current !== null) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isLastPage) {
              showMore();
            }
          });
        });

        observer.observe(sentinelRef.current);

        return () => observer.disconnect();
      }
    }, [isLastPage, showMore]);

    return (
      <div>
        {hits.map((hit) => (
          <article
            key={hit.objectID}
            className='border-gray-200 p-4 w-full md:w-48 md:h-48 lg:w-64 lg:h-64'
          >
            <img
              className='p-2'
              src={hit.imageUrl}
              alt={hit.text}
              loading='lazy'
            />
          </article>
        ))}
        <div ref={sentinelRef}></div>
      </div>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      <InstantSearch
        searchClient={searchClient}
        indexName='meme data'
      >
        <SearchBox
          className='mb-8 w-screen search-box-class search-box-width h-7'
          placeholder='Search for memes'
        />
        {isMessageVisible && (
          <div className='mx-12 text-center'>
            <p>
              Welcome to What was that meme? <br /> Start searching for memes... <br /> <br />
              Stay tuned for exciting new features!
            </p>
            <ul className='list-disc pl-5 my-2'>
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
        <InfiniteHits />
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
