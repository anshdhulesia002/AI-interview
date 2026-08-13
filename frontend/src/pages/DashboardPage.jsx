import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { ProfileWidget } from '../components/dashboard/ProfileWidget';
import { AnalyticsOverview } from '../components/analytics/AnalyticsOverview';

export const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-surface-base text-content-primary">
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Navbar */}
        <DashboardHeader />

        {/* Dashboard Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
                Candidate Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-content-secondary mt-1">
                Track your performance metrics, active streaks, and upcoming interview sessions.
              </p>
            </div>
          </div>

          {/* 1. Statistics Cards Overview */}
          <StatsOverview />

          {/* 2. Interactive Recharts Visualizations */}
          <AnalyticsOverview />

          {/* 3. Main 2-Column Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column (8 cols): Recent Activity & Performance History */}
            <div className="lg:col-span-8 space-y-8">
              <RecentActivity />
            </div>

            {/* Right Column (4 cols): Profile & Skill Breakdown Widget */}
            <div className="lg:col-span-4 space-y-8">
              <ProfileWidget />
            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default DashboardPage;
