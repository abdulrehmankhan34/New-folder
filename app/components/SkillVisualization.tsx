'use client'

import { Skill } from '../types'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface SkillVisualizationProps {
  skills: Skill[]
}

export default function SkillVisualization({ skills }: SkillVisualizationProps) {
  const chartData = {
    labels: skills.map(skill => skill.name),
    datasets: [
      {
        label: 'Skill Confidence',
        data: skills.map(skill => skill.confidence * 100),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value: any) {
            return value + '%'
          }
        }
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* Skills List */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Technical Skills</h4>
        <div className="space-y-3">
          {skills.map((skill, index) => (
            <div key={skill.name} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{skill.name}</span>
                <span className="text-sm text-gray-600">{skill.category}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${skill.confidence * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">Confidence</span>
                <span className="text-xs font-medium text-gray-700">
                  {Math.round(skill.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Visualization */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Skill Confidence Chart</h4>
        <div className="bg-white rounded-lg p-4 border">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Skill Categories */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Skill Categories</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from(new Set(skills.map(skill => skill.category))).map(category => {
            const categorySkills = skills.filter(skill => skill.category === category)
            const avgConfidence = categorySkills.reduce((sum, skill) => sum + skill.confidence, 0) / categorySkills.length
            
            return (
              <div key={category} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                <h5 className="font-medium text-purple-900 mb-2">{category}</h5>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-700">
                    {categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-sm font-medium text-purple-900">
                    {Math.round(avgConfidence * 100)}% avg
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 