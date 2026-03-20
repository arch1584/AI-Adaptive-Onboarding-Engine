'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Target, TrendingDown } from 'lucide-react'
import type { SkillGap } from '@/lib/types'

interface SkillGapVisualizationProps {
  skillGaps: SkillGap[]
}

const priorityColors = {
  critical: 'bg-destructive/20 text-destructive border-destructive/30',
  high: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  medium: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
  low: 'bg-accent/20 text-accent border-accent/30',
}

const priorityIcons = {
  critical: AlertTriangle,
  high: Target,
  medium: TrendingDown,
  low: TrendingDown,
}

export function SkillGapVisualization({ skillGaps }: SkillGapVisualizationProps) {
  // Prepare data for bar chart
  const barChartData = skillGaps.map((gap) => ({
    skill: gap.skill.length > 12 ? gap.skill.slice(0, 12) + '...' : gap.skill,
    fullName: gap.skill,
    current: gap.currentLevel * 25,
    required: gap.requiredLevel * 25,
    gap: gap.gap * 25,
  }))

  // Prepare data for radar chart (top 6 skills)
  const radarData = skillGaps.slice(0, 6).map((gap) => ({
    skill: gap.skill.length > 10 ? gap.skill.slice(0, 10) + '...' : gap.skill,
    current: gap.currentLevel * 25,
    required: gap.requiredLevel * 25,
  }))

  // Group gaps by priority
  const criticalGaps = skillGaps.filter((g) => g.priority === 'critical')
  const highGaps = skillGaps.filter((g) => g.priority === 'high')
  const mediumGaps = skillGaps.filter((g) => g.priority === 'medium')
  const lowGaps = skillGaps.filter((g) => g.priority === 'low')

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Skill Gap Analysis</h2>
        <p className="text-muted-foreground">
          Visual comparison highlighting the specific skill gaps identified
        </p>
      </div>

      {/* Priority Summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Critical', count: criticalGaps.length, priority: 'critical' as const },
          { label: 'High Priority', count: highGaps.length, priority: 'high' as const },
          { label: 'Medium Priority', count: mediumGaps.length, priority: 'medium' as const },
          { label: 'Low Priority', count: lowGaps.length, priority: 'low' as const },
        ].map(({ label, count, priority }) => {
          const Icon = priorityIcons[priority]
          return (
            <Card key={priority}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${priorityColors[priority].split(' ')[0]}`}>
                    <Icon className={`h-5 w-5 ${priorityColors[priority].split(' ')[1]}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="bar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="radar">Radar View</TabsTrigger>
          <TabsTrigger value="list">Detailed List</TabsTrigger>
        </TabsList>

        <TabsContent value="bar">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Current vs Required Skills</CardTitle>
              <CardDescription>
                Comparison of candidate&apos;s current skill levels against job requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                    <YAxis
                      dataKey="skill"
                      type="category"
                      width={100}
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      formatter={(value: number, name: string) => [
                        `${value}%`,
                        name === 'current' ? 'Current Level' : 'Required Level',
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="current"
                      name="Current Level"
                      fill="hsl(var(--chart-2))"
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar
                      dataKey="required"
                      name="Required Level"
                      fill="hsl(var(--chart-1))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Skill Radar Comparison</CardTitle>
              <CardDescription>
                Holistic view of top 6 skill gaps in a radar format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Radar
                      name="Current Level"
                      dataKey="current"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Required Level"
                      dataKey="required"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.3}
                    />
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Detailed Skill Gap Breakdown</CardTitle>
              <CardDescription>Complete list of all identified skill gaps with priority levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {skillGaps.map((gap, index) => {
                  const Icon = priorityIcons[gap.priority]
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border/50"
                    >
                      <div className="flex items-center gap-4">
                        <Icon className={`h-5 w-5 ${priorityColors[gap.priority].split(' ')[1]}`} />
                        <div>
                          <p className="font-medium">{gap.skill}</p>
                          <p className="text-sm text-muted-foreground">{gap.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Current: </span>
                            <span className="font-medium">{gap.currentLevel}/4</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-muted-foreground">Required: </span>
                            <span className="font-medium">{gap.requiredLevel}/4</span>
                          </p>
                        </div>
                        <Badge variant="outline" className={priorityColors[gap.priority]}>
                          {gap.priority}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
