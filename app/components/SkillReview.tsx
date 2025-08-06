'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Edit3 } from 'lucide-react'
import { Skill } from '../types'

interface SkillReviewProps {
  skills: Skill[]
  onSkillsUpdate: (skills: Skill[]) => void
}

const commonSkills = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
  'React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
  'HTML', 'CSS', 'SASS', 'TypeScript', 'GraphQL', 'REST API', 'MongoDB', 'PostgreSQL',
  'MySQL', 'Redis', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Jenkins', 'Jira',
  'Machine Learning', 'Data Science', 'DevOps', 'Agile', 'Scrum', 'CI/CD'
]

export default function SkillReview({ skills, onSkillsUpdate }: SkillReviewProps) {
  const [editingSkills, setEditingSkills] = useState<Skill[]>(skills)
  const [newSkill, setNewSkill] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    setEditingSkills(skills)
  }, [skills])

  const handleSkillUpdate = (index: number, field: keyof Skill, value: string | number) => {
    const updatedSkills = [...editingSkills]
    updatedSkills[index] = { ...updatedSkills[index], [field]: value }
    setEditingSkills(updatedSkills)
    onSkillsUpdate(updatedSkills)
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !editingSkills.find(s => s.name.toLowerCase() === newSkill.toLowerCase())) {
      const skill: Skill = {
        name: newSkill.trim(),
        confidence: 0.8,
        category: 'Technology'
      }
      const updatedSkills = [...editingSkills, skill]
      setEditingSkills(updatedSkills)
      onSkillsUpdate(updatedSkills)
      setNewSkill('')
      setShowSuggestions(false)
    }
  }

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = editingSkills.filter((_, i) => i !== index)
    setEditingSkills(updatedSkills)
    onSkillsUpdate(updatedSkills)
  }

  const handleInputChange = (value: string) => {
    setNewSkill(value)
    if (value.trim()) {
      const filtered = commonSkills.filter(skill =>
        skill.toLowerCase().includes(value.toLowerCase()) &&
        !editingSkills.find(s => s.name.toLowerCase() === skill.toLowerCase())
      )
      setSuggestions(filtered.slice(0, 5))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setNewSkill(suggestion)
    setShowSuggestions(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Review & Edit Skills</h4>
        <Edit3 className="w-5 h-5 text-gray-500" />
      </div>

      {/* Existing Skills */}
      <div className="space-y-3">
        {editingSkills.map((skill, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => handleSkillUpdate(index, 'name', e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm font-medium"
              />
              <button
                onClick={() => handleRemoveSkill(index)}
                className="ml-2 p-1 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Confidence</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={skill.confidence}
                  onChange={(e) => handleSkillUpdate(index, 'confidence', parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{Math.round(skill.confidence * 100)}%</span>
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Category</label>
                <select
                  value={skill.category}
                  onChange={(e) => handleSkillUpdate(index, 'category', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="Programming Language">Programming Language</option>
                  <option value="Framework">Framework</option>
                  <option value="Tool">Tool</option>
                  <option value="Technology">Technology</option>
                  <option value="Platform">Platform</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Skill */}
      <div className="border-t pt-4">
        <h5 className="text-sm font-medium text-gray-900 mb-3">Add New Skill</h5>
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a skill name..."
                className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2">Tips:</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Edit skill names, confidence levels, and categories</li>
          <li>• Add new skills using the auto-suggest feature</li>
          <li>• Remove skills that don't apply to you</li>
          <li>• Ensure your top skills are accurately represented</li>
        </ul>
      </div>
    </div>
  )
} 