/* eslint-disable @next/next/no-img-element */
"use client";

import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Hits, Pagination, Configure } from "react-instantsearch";
import Link from "next/link";

export default function Home() {
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

      return originalSearchClient.search(requests);
    },
  };

  function Hit({ hit }) {
    return (
      <article className='border-gray-200 p-4 w-full md:w-48 md:h-48 lg:w-64 lg:h-64'>
        <img
          className='p-2'
          src={hit.imageUrl}
          alt={hit.text}
        />
      </article>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      <InstantSearch
        searchClient={searchClient}
        indexName='meme data'
      >
        <Configure hitsPerPage={10} />
        <SearchBox
          className='mb-8 w-screen search-box-class search-box-width h-7'
          placeholder='Search for memes'
        />
        <Hits hitComponent={Hit} />
        <Pagination className='custom-pagination' />
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
