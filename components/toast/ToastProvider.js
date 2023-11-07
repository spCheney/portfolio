import { useState, useMemo, useRef } from "react";

import ToastContext from "./ToastContext";
import Toast from "./Toast";

import styles from "./toast.module.css"

export default function ToastProvider({ children }) {
  const [location, setLocation] = useState(styles.topLeft)
  const [content, setContent] = useState(<></>)
  const [isClosed, setIsClosed] = useState(true)
  const [isCloseAnimationOn, setIsCloseAnimationOn] = useState(false)
  const isClosedRef = useRef(false)
  isClosedRef.current  = isClosed

  /**
   * updates the location of where the toast will appear
   * @param {string} newLocation 
   */
  function updateLocation(newLocation) {
    if(newLocation == "topLeft") {
      setLocation(styles.topLeft)
    }  else if(newLocation == "bottomLeft") {
      setLocation(styles.bottomLeft)
    }
  }

  /**
   * opens a toast
   * @param {JSX | string} newContent 
   */
  function open(newContent) {
    if(isClosedRef.current) {
      setContent(newContent)
      setIsClosed(false)
    } else {
      setIsClosed(true)
      setTimeout(() =>  {
        setContent(newContent)
        setIsClosed(false)
      }, 100)
      
    }
  }

  /**
   * closes th toast
   * @returns a promise to now when closing animation has finished
   */
  function close() {    
    setIsCloseAnimationOn(true)
    return new Promise(resolve => {
      setTimeout(() => {
        setIsClosed(true)
        setContent(<></>)
        setIsCloseAnimationOn(false)
        resolve()
      }, 300)
    }) 
  }

  const contextValue = useMemo(() => ({ open, updateLocation, close }), [])

  return (
    <ToastContext.Provider value={ contextValue }>
      { children }

      <div className={ [styles.wrapper, location].join(' ') }>
        
        {isClosed ?  <></> :
          <Toast close={ close } isCloseAnimationOn={ isCloseAnimationOn }>
            { content }
          </Toast>
        }
      </div>
    </ToastContext.Provider>
  )
}