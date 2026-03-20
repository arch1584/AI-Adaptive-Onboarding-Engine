import { generateText, Output } from 'ai'
import { z } from 'zod'

const skillSchema = z.object({
  name: z.string(),
  category: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  yearsOfExperience: z.number().nullable(),
})

const skillGapSchema = z.object({
  skill: z.string(),
  category: z.string(),
  currentLevel: z.number().min(0).max(4),
  requiredLevel: z.number().min(0).max(4),
  gap: z.number(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
})

const learningModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  duration: z.string(),
  type: z.enum(['course', 'workshop', 'project', 'mentorship', 'reading']),
  skillsCovered: z.array(z.string()),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  status: z.enum(['locked', 'available', 'in-progress', 'completed']),
  order: z.number(),
})

const learningMilestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  modules: z.array(learningModuleSchema),
  estimatedDuration: z.string(),
  skillsGained: z.array(z.string()),
})

const reasoningStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  description: z.string(),
  reasoning: z.string(),
  confidence: z.number().min(0).max(100),
})

const analysisResultSchema = z.object({
  candidateSkills: z.array(skillSchema),
  requiredSkills: z.array(skillSchema),
  skillGaps: z.array(skillGapSchema),
  matchPercentage: z.number(),
  strengths: z.array(z.string()),
  learningPath: z.array(learningMilestoneSchema),
  reasoning: z.array(reasoningStepSchema),
})

export async function POST(request: Request) {
  try {
    const { resumeContent, jobDescriptionContent } = await request.json()

    const prompt = `You are an expert HR analyst and learning pathway designer. Analyze the following resume and job description to create a comprehensive onboarding plan.

RESUME CONTENT:
${resumeContent}

JOB DESCRIPTION:
${jobDescriptionContent}

Analyze both documents and provide:

1. **Candidate Skills**: Extract all skills from the resume with their proficiency levels and categories (Technical, Programming, Framework, Soft Skills, Tools, Database, Cloud, etc.)

2. **Required Skills**: Extract all skills required by the job description with expected proficiency levels

3. **Skill Gaps**: Identify gaps between candidate skills and required skills. Calculate:
   - currentLevel (0-4 scale: 0=none, 1=beginner, 2=intermediate, 3=advanced, 4=expert)
   - requiredLevel (0-4 scale)
   - gap (difference)
   - priority (critical for core job functions, high for important skills, medium for nice-to-have, low for minor gaps)

4. **Match Percentage**: Calculate overall skill match (0-100)

5. **Strengths**: List the candidate's key strengths relevant to the role

6. **Learning Path**: Create a structured learning pathway with 3-5 milestones, each containing 2-4 learning modules. Include various types (course, workshop, project, mentorship, reading). Set realistic durations. The first milestone's first module should be 'available', others 'locked'.

7. **Reasoning Steps**: Provide 4 reasoning steps explaining your analysis:
   - Step 1: Document Analysis - How you parsed and understood both documents
   - Step 2: Skill Extraction - How you identified and categorized skills
   - Step 3: Gap Analysis - How you determined skill gaps and priorities
   - Step 4: Path Generation - How you designed the learning pathway

Each reasoning step should have a confidence score (0-100) based on how clear the information was.`

    const { output } = await generateText({
      model: 'anthropic/claude-sonnet-4.6',
      output: Output.object({ schema: analysisResultSchema }),
      prompt,
    })

    return Response.json({ result: output })
  } catch (error) {
    console.error('Analysis error:', error)
    return Response.json(
      { error: 'Failed to analyze documents' },
      { status: 500 }
    )
  }
}
