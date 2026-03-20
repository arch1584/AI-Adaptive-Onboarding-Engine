'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { DocumentUploadZone } from '@/components/document-upload-zone'
import { AnalysisDashboard } from '@/components/analysis-dashboard'
import { SkillGapVisualization } from '@/components/skill-gap-visualization'
import { LearningRoadmap } from '@/components/learning-roadmap'
import { ReasoningTracePanel } from '@/components/reasoning-trace-panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Upload,
  BarChart3,
  Target,
  Map,
  BrainCircuit,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import type { AnalysisResult, UploadedDocument } from '@/lib/types'

type AnalysisStep = 'upload' | 'analyzing' | 'complete'

export default function Home() {
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep>('upload')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleDocumentsReady = async (
    resume: UploadedDocument,
    jobDescription: UploadedDocument
  ) => {
    setAnalysisStep('analyzing')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent: resume.content,
          jobDescriptionContent: jobDescription.content,
        }),
      })

      if (!response.ok) throw new Error('Analysis failed')

      const data = await response.json()
      setResult(data.result)
      setAnalysisStep('complete')
      setActiveTab('dashboard')
    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysisStep('upload')
    }
  }

  const steps = [
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'analyzing', label: 'Analyzing', icon: Sparkles },
    { id: 'complete', label: 'Complete', icon: CheckCircle2 },
  ]

  const getStepStatus = (stepId: string) => {
    const stepOrder = ['upload', 'analyzing', 'complete']
    const currentIndex = stepOrder.indexOf(analysisStep)
    const stepIndex = stepOrder.indexOf(stepId)

    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'upcoming'
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-6">
          <Badge variant="outline" className="px-4 py-1">
            AI-Powered Onboarding
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            Transform Hiring into{' '}
            <span className="text-primary">Personalized Growth</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Upload a resume and job description to instantly generate skill gap analysis
            and a customized learning roadmap for new hires.
          </p>
        </section>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 py-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id)
            const Icon = step.icon
            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                      status === 'completed'
                        ? 'bg-accent text-accent-foreground'
                        : status === 'current'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground'
                    }`}
                  >
                    {status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : status === 'current' && step.id === 'analyzing' ? (
                      <Sparkles className="h-5 w-5 animate-pulse" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      status === 'upcoming' ? 'text-muted-foreground' : ''
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 ${
                      getStepStatus(steps[index + 1].id) !== 'upcoming'
                        ? 'bg-primary'
                        : 'bg-border'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Main Content */}
        {analysisStep === 'upload' || analysisStep === 'analyzing' ? (
          <DocumentUploadZone
            onDocumentsReady={handleDocumentsReady}
            isAnalyzing={analysisStep === 'analyzing'}
          />
        ) : result ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
              <TabsTrigger value="dashboard" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="gaps" className="gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Skill Gaps</span>
              </TabsTrigger>
              <TabsTrigger value="roadmap" className="gap-2">
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">Roadmap</span>
              </TabsTrigger>
              <TabsTrigger value="reasoning" className="gap-2">
                <BrainCircuit className="h-4 w-4" />
                <span className="hidden sm:inline">Reasoning</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <AnalysisDashboard result={result} />
            </TabsContent>

            <TabsContent value="gaps">
              <SkillGapVisualization skillGaps={result.skillGaps} />
            </TabsContent>

            <TabsContent value="roadmap">
              <LearningRoadmap learningPath={result.learningPath} />
            </TabsContent>

            <TabsContent value="reasoning">
              <ReasoningTracePanel reasoning={result.reasoning} />
            </TabsContent>
          </Tabs>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>OnboardAI - AI-Adaptive Onboarding Engine</p>
            <p>Powered by advanced AI for intelligent skill analysis</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
