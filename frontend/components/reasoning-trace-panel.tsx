'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Target,
  Zap,
  Info,
  Eye,
  EyeOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReasoningStep } from '@/lib/types'

interface ReasoningTracePanelProps {
  reasoning: ReasoningStep[]
}

function ReasoningStepCard({ step, index }: { step: ReasoningStep; index: number }) {
  const [isExpanded, setIsExpanded] = useState(index === 0)

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return Target
      case 2:
        return BrainCircuit
      case 3:
        return Lightbulb
      case 4:
        return Zap
      default:
        return Info
    }
  }

  const Icon = getStepIcon(step.step)
  const confidenceColor =
    step.confidence >= 90
      ? 'text-accent'
      : step.confidence >= 70
      ? 'text-chart-3'
      : step.confidence >= 50
      ? 'text-chart-4'
      : 'text-destructive'

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card className={cn('transition-all', isExpanded && 'ring-1 ring-primary/20')}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-secondary/30 transition-colors rounded-t-lg py-4">
            <div className="flex items-center gap-4">
              {/* Step indicator */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Step {step.step}
                    </Badge>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <p className={cn('text-sm font-medium', confidenceColor)}>{step.confidence}%</p>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <CardDescription className="mt-1 line-clamp-1">{step.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="pl-14 space-y-4">
              {/* Confidence bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">AI Confidence Level</span>
                  <span className={cn('font-medium', confidenceColor)}>{step.confidence}%</span>
                </div>
                <Progress value={step.confidence} className="h-2" />
              </div>

              {/* Reasoning explanation */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-primary" />
                  Why this decision?
                </h4>
                <div className="p-4 bg-secondary/50 rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.reasoning}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

export function ReasoningTracePanel({ reasoning }: ReasoningTracePanelProps) {
  const [showPanel, setShowPanel] = useState(true)
  const averageConfidence = Math.round(
    reasoning.reduce((acc, r) => acc + r.confidence, 0) / reasoning.length
  )

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            Reasoning Trace
          </h2>
          <p className="text-muted-foreground">
            Transparent AI explanations for every recommendation made
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="show-reasoning" checked={showPanel} onCheckedChange={setShowPanel} />
          <Label htmlFor="show-reasoning" className="flex items-center gap-2 cursor-pointer">
            {showPanel ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span className="text-sm">{showPanel ? 'Hide' : 'Show'} Details</span>
          </Label>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">AI Analysis Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {reasoning.length} reasoning steps performed with {averageConfidence}% average confidence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{reasoning.length}</p>
                <p className="text-xs text-muted-foreground">Steps</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{averageConfidence}%</p>
                <p className="text-xs text-muted-foreground">Avg. Confidence</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reasoning Steps */}
      {showPanel && (
        <div className="space-y-4">
          {reasoning.map((step, index) => (
            <ReasoningStepCard key={step.step} step={step} index={index} />
          ))}
        </div>
      )}

      {/* Why This Matters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Why Transparency Matters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                title: 'Trust',
                description: 'Understanding AI decisions builds confidence in the recommendations.',
              },
              {
                title: 'Validation',
                description: 'HR teams can verify that the analysis aligns with organizational needs.',
              },
              {
                title: 'Improvement',
                description: 'Feedback on reasoning helps refine and improve future analyses.',
              },
            ].map((item) => (
              <div key={item.title} className="p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-medium text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
