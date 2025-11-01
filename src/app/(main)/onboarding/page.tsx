import OnboardingForm from './_components/OnboardingForm'
import { getUserOnboardingStatus } from '../../../../actions/user'
import { redirect } from 'next/navigation';

export default async function page() {
    // If user is already onboarding send them to /dashboard otherwise do onboard
    let status = await getUserOnboardingStatus();

    if(status.isOnboarded){
      return redirect("/dashboard");
    }
    
  return (
    <main>
        <OnboardingForm />
    </main>
  )
}
