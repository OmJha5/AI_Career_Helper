import { getUserOnboardingStatus } from '../../../../actions/user';
import { redirect } from 'next/navigation';
import DashboardView from './_container/dashboard-view';
import { getIndustryInsights } from '../../../../actions/dashboard';

export default async function page() {
    // If user is not onboarded send them to /onboarding otherwise do onboard
    let status = await getUserOnboardingStatus();

    if(!status.isOnboarded){
        return redirect("/onboarding");
    }

    let insights = await getIndustryInsights();

    if(insights === null){
      return ;
    }

  return (
     <div className="container mx-auto">
      <DashboardView insights={insights} />
    </div>
  )
}
