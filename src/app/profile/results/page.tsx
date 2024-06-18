'use client'

import { getAirconsForProfile, getDummyAircons } from '@/app/lib/aircon'
import { Profile } from '@/app/models/clientModels'
import { Aircon } from '@/app/lib/aircon'
import { useState } from 'react'

function List({ aircons: initialAircons }: { aircons: Aircon[] }) {
  const [aircons, setAircons] = useState<Aircon[]>(initialAircons)

  return (
    <div>
      <h1>Results</h1>
      <ul>
        {aircons.map((aircon) => (
          <li key={aircon.id}>
            {aircon.brand} {aircon.model} {aircon.greenTicks}{' '}
            {aircon.annualConsumption}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function Page(profile: Profile) {
  // const aircons = await getAirconsForProfile(profile)
  const aircons = await getDummyAircons()

  return <List aircons={aircons} />
}
