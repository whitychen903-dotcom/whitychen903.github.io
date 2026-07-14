"use client";

import { useState, useEffect, useCallback } from "react";

export interface WantToGoTour {
  id: string; // unique id: tour-{date}-{venue}
  artistName: string;
  artistSlug: string;
  tourName?: string;
  date: string;
  venue: string;
  location: string;
  ticketUrl?: string;
  addedAt: string;
}

const WANT_TO_GO_KEY = "jpop-hub-want-to-go";
const FOLLOWED_ARTISTS_KEY = "jpop-hub-followed-artists";
const TODO_ITEMS_KEY = "jpop-hub-todo-items";

function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Want-to-Go Tours ----

export function useWantToGoTours() {
  const [tours, setTours] = useState<WantToGoTour[]>([]);

  useEffect(() => {
    setTours(getStorageItem<WantToGoTour[]>(WANT_TO_GO_KEY, []));
  }, []);

  const isSaved = useCallback(
    (id: string) => tours.some((t) => t.id === id),
    [tours]
  );

  const toggleTour = useCallback(
    (tour: WantToGoTour) => {
      setTours((prev) => {
        const exists = prev.find((t) => t.id === tour.id);
        let next: WantToGoTour[];
        if (exists) {
          next = prev.filter((t) => t.id !== tour.id);
        } else {
          next = [...prev, { ...tour, addedAt: new Date().toISOString() }];
        }
        setStorageItem(WANT_TO_GO_KEY, next);
        return next;
      });
    },
    []
  );

  const removeTour = useCallback((id: string) => {
    setTours((prev) => {
      const next = prev.filter((t) => t.id !== id);
      setStorageItem(WANT_TO_GO_KEY, next);
      return next;
    });
  }, []);

  const addCustomTour = useCallback(
    (tour: Omit<WantToGoTour, "id" | "addedAt">) => {
      const id = `custom-${Date.now()}`;
      const newTour: WantToGoTour = {
        ...tour,
        id,
        addedAt: new Date().toISOString(),
      };
      setTours((prev) => {
        const next = [...prev, newTour];
        setStorageItem(WANT_TO_GO_KEY, next);
        return next;
      });
    },
    []
  );

  return { tours, isSaved, toggleTour, removeTour, addCustomTour };
}

// ---- Followed Artists ----

export interface FollowedArtist {
  slug: string;
  name: string;
  addedAt: string;
}

export function useFollowedArtists() {
  const [artists, setArtists] = useState<FollowedArtist[]>([]);

  useEffect(() => {
    setArtists(getStorageItem<FollowedArtist[]>(FOLLOWED_ARTISTS_KEY, []));
  }, []);

  const addArtist = useCallback((artist: FollowedArtist) => {
    setArtists((prev) => {
      if (prev.find((a) => a.slug === artist.slug)) return prev;
      const next = [...prev, artist];
      setStorageItem(FOLLOWED_ARTISTS_KEY, next);
      return next;
    });
  }, []);

  const removeArtist = useCallback((slug: string) => {
    setArtists((prev) => {
      const next = prev.filter((a) => a.slug !== slug);
      setStorageItem(FOLLOWED_ARTISTS_KEY, next);
      return next;
    });
  }, []);

  return { artists, addArtist, removeArtist };
}

// ---- Todo Items ----

export interface TodoItem {
  id: string;
  title: string;
  tag: string;
  dueDate?: string;
  note?: string;
  completed: boolean;
  createdAt: string;
}

export function useTodoItems() {
  const [items, setItems] = useState<TodoItem[]>([]);

  useEffect(() => {
    setItems(getStorageItem<TodoItem[]>(TODO_ITEMS_KEY, []));
  }, []);

  const addItem = useCallback((item: Omit<TodoItem, "id" | "createdAt">) => {
    const newItem: TodoItem = {
      ...item,
      id: `todo-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setItems((prev) => {
      const next = [...prev, newItem];
      setStorageItem(TODO_ITEMS_KEY, next);
      return next;
    });
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      setStorageItem(TODO_ITEMS_KEY, next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      setStorageItem(TODO_ITEMS_KEY, next);
      return next;
    });
  }, []);

  return { items, addItem, toggleComplete, removeItem };
}
