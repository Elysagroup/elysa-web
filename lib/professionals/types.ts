import type { ApplicationStatus, ClassProposalStatus } from '@/lib/professionals/constants'

export type StoredFile = {
  originalName: string
  storedName: string
  mimeType: string
  size: number
}

export type PsychologistApplication = {
  id: string
  createdAt: string
  status: ApplicationStatus
  reviewedAt?: string
  reviewNote?: string
  accountId?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  taxCode: string
  vatNumber: string
  city: string
  alboNumber: string
  regionalOrder: string
  alboSection: 'A' | 'B'
  yearsExperience: number
  therapeuticApproach: string
  thematicAreas: string[]
  availabilityDays: string[]
  availabilityNotes: string
  bio: string
  cv: StoredFile
}

export type PsychologistAccount = {
  id: string
  applicationId: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  city: string
  regionalOrder: string
  alboNumber: string
  alboSection: 'A' | 'B'
  yearsExperience: number
  therapeuticApproach: string
  thematicAreas: string[]
  bio: string
  createdAt: string
  mustChangePassword?: boolean
}

export type ClassProposal = {
  id: string
  psychologistId: string
  createdAt: string
  status: ClassProposalStatus
  reviewedAt?: string
  reviewNote?: string
  title: string
  description: string
  thematicArea: string
  targetAudience?: string
  minParticipants: number
  maxParticipants: number
  pricePerParticipant?: number
  totalHours: number
  duration: string
  weeklyFrequency: string
  sessionDays: string[]
  sessionTime: string
  scheduleDetails?: string
  locationType?: 'online' | 'in-person' | 'hybrid'
  materials: StoredFile[]
}

export type ProfessionalsStore = {
  applications: PsychologistApplication[]
  accounts: PsychologistAccount[]
  classProposals: ClassProposal[]
}

export type PublicProfessional = {
  id: string
  firstName: string
  lastName: string
  city: string
  regionalOrder: string
  alboNumber: string
  alboSection: 'A' | 'B'
  yearsExperience: number
  therapeuticApproach: string
  thematicAreas: string[]
  bio: string
  classCount: number
}

export type PublicClass = {
  id: string
  title: string
  description: string
  thematicArea: string
  minParticipants: number
  maxParticipants: number
  totalHours: number
  duration: string
  weeklyFrequency: string
  sessionDays: string[]
  sessionTime: string
}
