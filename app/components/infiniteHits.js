/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import { useInfiniteHits } from "react-instantsearch";

const InfiniteHits = (props) => {
  const { hits: originalHits, isLastPage, showMore } = useInfiniteHits(props);
  const [shuffledHits, setShuffledHits] = useState([]);
  const sentinelRef = useRef(null);

  const shuffleHits = (hits) => {
    let shuffled = [...hits];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    setShuffledHits(shuffleHits(originalHits));
  }, [originalHits]);

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
      {shuffledHits.map((hit) => (
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
