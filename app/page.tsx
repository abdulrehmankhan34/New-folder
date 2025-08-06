'use client'

import { useState } from 'react'
import { Upload, FileText, User, Briefcase, Code, TrendingUp, Settings } from 'lucide-react'
import ResumeUpload from './components/ResumeUpload'
import SkillVisualization from './components/SkillVisualization'
import SkillReview from './components/SkillReview'
import SkillGapAnalysis from './components/SkillGapAnalysis'
import ProfileSummary from './components/ProfileSummary'
import { ResumeData, Skill } from './types'

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'analysis' | 'summary'>('upload')
  const [jobTitle, setJobTitle] = useState('Frontend Developer')
  const [currentSkills, setCurrentSkills] = useState<Skill[]>([])

  const handleResumeParsed = (data: ResumeData) => {
    setResumeData(data)
    setCurrentSkills(data.topSkills)
    setCurrentStep('review')
  }

  const handleSkillsUpdate = (skills: Skill[]) => {
    setCurrentSkills(skills)
    if (resumeData) {
      setResumeData({ ...resumeData, topSkills: skills })
    }
  }

  const jobRoles = [
    'Frontend Developer',
    'Backend Developer', 
    'Full Stack Developer'
  ]

  const renderStepContent = () => {
    if (!resumeData) return null

    switch (currentStep) {
      case 'review':
        return (
          <div className="space-y-8">
            <SkillReview 
              skills={currentSkills} 
              onSkillsUpdate={handleSkillsUpdate} 
            />
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('upload')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back to Upload
              </button>
              <button
                onClick={() => setCurrentStep('analysis')}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Continue to Analysis →
              </button>
            </div>
          </div>
        )
      
      case 'analysis':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Job Role Analysis</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Target Role:</span>
                <select
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  {jobRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <SkillGapAnalysis skills={currentSkills} jobTitle={jobTitle} />
            
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('review')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back to Skills Review
              </button>
              <button
                onClick={() => setCurrentStep('summary')}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                View Profile Summary →
              </button>
            </div>
          </div>
        )
      
      case 'summary':
        return (
          <div className="space-y-8">
            <ProfileSummary 
              name={resumeData.name}
              yearsOfExperience={resumeData.yearsOfExperience}
              skills={currentSkills}
              jobTitle={jobTitle}
            />
            
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep('analysis')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back to Analysis
              </button>
              <button
                onClick={() => setCurrentStep('upload')}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Start Over
              </button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resume Parser & Skill Mapper
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and get AI-powered insights about your skills, experience, and career readiness.
          </p>
        </div>

        {/* Progress Steps */}
        {resumeData && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-center">
              {[
                { key: 'upload', label: 'Upload', icon: Upload },
                { key: 'review', label: 'Review Skills', icon: Settings },
                { key: 'analysis', label: 'Gap Analysis', icon: TrendingUp },
                { key: 'summary', label: 'Summary', icon: FileText }
              ].map((step, index) => {
                const Icon = step.icon
                const isActive = currentStep === step.key
                const isCompleted = ['review', 'analysis', 'summary'].includes(step.key) && 
                  ['review', 'analysis', 'summary'].indexOf(step.key) <= 
                  ['review', 'analysis', 'summary'].indexOf(currentStep)
                
                return (
                  <div key={step.key} className="flex items-center">
                    <div className={`flex flex-col items-center ${isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isActive ? 'border-primary-600 bg-primary-50' : 
                        isCompleted ? 'border-green-600 bg-green-50' : 
                        'border-gray-300 bg-gray-50'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs mt-1 font-medium">{step.label}</span>
                    </div>
                    {index < 3 && (
                      <div className={`w-16 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {currentStep === 'upload' ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <Upload className="w-8 h-8 text-primary-600 mr-3" />
                  <h2 className="text-2xl font-semibold text-gray-900">Upload Resume</h2>
                </div>
                <ResumeUpload 
                  onResumeParsed={handleResumeParsed}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </div>

              {/* Results Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-8 h-8 text-primary-600 mr-3" />
                  <h2 className="text-2xl font-semibold text-gray-900">Skill Analysis</h2>
                </div>
                
                {!resumeData && !isLoading && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Upload a resume to see your skill analysis</p>
                  </div>
                )}

                {isLoading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Analyzing your resume...</p>
                  </div>
                )}

                {resumeData && !isLoading && (
                  <div className="space-y-6">
                    {/* Candidate Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <User className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-blue-600">Name</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{resumeData.name}</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Briefcase className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-sm font-medium text-green-600">Experience</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{resumeData.yearsOfExperience} years</p>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Code className="w-5 h-5 text-purple-600 mr-2" />
                          <span className="text-sm font-medium text-purple-600">Top Skills</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{resumeData.topSkills.length}</p>
                      </div>
                    </div>

                    {/* Skills Visualization */}
                    <SkillVisualization skills={resumeData.topSkills} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {renderStepContent()}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-center mb-8 text-gray-900">
            What We Extract
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <User className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Candidate Name</h4>
              <p className="text-gray-600">Extract the full name from your resume</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <Code className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Technical Skills</h4>
              <p className="text-gray-600">Identify your top 3 technical skills</p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <Briefcase className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">Experience</h4>
              <p className="text-gray-600">Estimate your total years of experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 