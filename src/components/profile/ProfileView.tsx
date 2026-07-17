import ProfileHeader from './ProfileHeader';
import CoreInfo from './CoreInfo';
import SkillsSection from './SkillsSection';
import WorkHistorySection from './WorkHistorySection';
import {
  StatsCard,
  PromoteCard,
  VerificationsCard,
  HoursCard,
  ResponseCard,
  VideoCard,
  ConnectsCard,
} from './AsideCards';
import {
  LanguagesSection,
  EducationSection,
  EmploymentSection,
  PortfolioListSection,
  CertificationsSection,
  LicensesSection,
  LinkedAccountsSection,
  OtherExperiencesSection,
} from './ListSections';
import Card from '../ui/Card';
import type { Profile } from '../../types';

interface ProfileViewProps {
  profile: Profile;
  editable: boolean;
}

interface PlaceholderCardProps {
  title: string;
  text: string;
  action?: string;
}

function PlaceholderCard({ title, text, action }: PlaceholderCardProps) {
  return (
    <Card>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg">{title}</h3>
      </div>
      <p className="text-muted">{text}</p>
      {action && (
        <p>
          <span className="font-medium text-brand">{action}</span>
        </p>
      )}
    </Card>
  );
}

export default function ProfileView({ profile, editable }: ProfileViewProps) {
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
          <PlaceholderCard
            title="Your project catalog"
            text="Create project offerings that highlight your strengths and attract more clients."
            action="Manage projects"
          />
          <PlaceholderCard
            title="Testimonials"
            text="Showcase your skills with client testimonials."
            action="Request a testimonial"
          />
          <CertificationsSection {...shared} />
          <EmploymentSection {...shared} />
          <OtherExperiencesSection {...shared} />
        </main>
      </div>
    </div>
  );
}
