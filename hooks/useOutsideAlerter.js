import { useEffect } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 */
const useOutsideAlerter = (ref, alertCallback) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        alertCallback && alertCallback()
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, alertCallback])
}

export default useOutsideAlerter

