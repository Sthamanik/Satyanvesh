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

// User role enum
export enum UserRole {
  USER = 'user',
  LAWYER = 'lawyer',
  JUDGE = 'judge',
  CLERK = 'clerk',
  ADMIN = 'admin',
}

// User interface
export interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Auth response
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Court type enum
export enum CourtType {
  SUPREME = 'supreme',
  HIGH = 'high',
  DISTRICT = 'district',
  APPELLATE = 'appellate',
}

// Court interface
export interface Court {
  _id: string;
  name: string;
  slug: string;
  type: CourtType;
  state?: string;
  city?: string;
  address?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Case status enum
export enum CaseStatus {
  REGISTERED = 'registered',
  PENDING = 'pending',
  UNDER_HEARING = 'under_hearing',
  RESERVED = 'reserved',
  DECIDED = 'decided',
  DISPOSED = 'disposed',
  DISMISSED = 'dismissed',
  WITHDRAWN = 'withdrawn',
}

// Case category enum
export enum CaseCategory {
  CIVIL = 'civil',
  CRIMINAL = 'criminal',
  CONSTITUTIONAL = 'constitutional',
  TAX = 'tax',
  FAMILY = 'family',
  LABOR = 'labor',
  CORPORATE = 'corporate',
  OTHER = 'other',
}

// Case Type interface
export interface CaseType {
  _id: string;
  name: string;
  slug: string;
  category: CaseCategory;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Case interface
export interface Case {
  _id: string;
  caseNumber: string;
  slug: string;
  title: string;
  description?: string;
  filingDate: string;
  status: CaseStatus;
  caseType: CaseType | string;
  court: Court | string;
  judge?: User | string;
  isPublic: boolean;
  registeredBy: User | string;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
}

// Advocate interface
export interface Advocate {
  _id: string;
  user: User | string;
  barRegistrationNumber: string;
  specialization: string[];
  experience: number;
  qualifications: string[];
  licenseValidUntil?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Party type enum
export enum PartyType {
  PETITIONER = 'petitioner',
  RESPONDENT = 'respondent',
  APPELLANT = 'appellant',
  DEFENDANT = 'defendant',
  PLAINTIFF = 'plaintiff',
  ACCUSED = 'accused',
  COMPLAINANT = 'complainant',
  WITNESS = 'witness',
}

// Case Party interface
export interface CaseParty {
  _id: string;
  case: Case | string;
  partyType: PartyType;
  name: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  advocate?: Advocate | string;
  createdAt: string;
  updatedAt: string;
}

// Hearing status enum
export enum HearingStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  POSTPONED = 'postponed',
  CANCELLED = 'cancelled',
}

// Hearing interface
export interface Hearing {
  _id: string;
  case: Case | string;
  hearingDate: string;
  hearingTime: string;
  courtRoom?: string;
  judge: User | string;
  status: HearingStatus;
  purpose?: string;
  remarks?: string;
  nextHearingDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Document type enum
export enum DocumentType {
  PETITION = 'petition',
  RESPONSE = 'response',
  EVIDENCE = 'evidence',
  ORDER = 'order',
  JUDGMENT = 'judgment',
  NOTICE = 'notice',
  APPLICATION = 'application',
  AFFIDAVIT = 'affidavit',
  OTHER = 'other',
}

// Document interface
export interface Document {
  _id: string;
  case: Case | string;
  hearing?: Hearing | string;
  title: string;
  type: DocumentType;
  fileUrl: string;
  publicId: string;
  fileSize: number;
  mimeType: string;
  isPublic: boolean;
  uploadedBy: User | string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Case Bookmark interface
export interface CaseBookmark {
  _id: string;
  user: User | string;
  case: Case | string;
  notes?: string;
  tags?: string[];
  notifyOnUpdate: boolean;
  createdAt: string;
  updatedAt: string;
}

// Case View interface
export interface CaseView {
  _id: string;
  case: Case | string;
  user?: User | string;
  ipAddress?: string;
  userAgent?: string;
  viewedAt: string;
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Search params
export interface SearchParams extends PaginationParams {
  search?: string;
  filter?: Record<string, unknown>;
}