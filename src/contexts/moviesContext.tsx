import React, { useState, useCallback } from "react";
import { BaseMovieProps, Review } from "../types/interfaces";

interface MovieContextInterface {
  mustWatch: number[];
  addToMustWatch: (movie: BaseMovieProps) => void;
  favourites: number[];
  addToFavourites: (movie: BaseMovieProps) => void;
  removeFromFavourites: (movie: BaseMovieProps) => void;
  addReview: (movie: BaseMovieProps, review: Review) => void;
}

const initialContextState: MovieContextInterface = {
  mustWatch: [],
  addToMustWatch: () => {},
  favourites: [],
  addToFavourites: () => {},
  removeFromFavourites: () => {},
  addReview: () => {},
};

export const MoviesContext =
  React.createContext<MovieContextInterface>(initialContextState);

const MoviesContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [mustWatch, setMustWatch] = useState<number[]>(() => {
    const stored = localStorage.getItem("mustWatch");
    return stored ? JSON.parse(stored) : [];
  });
  const [favourites, setFavourites] = useState<number[]>([]);
  const [myReviews, setMyReviews] = useState<Record<number, Review>>({});

  const addToMustWatch = useCallback((movie: BaseMovieProps) => {
    setMustWatch((prev) => {
      if (!prev.includes(movie.id)) {
        const updated = [...prev, movie.id];
        localStorage.setItem("mustWatch", JSON.stringify(updated));
        console.log("Must Watch:", updated);
        return updated;
      }
      return prev;
    });
  }, []);

  const addToFavourites = useCallback((movie: BaseMovieProps) => {
    setFavourites((prevFavourites) => {
      if (!prevFavourites.includes(movie.id)) {
        return [...prevFavourites, movie.id];
      }
      return prevFavourites;
    });
  }, []);

  const removeFromFavourites = useCallback((movie: BaseMovieProps) => {
    setFavourites((prevFavourites) =>
      prevFavourites.filter((mId) => mId !== movie.id)
    );
  }, []);

  const addReview = (movie: BaseMovieProps, review: Review) => {
    setMyReviews((prevReviews) => ({
      ...prevReviews,
      [movie.id]: review,
    }));
  };

  return (
    <MoviesContext.Provider
      value={{
        mustWatch,
        addToMustWatch,
        favourites,
        addToFavourites,
        removeFromFavourites,
        addReview,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;
