'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  BookOpen,
  Users,
  Code,
  FileText,
  Video,
  ChevronDown,
  ChevronRight,
  Lock,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LearningMilestone, LearningModule } from '@/lib/types'

interface LearningRoadmapProps {
  learningPath: LearningMilestone[]
}

const moduleTypeIcons = {
  course: BookOpen,
  workshop: Users,
  project: Code,
  mentorship: Users,
  reading: FileText,
}

const moduleTypeColors = {
  course: 'bg-chart-1/10 text-chart-1',
  workshop: 'bg-chart-2/10 text-chart-2',
  project: 'bg-chart-3/10 text-chart-3',
  mentorship: 'bg-chart-4/10 text-chart-4',
  reading: 'bg-accent/10 text-accent',
}

const statusIcons = {
  locked: Lock,
  available: Play,
  'in-progress': Video,
  completed: CheckCircle2,
}

const statusColors = {
  locked: 'text-muted-foreground',
  available: 'text-primary',
  'in-progress': 'text-chart-3',
  completed: 'text-accent',
}

function ModuleCard({ module }: { module: LearningModule }) {
  const TypeIcon = moduleTypeIcons[module.type]
  const StatusIcon = statusIcons[module.status]
  const isLocked = module.status === 'locked'

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-lg border transition-all',
        isLocked
          ? 'bg-secondary/30 border-border/50 opacity-60'
          : 'bg-secondary/50 border-border hover:border-primary/50 hover:bg-secondary'
      )}
    >
      <div className={cn('p-2 rounded-lg', moduleTypeColors[module.type])}>
        <TypeIcon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium text-sm">{module.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{module.description}</p>
          </div>
          <StatusIcon className={cn('h-5 w-5 shrink-0', statusColors[module.status])} />
        </div>
        <div className="flex items-center gap-3 mt-3">
          <Badge variant="outline" className="text-xs">
            {module.type}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {module.duration}
          </span>
          <span className="text-xs text-muted-foreground capitalize">{module.difficulty}</span>
        </div>
        {module.skillsCovered.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {module.skillsCovered.map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs py-0">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MilestoneCard({
  milestone,
  index,
  isLast,
}: {
  milestone: LearningMilestone
  index: number
  isLast: boolean
}) {
  const [isOpen, setIsOpen] = useState(index === 0)
  const completedModules = milestone.modules.filter((m) => m.status === 'completed').length
  const progress = (completedModules / milestone.modules.length) * 100

  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-border" />
      )}

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className={cn('relative', isOpen && 'ring-1 ring-primary/20')}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-secondary/30 transition-colors rounded-t-lg">
              <div className="flex items-start gap-4">
                {/* Milestone number */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{milestone.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{milestone.estimatedDuration}</span>
                      {isOpen ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <CardDescription className="mt-1">{milestone.description}</CardDescription>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex-1 max-w-xs">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{completedModules}/{milestone.modules.length} modules</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {milestone.skillsGained.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {milestone.skillsGained.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{milestone.skillsGained.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3 mt-2">
                {milestone.modules.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}

export function LearningRoadmap({ learningPath }: LearningRoadmapProps) {
  const totalModules = learningPath.reduce((acc, m) => acc + m.modules.length, 0)
  const completedModules = learningPath.reduce(
    (acc, m) => acc + m.modules.filter((mod) => mod.status === 'completed').length,
    0
  )
  const overallProgress = totalModules > 0 ? (completedModules / totalModules) * 100 : 0

  // Calculate total estimated time
  const estimatedHours = learningPath.reduce((acc, m) => {
    const hours = parseInt(m.estimatedDuration) || 0
    return acc + hours
  }, 0)

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Interactive Learning Roadmap</h2>
        <p className="text-muted-foreground">
          A personalized, step-by-step training pathway to bridge skill gaps
        </p>
      </div>

      {/* Overview Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold">Your Learning Journey</h3>
              <p className="text-sm text-muted-foreground">
                {learningPath.length} milestones with {totalModules} learning modules
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{Math.round(overallProgress)}%</p>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{estimatedHours}h</p>
                <p className="text-xs text-muted-foreground">Est. Time</p>
              </div>
              <Button className="gap-2">
                Continue Learning <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={overallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <div className="space-y-6">
        {learningPath.map((milestone, index) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            index={index}
            isLast={index === learningPath.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
