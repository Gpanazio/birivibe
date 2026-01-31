import { useState, useEffect } from 'react';

const THREE_HOURS_MS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
const STORAGE_KEY = 'tamagotchi_start_time';
const NOTIFICATION_KEY = 'tamagotchi_3h_notification_shown';

export const useTamagotchiTimer = () => {
  const [hasReachedThreeHours, setHasReachedThreeHours] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Initialize start time if not exists
    let startTime = localStorage.getItem(STORAGE_KEY);

    if (!startTime) {
      const now = Date.now().toString();
      localStorage.setItem(STORAGE_KEY, now);
      startTime = now;
    }

    const startTimestamp = parseInt(startTime);

    // Check elapsed time every second
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTimestamp;
      setElapsedTime(elapsed);

      if (elapsed >= THREE_HOURS_MS) {
        setHasReachedThreeHours(true);

        // Show notification only once per session
        const notificationShown = sessionStorage.getItem(NOTIFICATION_KEY);
        if (!notificationShown) {
          setShowNotification(true);
          sessionStorage.setItem(NOTIFICATION_KEY, 'true');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const dismissNotification = () => {
    setShowNotification(false);
  };

  const resetTimer = () => {
    const now = Date.now().toString();
    localStorage.setItem(STORAGE_KEY, now);
    sessionStorage.removeItem(NOTIFICATION_KEY);
    setElapsedTime(0);
    setHasReachedThreeHours(false);
    setShowNotification(false);
  };

  const getTimeProgress = () => {
    return Math.min((elapsedTime / THREE_HOURS_MS) * 100, 100);
  };

  const getFormattedTime = () => {
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  };

  return {
    hasReachedThreeHours,
    showNotification,
    dismissNotification,
    resetTimer,
    elapsedTime,
    getTimeProgress,
    getFormattedTime,
  };
};
