import React from 'react'
import { getUserOnboardingStatus } from '../../../../actions/user';
import { redirect } from 'next/navigation';

export default async function page() {
    // If user is not onboarded send them to /onboarding otherwise do onboard
    let status = await getUserOnboardingStatus();

    if(!status.isOnboarded){
        return redirect("/onboarding");
    }
  return (
    <div>Welcome to dashboard</div>
  )
}
