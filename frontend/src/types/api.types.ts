// Generic API Response wrapper
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> {
  [key: string]: T[] | any; // Dynamic key for data array (cases, users, etc)
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User role enum - MATCHES BACKEND
export enum UserRole {
  ADMIN = "admin",
  JUDGE = "judge",
  LAWYER = "lawyer",
  LITIGANT = "litigant",
  CLERK = "clerk",
  PUBLIC = "public",
}

// User interface - MATCHES BACKEND
export interface User {
  _id: string;
  username: string;
  slug: string;
  email: string;
  fullName: string;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  barCouncilId: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth response
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Court type enum - MATCHES BACKEND
export enum CourtType {
  SUPREME = "Supreme",
  HIGH = "High",
  DISTRICT = "District",
  MAGISTRATE = "Magistrate",
}

// Court interface - MATCHES BACKEND
export interface Court {
  _id: string;
  name: string;
  slug: string;
  code: string;
  type: CourtType;
  state: string;
  city: string;
  address: string;
  contactEmail: string | null;
  contactPhone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Case status enum - MATCHES BACKEND
export enum CaseStatus {
  FILED = "filed",
  ADMITTED = "admitted",
  HEARING = "hearing",
  JUDGMENT = "judgment",
  CLOSED = "closed",
  ARCHIVED = "archived",
}

// Case priority enum - MATCHES BACKEND
export enum CasePriority {
  NORMAL = "normal",
  URGENT = "urgent",
  HIGH = "high",
}

// Case stage enum - MATCHES BACKEND
export enum CaseStage {
  PRELIMINARY = "preliminary",
  TRIAL = "trial",
  FINAL = "final",
}

// Case category enum - MATCHES BACKEND
export enum CaseCategory {
  CIVIL = "Civil",
  CRIMINAL = "Criminal",
  FAMILY = "Family",
  CONSTITUTIONAL = "Constitutional",
}

// Case Type interface - MATCHES BACKEND
export interface CaseType {
  _id: string;
  name: string;
  slug: string;
  code: string;
  description: string | null;
  category: CaseCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Case interface - MATCHES BACKEND EXACTLY
export interface Case {
  _id: string;
  caseNumber: string;
  slug: string;
  title: string;
  description: string | null;
  caseTypeId: string; // ObjectId as string
  courtId: string; // ObjectId as string
  filedBy: string; // ObjectId as string
  status: CaseStatus;
  filingDate: string;
  admissionDate: string | null;
  judgmentDate: string | null;
  priority: CasePriority;
  stage: CaseStage;
  hearingCount: number;
  nextHearingDate: string | null;
  isPublic: boolean;
  isSensitive: boolean;
  viewCount: number;
  bookmarkCount: number;
  verdict: string | null;
  createdAt: string;
  updatedAt: string;
  // Populated fields (when using .populate())
  caseType?: CaseType;
  court?: Court;
  filedByUser?: User;
}

// Advocate interface - MATCHES BACKEND
export interface Advocate {
  _id: string;
  userId: string;
  barCouncilId: string;
  licenseNumber: string;
  specialization: string[];
  experience: number;
  firmName: string | null;
  firmAddress: string | null;
  isActive: boolean;
  enrollmentDate: string;
  createdAt: string;
  updatedAt: string;
  // Populated
  user?: User;
}

// Party type enum - MATCHES BACKEND
export enum PartyType {
  PETITIONER = "petitioner",
  RESPONDENT = "respondent",
  APPELLANT = "appellant",
  DEFENDANT = "defendant",
  PLAINTIFF = "plaintiff",
  WITNESS = "witness",
}

// Case Party interface - MATCHES BACKEND
export interface CaseParty {
  _id: string;
  caseId: string;
  userId: string | null;
  partyType: PartyType;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  advocateId: string | null;
  createdAt: string;
  updatedAt: string;
  // Populated
  case?: Case;
  user?: User;
  advocate?: Advocate;
}

// Hearing purpose enum - MATCHES BACKEND
export enum HearingPurpose {
  PRELIMINARY = "preliminary",
  EVIDENCE = "evidence",
  ARGUMENT = "argument",
  JUDGMENT = "judgment",
  MENTION = "mention",
}

// Hearing status enum - MATCHES BACKEND
export enum HearingStatus {
  SCHEDULED = "scheduled",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  ADJOURNED = "adjourned",
  CANCELLED = "cancelled",
}

// Hearing interface - MATCHES BACKEND EXACTLY
export interface Hearing {
  _id: string;
  caseId: string;
  hearingNumber: string;
  hearingDate: string;
  hearingTime: string;
  judgeId: string;
  courtRoom: string | null;
  purpose: HearingPurpose;
  status: HearingStatus;
  notes: string | null;
  nextHearingDate: string | null;
  adjournmentReason: string | null;
  createdAt: string;
  updatedAt: string;
  // Populated
  case?: Case;
  judge?: User;
}

// Document type enum - MATCHES BACKEND
export enum DocumentType {
  PETITION = "petition",
  AFFIDAVIT = "affidavit",
  ORDER = "order",
  JUDGMENT = "judgment",
  EVIDENCE = "evidence",
  NOTICE = "notice",
  PLEADING = "pleading",
  MISC = "misc",
}

// Document interface - MATCHES BACKEND
export interface Document {
  _id: string;
  caseId: string;
  hearingId: string | null;
  uploadedBy: string;
  title: string;
  type: DocumentType;
  url: string;
  publicId: string;
  format: string;
  size: number;
  description: string | null;
  documentDate: string | null;
  isConfidential: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  // Populated
  case?: Case;
  hearing?: Hearing;
  uploadedByUser?: User;
}

// Case Bookmark interface - MATCHES BACKEND
export interface CaseBookmark {
  _id: string;
  userId: string;
  caseId: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  // Populated
  user?: User;
  case?: Case;
}

// Case View interface - MATCHES BACKEND
export interface CaseView {
  _id: string;
  userId: string | null;
  caseId: string;
  ipAddress: string | null;
  userAgent: string | null;
  viewedAt: string;
  // Populated
  user?: User;
  case?: Case;
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

// Search params
export interface SearchParams extends PaginationParams {
  search?: string;
  filter?: Record<string, unknown>;
  status?: string;
}

// User Statistics
export interface UserStatistics {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  usersByRole: { _id: string; count: number }[];
}
