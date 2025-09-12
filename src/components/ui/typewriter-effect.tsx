'use client'

import { useState, useEffect } from 'react'

import { cn } from '../../lib/utils'

interface TypewriterEffectProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
  startDelay?: number
}

export function TypewriterEffect({
  text,
  speed = 50,
  className,
  onComplete,
  startDelay = 0,
}: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    if (startDelay > 0) {
      const startTimer = setTimeout(() => {
        setIsStarted(true)
      }, startDelay)
      return () => clearTimeout(startTimer)
    } else {
      setIsStarted(true)
    }
  }, [startDelay])

  useEffect(() => {
    if (!isStarted || currentIndex >= text.length) {
      if (currentIndex >= text.length && onComplete) {
        onComplete()
      }
      return
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, currentIndex + 1))
      setCurrentIndex(currentIndex + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, speed, isStarted, onComplete])

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('')
    setCurrentIndex(0)
    setIsStarted(startDelay === 0)
  }, [text, startDelay])

  return (
    <span className={cn('inline-block', className)}>
      {displayedText}
      {currentIndex < text.length && (
        <span className='animate-pulse ml-0.5 text-blue-500'>|</span>
      )}
    </span>
  )
}

// Alternative version with word-by-word animation
interface TypewriterWordEffectProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
  startDelay?: number
}

export function TypewriterWordEffect({
  text,
  speed = 200,
  className,
  onComplete,
  startDelay = 0,
}: TypewriterWordEffectProps) {
  const words = text.split(' ')
  const [displayedWords, setDisplayedWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isStarted, setIsStarted] = useState(false)

  useEffect(() => {
    if (startDelay > 0) {
      const startTimer = setTimeout(() => {
        setIsStarted(true)
      }, startDelay)
      return () => clearTimeout(startTimer)
    } else {
      setIsStarted(true)
    }
  }, [startDelay])

  useEffect(() => {
    if (!isStarted || currentWordIndex >= words.length) {
      if (currentWordIndex >= words.length && onComplete) {
        onComplete()
      }
      return
    }

    const timer = setTimeout(() => {
      setDisplayedWords(words.slice(0, currentWordIndex + 1))
      setCurrentWordIndex(currentWordIndex + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [currentWordIndex, words, speed, isStarted, onComplete])

  // Reset when text changes
  useEffect(() => {
    setDisplayedWords([])
    setCurrentWordIndex(0)
    setIsStarted(startDelay === 0)
  }, [text, startDelay])

  return (
    <span className={cn('inline-block', className)}>
      {displayedWords.map((word, index) => (
        <span
          key={index}
          className='animate-in fade-in-0 slide-in-from-bottom-1 duration-300'
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {word}
          {index < displayedWords.length - 1 ? ' ' : ''}
        </span>
      ))}
      {currentWordIndex < words.length && (
        <span className='animate-pulse ml-1 text-blue-500'>|</span>
      )}
    </span>
  )
}
