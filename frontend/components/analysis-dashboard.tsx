'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, XCircle, TrendingUp, Award } from 'lucide-react'
import type { AnalysisResult, Skill } from '@/lib/types'

interface AnalysisDashboardProps {
  result: AnalysisResult
}

const levelToNumber = (level: Skill['level']): number => {
  switch (level) {
    case 'beginner': return 25
    case 'intermediate': return 50
    case 'advanced': return 75
    case 'expert': return 100
    default: return 0
  }
}

const categoryColors: Record<string, string> = {
  'Technical': 'bg-chart-1/20 text-chart-1 border-chart-1/30',
  'Programming': 'bg-chart-2/20 text-chart-2 border-chart-2/30',
  'Framework': 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  'Soft Skills': 'bg-chart-4/20 text-chart-4 border-chart-4/30',
  'Tools': 'bg-chart-5/20 text-chart-5 border-chart-5/30',
  'Database': 'bg-primary/20 text-primary border-primary/30',
  'Cloud': 'bg-accent/20 text-accent border-accent/30',
}

function SkillCard({ skill, showLevel = true }: { skill: Skill; showLevel?: boolean }) {
  const categoryColor = categoryColors[skill.category] || 'bg-secondary text-secondary-foreground border-border'
  
  return (
    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/50">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className={categoryColor}>
          {skill.category}
        </Badge>
        <span className="font-medium text-sm">{skill.name}</span>
      </div>
      {showLevel && (
        <div className="flex items-center gap-2">
          <Progress value={levelToNumber(skill.level)} className="w-20 h-2" />
          <span className="text-xs text-muted-foreground capitalize w-20">{skill.level}</span>
        </div>
      )}
    </div>
  )
}

export function AnalysisDashboard({ result }: AnalysisDashboardProps) {
  const { candidateSkills, requiredSkills, matchPercentage, strengths } = result

  // Group skills by category
  const groupedCandidateSkills = candidateSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  const groupedRequiredSkills = requiredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  // Find matching and missing skills
  const candidateSkillNames = new Set(candidateSkills.map(s => s.name.toLowerCase()))
  const matchingSkills = requiredSkills.filter(s => candidateSkillNames.has(s.name.toLowerCase()))
  const missingSkills = requiredSkills.filter(s => !candidateSkillNames.has(s.name.toLowerCase()))

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Analysis Dashboard</h2>
        <p className="text-muted-foreground">
          Intelligent parsing results showing extracted skills from both documents
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{matchPercentage}%</p>
                <p className="text-xs text-muted-foreground">Skill Match</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{matchingSkills.length}</p>
                <p className="text-xs text-muted-foreground">Matching Skills</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{missingSkills.length}</p>
                <p className="text-xs text-muted-foreground">Skills to Learn</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-3/10 rounded-lg">
                <Award className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <p className="text-2xl font-bold">{strengths.length}</p>
                <p className="text-xs text-muted-foreground">Key Strengths</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths Section */}
      {strengths.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-chart-3" />
              Key Strengths
            </CardTitle>
            <CardDescription>Areas where the candidate excels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {strengths.map((strength, index) => (
                <Badge key={index} variant="secondary" className="bg-chart-3/10 text-chart-3 border-chart-3/30">
                  {strength}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills Comparison Tabs */}
      <Tabs defaultValue="candidate" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="candidate">Candidate Skills ({candidateSkills.length})</TabsTrigger>
          <TabsTrigger value="required">Required Skills ({requiredSkills.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="candidate" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Extracted from Resume</CardTitle>
              <CardDescription>Skills identified in the candidate&apos;s resume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedCandidateSkills).map(([category, skills]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                    <div className="grid gap-2">
                      {skills.map((skill, index) => (
                        <SkillCard key={index} skill={skill} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="required" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Extracted from Job Description</CardTitle>
              <CardDescription>Skills required for the target role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedRequiredSkills).map(([category, skills]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                    <div className="grid gap-2">
                      {skills.map((skill, index) => (
                        <SkillCard key={index} skill={skill} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
