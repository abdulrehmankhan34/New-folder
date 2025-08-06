'use client'

import { useMemo } from 'react'
import { CheckCircle, XCircle, AlertCircle, Target } from 'lucide-react'
import { Skill, JobRequirement, SkillGap } from '../types'

interface SkillGapAnalysisProps {
  skills: Skill[]
  jobTitle?: string
}

// Mock job requirements for different roles
const jobRequirements: Record<string, JobRequirement[]> = {
  'Frontend Developer': [
    { id: '1', skill: 'JavaScript', category: 'Programming Language', importance: 'required' },
    { id: '2', skill: 'React', category: 'Framework', importance: 'required' },
    { id: '3', skill: 'HTML', category: 'Technology', importance: 'required' },
    { id: '4', skill: 'CSS', category: 'Technology', importance: 'required' },
    { id: '5', skill: 'TypeScript', category: 'Programming Language', importance: 'preferred' },
    { id: '6', skill: 'Vue.js', category: 'Framework', importance: 'preferred' },
    { id: '7', skill: 'Angular', category: 'Framework', importance: 'nice-to-have' },
    { id: '8', skill: 'SASS', category: 'Technology', importance: 'nice-to-have' },
    { id: '9', skill: 'Git', category: 'Tool', importance: 'required' },
    { id: '10', skill: 'REST API', category: 'Technology', importance: 'preferred' }
  ],
  'Backend Developer': [
    { id: '1', skill: 'Python', category: 'Programming Language', importance: 'required' },
    { id: '2', skill: 'Node.js', category: 'Framework', importance: 'required' },
    { id: '3', skill: 'Java', category: 'Programming Language', importance: 'preferred' },
    { id: '4', skill: 'PostgreSQL', category: 'Technology', importance: 'required' },
    { id: '5', skill: 'MongoDB', category: 'Technology', importance: 'preferred' },
    { id: '6', skill: 'Docker', category: 'Tool', importance: 'preferred' },
    { id: '7', skill: 'AWS', category: 'Platform', importance: 'nice-to-have' },
    { id: '8', skill: 'GraphQL', category: 'Technology', importance: 'nice-to-have' },
    { id: '9', skill: 'Git', category: 'Tool', importance: 'required' },
    { id: '10', skill: 'REST API', category: 'Technology', importance: 'required' }
  ],
  'Full Stack Developer': [
    { id: '1', skill: 'JavaScript', category: 'Programming Language', importance: 'required' },
    { id: '2', skill: 'React', category: 'Framework', importance: 'required' },
    { id: '3', skill: 'Node.js', category: 'Framework', importance: 'required' },
    { id: '4', skill: 'Python', category: 'Programming Language', importance: 'preferred' },
    { id: '5', skill: 'PostgreSQL', category: 'Technology', importance: 'required' },
    { id: '6', skill: 'TypeScript', category: 'Programming Language', importance: 'preferred' },
    { id: '7', skill: 'Docker', category: 'Tool', importance: 'preferred' },
    { id: '8', skill: 'AWS', category: 'Platform', importance: 'nice-to-have' },
    { id: '9', skill: 'Git', category: 'Tool', importance: 'required' },
    { id: '10', skill: 'REST API', category: 'Technology', importance: 'required' }
  ]
}

export default function SkillGapAnalysis({ skills, jobTitle = 'Frontend Developer' }: SkillGapAnalysisProps) {
  const requirements = jobRequirements[jobTitle] || jobRequirements['Frontend Developer']

  const skillGaps = useMemo(() => {
    const userSkillNames = skills.map(s => s.name.toLowerCase())
    
    return requirements.map(req => {
      const isMatched = userSkillNames.some(skillName => 
        skillName.includes(req.skill.toLowerCase()) || 
        req.skill.toLowerCase().includes(skillName)
      )
      
      return {
        skill: req.skill,
        category: req.category,
        importance: req.importance,
        status: isMatched ? 'matched' as const : 'missing' as const
      }
    })
  }, [skills, requirements])

  const matchStats = useMemo(() => {
    const total = skillGaps.length
    const matched = skillGaps.filter(gap => gap.status === 'matched').length
    const required = skillGaps.filter(gap => gap.importance === 'required').length
    const requiredMatched = skillGaps.filter(gap => gap.importance === 'required' && gap.status === 'matched').length
    
    return {
      total,
      matched,
      required,
      requiredMatched,
      overallMatch: Math.round((matched / total) * 100),
      requiredMatch: required > 0 ? Math.round((requiredMatched / required) * 100) : 0
    }
  }, [skillGaps])

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'required': return 'text-red-600 bg-red-50'
      case 'preferred': return 'text-orange-600 bg-orange-50'
      case 'nice-to-have': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'required': return <AlertCircle className="w-4 h-4" />
      case 'preferred': return <Target className="w-4 h-4" />
      case 'nice-to-have': return <CheckCircle className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Skill Gap Analysis</h4>
        <span className="text-sm text-gray-500">{jobTitle}</span>
      </div>

      {/* Match Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{matchStats.overallMatch}%</div>
          <div className="text-sm text-blue-600">Overall Match</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{matchStats.matched}</div>
          <div className="text-sm text-green-600">Skills Matched</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{matchStats.requiredMatch}%</div>
          <div className="text-sm text-orange-600">Required Match</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{skillGaps.filter(g => g.status === 'missing').length}</div>
          <div className="text-sm text-red-600">Missing Skills</div>
        </div>
      </div>

      {/* Skills Breakdown */}
      <div className="space-y-4">
        <h5 className="font-medium text-gray-900">Required Skills</h5>
        <div className="space-y-2">
          {skillGaps.filter(gap => gap.importance === 'required').map((gap, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {gap.status === 'matched' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">{gap.skill}</span>
                <span className="text-sm text-gray-500">({gap.category})</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(gap.importance)}`}>
                Required
              </span>
            </div>
          ))}
        </div>

        <h5 className="font-medium text-gray-900">Preferred Skills</h5>
        <div className="space-y-2">
          {skillGaps.filter(gap => gap.importance === 'preferred').map((gap, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {gap.status === 'matched' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">{gap.skill}</span>
                <span className="text-sm text-gray-500">({gap.category})</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(gap.importance)}`}>
                Preferred
              </span>
            </div>
          ))}
        </div>

        <h5 className="font-medium text-gray-900">Nice to Have</h5>
        <div className="space-y-2">
          {skillGaps.filter(gap => gap.importance === 'nice-to-have').map((gap, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                {gap.status === 'matched' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">{gap.skill}</span>
                <span className="text-sm text-gray-500">({gap.category})</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(gap.importance)}`}>
                Nice to Have
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-3">Legend</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Skill Matched</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span>Skill Missing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-50">Required</span>
            <span>Must have</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-50">Preferred</span>
            <span>Should have</span>
          </div>
        </div>
      </div>
    </div>
  )
} 