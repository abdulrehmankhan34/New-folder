export interface ResumeData {
  name: string
  yearsOfExperience: number
  topSkills: Skill[]
}

export interface Skill {
  name: string
  confidence: number
  category: string
}

export interface ParsedResumeResponse {
  name: string
  yearsOfExperience: number
  topSkills: {
    name: string
    confidence: number
    category: string
  }[]
}

export interface UploadResponse {
  success: boolean
  data?: ParsedResumeResponse
  error?: string
}

export interface JobRequirement {
  id: string
  skill: string
  category: string
  importance: 'required' | 'preferred' | 'nice-to-have'
}

export interface SkillGap {
  skill: string
  category: string
  importance: 'required' | 'preferred' | 'nice-to-have'
  status: 'missing' | 'matched'
}

export interface ProfileSummary {
  name: string
  yearsOfExperience: number
  skills: Skill[]
  skillGaps: SkillGap[]
  recommendations: string[]
  overallMatch: number
} 