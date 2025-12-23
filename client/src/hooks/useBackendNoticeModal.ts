import { useState, useEffect } from 'react';

/**
 * A custom hook that manages the state and behavior of the backend notice modal.
 * 
 * Handles:
 * - Showing the modal when the app opens
 * - Closing the modal via various methods (button, escape key, backdrop click)
 * - Preventing body scroll when modal is open
 * 
 * @returns An object containing the modal's show state and close handler
 */
export const useBackendNoticeModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    // Show the modal when component mounts (app opens)
    setShow(true);
  }, []);

  useEffect(() => {
    // Handle escape key press
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && show) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  return {
    show,
    handleClose,
  };
};

