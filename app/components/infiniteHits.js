/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useRef } from "react";
import { useInfiniteHits } from "react-instantsearch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InfiniteHits = (props) => {
  const { hits: originalHits, isLastPage, showMore } = useInfiniteHits(props);
  const [shuffledHits, setShuffledHits] = useState([]);
  const [activeShareHitId, setActiveShareHitId] = useState(null);
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

  const handleInstaShare = (imageUrl, isInstagram) => {
    navigator.clipboard.writeText(imageUrl).then(
      () => {
        const message = isInstagram ? "Link copied to clipboard. You can share it on Instagram." : "Link copied to clipboard. You can share it now.";
        toast.success(message);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast.error("Failed to copy the link.");
      },
    );
  };

  const getSocialMediaLinks = (imageUrl) => {
    const encodedUrl = encodeURIComponent(imageUrl);

    return {
      sharelink: () => handleInstaShare(imageUrl, false),
      instagram: () => handleInstaShare(imageUrl, true),
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=Check%20out%20this%20meme!`,
      messenger: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    };
  };

  const handleShare = (hitId) => {
    setActiveShareHitId(hitId === activeShareHitId ? null : hitId);
  };

  useEffect(() => {}, [activeShareHitId]);

  return (
    <div>
      {shuffledHits.map((hit) => (
        <article
          key={hit.objectID}
          className='border-gray-200 py-1 w-full '
        >
          <div className='relative'>
            <img
              src={hit.imageUrl}
              alt={hit.text}
              loading='lazy'
              className='w-full h-auto border-transparent rounded-lg'
            />
            <div className='absolute bottom-2 right-2 z-10'>
              <button
                onClick={() => handleShare(hit.objectID)}
                className='p-2 bg-opacity-70 bg-my-moon2 rounded-full shadow cursor-pointer hover:bg-opacity-90 transition duration-300 ease-in-out'
                aria-label='Share'
              >
                <img
                  src='/share.svg'
                  alt='Share'
                  className='w-6 h-6'
                />
              </button>
            </div>
            <div className={`social-icons absolute bottom-2 right-2 z-10 ${activeShareHitId === hit.objectID ? "visible" : ""}`}>
              {Object.entries(getSocialMediaLinks(hit.imageUrl)).map(([platform, action]) => {
                const isFunction = typeof action === "function";

                return isFunction ? (
                  <button
                    className='p-2 bg-opacity-70 mr-1 bg-my-moon2 rounded-full shadow cursor-pointer hover:bg-opacity-90 transition duration-300 ease-in-out'
                    key={platform}
                    onClick={() => action()}
                  >
                    <img
                      className='w-6 h-6'
                      src={`/socialmediaIcons/${platform}.svg`}
                      alt={platform}
                    />
                  </button>
                ) : (
                  <a
                    className='p-2 bg-opacity-70 mr-1 bg-my-moon2 rounded-full shadow cursor-pointer hover:bg-opacity-90 transition duration-300 ease-in-out'
                    key={platform}
                    href={action}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <img
                      className='w-6 h-6'
                      src={`/socialmediaIcons/${platform}.svg`}
                      alt={platform}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </article>
      ))}
      <div ref={sentinelRef}></div>
      <ToastContainer
        position='top-center'
        autoClose={1000}
      />
    </div>
  );
};

export default InfiniteHits;
