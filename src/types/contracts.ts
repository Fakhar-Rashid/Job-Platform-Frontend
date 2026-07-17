import type { JobType, Review } from './index';

export type ContractStatus = 'OFFERED' | 'ACTIVE' | 'DECLINED' | 'WITHDRAWN' | 'ENDED';
export type MilestoneStatus = 'PENDING' | 'FUNDED' | 'SUBMITTED' | 'CHANGES_REQUESTED' | 'APPROVED' | 'CANCELLED';
export type TimeEntryStatus = 'LOGGED' | 'PAID';
export type WalletReason = 'TOPUP' | 'ESCROW_FUND' | 'ESCROW_REFUND' | 'MILESTONE_PAYOUT' | 'HOURLY_PAYOUT';

export interface ContractParty {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface Milestone {
  id: string;
  description: string;
  amount: number;
  order: number;
  status: MilestoneStatus;
  submissionMessage?: string | null;
  changeRequest?: string | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  createdAt: string;
  contractId: string;
}

export interface TimeEntry {
  id: string;
  date: string;
  hours: number;
  memo: string;
  status: TimeEntryStatus;
  createdAt: string;
  contractId: string;
}

export interface ClientFeedback {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  contractId: string;
  clientId: string;
  freelancerId: string;
}

export interface Contract {
  id: string;
  type: JobType;
  hourlyRate: number | null;
  offerMessage?: string | null;
  status: ContractStatus;
  createdAt: string;
  acceptedAt?: string | null;
  endedAt?: string | null;
  endedById?: string | null;
  jobId: string;
  bidId: string;
  clientId: string;
  freelancerId: string;
  job: { id: string; title: string };
  client: ContractParty;
  freelancer: ContractParty;
  milestones: { amount: number; status: MilestoneStatus }[];
}

export interface ContractDetail extends Omit<Contract, 'milestones'> {
  milestones: Milestone[];
  timeEntries: TimeEntry[];
  clientFeedback: ClientFeedback | null;
  review: Review | null;
  escrow: { funded: number; released: number };
}

export interface WalletTransactionRow {
  id: string;
  amount: number;
  reason: WalletReason;
  contractId?: string | null;
  createdAt: string;
}

export interface Wallet {
  balance: number;
  transactions: WalletTransactionRow[];
}
