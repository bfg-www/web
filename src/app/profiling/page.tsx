'use client'

import { useState } from 'react'
import EnergyProfileForm from '../ui/profiling/EnergyProfileForm'
import { ProfileFormValues } from '../models/clientModels'
import FullscreenSpinner from '../ui/profiling/FullscreenSpinner'
import { getAirconsForProfile } from '../lib/aircon'
import {
  updateAirconResultsInLocalStorage,
  updateProfileFormValuesInLocalStorage,
} from '../ui/helpers'

{
  /* Page manages the state for form submission, mock loading, and education tidbit visibility. 
    - formSubmitted is false -> whether form component renders or is hidden depend when 'Next' is clicked
    - formSubmitted is true, isMockLoading set to true, set timeout for 3 seconds -> loading component (controlled by FE since loading is independent of BE's computation of the inputs)
    - education tidbit state (component controlled by FE, "Show me my results!" btn to trigger next route/page)
    */
}
export default function Page() {
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
  const [isMockLoading, setIsMockLoading] = useState<boolean>(false)
  const [mockProgressStat, setMockProgressStat] = useState<number>(0)

  const handleFormSubmit = async (data: ProfileFormValues) => {
    try {
      setIsFormSubmitted(true)
      setIsMockLoading(true)
      setMockProgressStat(0)

      const interval = setInterval(() => {
        setMockProgressStat((prev) => {
          if (prev >= 99) {
            clearInterval(interval)
            setIsMockLoading(false)
          }
          return prev + 1
        })
      }, 60) // 60ms * 100 = 6000ms (6 sec)

      const results = await getAirconsForProfile(data)
      // const results = await getDummyAircons()

      // Store the profile & results data in localStorage
      updateProfileFormValuesInLocalStorage(data)
      updateAirconResultsInLocalStorage(results)
    } catch (error) {
      console.error('Error in handleFormSubmit:', error)
      // Handle the error appropriately
    }
  }

  return (
    <>
      {!isFormSubmitted && <EnergyProfileForm onSubmit={handleFormSubmit} />}
      {isFormSubmitted && (
        <FullscreenSpinner
          progress={mockProgressStat}
          showLoadingText={isMockLoading}
        />
      )}
    </>
  )
}
