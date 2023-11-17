/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef } from "react";
import { useInfiniteHits } from "react-instantsearch";

const InfiniteHits = (props) => {
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
          className='border-gray-200 py-1 w-full '
        >
          <img
            src={hit.imageUrl}
            alt={hit.text}
            loading='lazy'
            className='w-full h-auto border-transparent rounded-lg'
          />
        </article>
      ))}
      <div ref={sentinelRef}></div>
    </div>
  );
};

export default InfiniteHits;
