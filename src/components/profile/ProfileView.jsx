import ProfileHeader from './ProfileHeader.jsx';
import CoreInfo from './CoreInfo.jsx';
import SkillsSection from './SkillsSection.jsx';
import WorkHistorySection from './WorkHistorySection.jsx';
import { StatsCard, PromoteCard, VerificationsCard, HoursCard, ResponseCard, VideoCard, ConnectsCard } from './AsideCards.jsx';
import {
  LanguagesSection, EducationSection, EmploymentSection, PortfolioListSection,
  CertificationsSection, LicensesSection, LinkedAccountsSection, OtherExperiencesSection,
} from './ListSections.jsx';

function PlaceholderCard({ title, text, action }) {
  return (
    <section className="card">
      <div className="section-head"><h3>{title}</h3></div>
      <p className="muted">{text}</p>
      {action && <p><span className="link-green">{action}</span></p>}
    </section>
  );
}

export default function ProfileView({ profile, editable, onChanged }) {
  const shared = { profile, editable, onChanged };

  return (
    <div className="profile-page">
      <ProfileHeader {...shared} />

      <div className="profile-grid">
        <aside className="profile-aside">
          <StatsCard profile={profile} />
          {editable && <ConnectsCard profile={profile} onChanged={onChanged} />}
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

        <main className="profile-main">
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
