'use client'

import { useMemo } from 'react'
import { User, Briefcase, Code, TrendingUp, Lightbulb, Target, Award, Clock } from 'lucide-react'
import { ProfileSummary as ProfileSummaryType, Skill } from '../types'

interface ProfileSummaryProps {
  name: string
  yearsOfExperience: number
  skills: Skill[]
  jobTitle?: string
}

export default function ProfileSummary({ name, yearsOfExperience, skills, jobTitle = 'Frontend Developer' }: ProfileSummaryProps) {
  const profileSummary = useMemo(() => {
    const skillCategories = skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const avgConfidence = skills.reduce((sum, skill) => sum + skill.confidence, 0) / skills.length
    const topSkill = skills.reduce((max, skill) => skill.confidence > max.confidence ? skill : max, skills[0])

    // Generate recommendations based on profile
    const recommendations: string[] = []
    
    if (yearsOfExperience < 2) {
      recommendations.push('Consider gaining more hands-on experience through personal projects or internships')
    }
    
    if (avgConfidence < 0.7) {
      recommendations.push('Focus on building confidence in your core skills through practice and projects')
    }
    
    if (skills.length < 5) {
      recommendations.push('Expand your skill set by learning complementary technologies')
    }
    
    if (!skills.some(s => s.category === 'Framework')) {
      recommendations.push('Learn a popular framework to enhance your development capabilities')
    }
    
    if (!skills.some(s => s.category === 'Tool')) {
      recommendations.push('Familiarize yourself with essential development tools like Git and Docker')
    }

    // Add role-specific recommendations
    if (jobTitle === 'Frontend Developer') {
      if (!skills.some(s => s.name.toLowerCase().includes('react') || s.name.toLowerCase().includes('vue') || s.name.toLowerCase().includes('angular'))) {
        recommendations.push('Learn a modern JavaScript framework like React, Vue, or Angular')
      }
      if (!skills.some(s => s.name.toLowerCase().includes('css') || s.name.toLowerCase().includes('sass'))) {
        recommendations.push('Strengthen your CSS skills and learn preprocessors like SASS')
      }
    } else if (jobTitle === 'Backend Developer') {
      if (!skills.some(s => s.name.toLowerCase().includes('python') || s.name.toLowerCase().includes('java') || s.name.toLowerCase().includes('node'))) {
        recommendations.push('Master a backend programming language like Python, Java, or Node.js')
      }
      if (!skills.some(s => s.name.toLowerCase().includes('database') || s.name.toLowerCase().includes('sql'))) {
        recommendations.push('Learn database technologies and SQL')
      }
    }

    return {
      skillCategories,
      avgConfidence,
      topSkill,
      recommendations: recommendations.slice(0, 5) // Limit to 5 recommendations
    }
  }, [skills, yearsOfExperience, jobTitle])

  const getExperienceLevel = (years: number) => {
    if (years < 1) return { level: 'Junior', color: 'text-blue-600', bg: 'bg-blue-50' }
    if (years < 3) return { level: 'Mid-level', color: 'text-green-600', bg: 'bg-green-50' }
    if (years < 7) return { level: 'Senior', color: 'text-orange-600', bg: 'bg-orange-50' }
    return { level: 'Expert', color: 'text-purple-600', bg: 'bg-purple-50' }
  }

  const experienceLevel = getExperienceLevel(yearsOfExperience)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Profile Summary</h4>
        <Award className="w-5 h-5 text-gray-500" />
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <User className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-600">Name</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{name}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Briefcase className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-600">Experience</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{yearsOfExperience} years</p>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${experienceLevel.color} ${experienceLevel.bg}`}>
            {experienceLevel.level}
          </span>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Code className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-600">Skills</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{skills.length} skills</p>
          <span className="text-xs text-gray-500">Avg confidence: {Math.round(profileSummary.avgConfidence * 100)}%</span>
        </div>
      </div>

      {/* Skill Categories */}
      <div className="bg-white rounded-lg p-4 border">
        <h5 className="font-medium text-gray-900 mb-3">Skill Categories</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(profileSummary.skillCategories).map(([category, count]) => (
            <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold text-gray-900">{count}</div>
              <div className="text-xs text-gray-600">{category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Skill Highlight */}
      {profileSummary.topSkill && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900 mb-1">Top Skill</h5>
              <p className="text-lg font-semibold text-gray-900">{profileSummary.topSkill.name}</p>
              <p className="text-sm text-gray-600">{profileSummary.topSkill.category}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(profileSummary.topSkill.confidence * 100)}%
              </div>
              <div className="text-xs text-gray-500">Confidence</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
        <div className="flex items-center mb-4">
          <Lightbulb className="w-5 h-5 text-indigo-600 mr-2" />
          <h5 className="font-medium text-gray-900">Recommendations for Improvement</h5>
        </div>
        
        {profileSummary.recommendations.length > 0 ? (
          <div className="space-y-3">
            {profileSummary.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">{recommendation}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">Great job! Your profile looks well-rounded for this role.</p>
        )}
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-lg p-4 border">
        <h5 className="font-medium text-gray-900 mb-3">Next Steps</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Target className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Focus on missing skills</p>
              <p className="text-xs text-gray-600">Prioritize required skills for {jobTitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Build projects</p>
              <p className="text-xs text-gray-600">Apply your skills in real-world scenarios</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Practice regularly</p>
              <p className="text-xs text-gray-600">Consistent practice improves confidence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Award className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Get certifications</p>
              <p className="text-xs text-gray-600">Validate your skills with credentials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 