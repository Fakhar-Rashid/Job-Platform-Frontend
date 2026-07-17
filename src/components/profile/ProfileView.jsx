import ProfileHeader from './ProfileHeader.jsx';
import CoreInfo from './CoreInfo.jsx';
import SkillsSection from './SkillsSection.jsx';
import WorkHistorySection from './WorkHistorySection.jsx';
import { StatsCard, PromoteCard, VerificationsCard, HoursCard, ResponseCard, VideoCard, ConnectsCard } from './AsideCards.jsx';
import {
  LanguagesSection, EducationSection, EmploymentSection, PortfolioListSection,
  CertificationsSection, LicensesSection, LinkedAccountsSection, OtherExperiencesSection,
} from './ListSections.jsx';
import Card from '../ui/Card.jsx';

function PlaceholderCard({ title, text, action }) {
  return (
    <Card>
      <div className="mb-3 flex items-start justify-between gap-3"><h3 className="text-lg">{title}</h3></div>
      <p className="text-muted">{text}</p>
      {action && <p><span className="font-medium text-brand">{action}</span></p>}
    </Card>
  );
}

export default function ProfileView({ profile, editable }) {
  const shared = { profile, editable };

  return (
    <div className="flex flex-col gap-4.5">
      <ProfileHeader {...shared} />

      <div className="grid grid-cols-1 items-start gap-4.5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-4">
          <StatsCard profile={profile} />
          {editable && <ConnectsCard profile={profile} />}
          <PromoteCard {...shared} />
          <VideoCard {...shared} />
          <HoursCard {...shared} />
          <ResponseCard {...shared} />
          <LanguagesSection {...shared} />
          <VerificationsCard {...shared} />
          <LicensesSection {...shared} />
          <EducationSection {...shared} />
          <LinkedAccountsSection {...shared} />
        </aside>

        <main className="flex flex-col gap-4">
          <CoreInfo {...shared} />
          <PortfolioListSection {...shared} />
          <WorkHistorySection {...shared} />
          <SkillsSection {...shared} />
          <PlaceholderCard title="Your project catalog" text="Create project offerings that highlight your strengths and attract more clients." action="Manage projects" />
          <PlaceholderCard title="Testimonials" text="Showcase your skills with client testimonials." action="Request a testimonial" />
          <CertificationsSection {...shared} />
          <EmploymentSection {...shared} />
          <OtherExperiencesSection {...shared} />
        </main>
      </div>
    </div>
  );
}
