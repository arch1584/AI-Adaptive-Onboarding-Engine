export interface Skill {
  name: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  yearsOfExperience?: number
}

export interface SkillGap {
  skill: string
  category: string
  currentLevel: number
  requiredLevel: number
  gap: number
  priority: 'critical' | 'high' | 'medium' | 'low'
}

export interface LearningModule {
  id: string
  title: string
  description: string
  duration: string
  type: 'course' | 'workshop' | 'project' | 'mentorship' | 'reading'
  skillsCovered: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  status: 'locked' | 'available' | 'in-progress' | 'completed'
  order: number
}

export interface LearningMilestone {
  id: string
  title: string
  description: string
  modules: LearningModule[]
  estimatedDuration: string
  skillsGained: string[]
}

export interface AnalysisResult {
  candidateSkills: Skill[]
  requiredSkills: Skill[]
  skillGaps: SkillGap[]
  matchPercentage: number
  strengths: string[]
  learningPath: LearningMilestone[]
  reasoning: ReasoningStep[]
}

export interface ReasoningStep {
  step: number
  title: string
  description: string
  reasoning: string
  confidence: number
}

export interface UploadedDocument {
  name: string
  type: 'resume' | 'job-description'
  content: string
  uploadedAt: Date
}
