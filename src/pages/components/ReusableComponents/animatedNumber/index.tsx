import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const AnimatedNumber = ({ value, duration }: { value: number; duration: number }) => {
  const router = useRouter()
  const [currentValue, setCurrentValue] = useState(0)
  const [start, setStart] = useState(Date.now())

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('en-AU', {
    
      currency: 'AUD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    setStart(Date.now()); // Reset the start time when value or duration changes

    const updateValue = () => {
      const now = Date.now()
      const elapsedTime = now - start
      const progress = Math.min(1, elapsedTime / duration)
      const newValue = value * progress
      setCurrentValue(newValue)
      if (progress < 1) {
        requestAnimationFrame(updateValue)
      }
    }
    requestAnimationFrame(updateValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  return <span>{router.pathname === '/dashboards/logistic' ? formatCurrency(currentValue) : formatCurrency(currentValue)}</span>
}

export default AnimatedNumber
