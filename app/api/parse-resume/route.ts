import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import pdf from 'pdf-parse'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    console.log('API route called')
    
    const formData = await request.formData()
    const file = formData.get('resume') as File

    if (!file) {
      console.log('No file provided')
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('File received:', file.name, file.size, file.type)

    // Validate file type
    if (file.type !== 'application/pdf') {
      console.log('Invalid file type:', file.type)
      return NextResponse.json(
        { success: false, error: 'Only PDF files are supported' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('File converted to buffer, size:', buffer.length)

    // Parse PDF content
    const pdfData = await pdf(buffer)
    const resumeText = pdfData.text
    console.log('PDF parsed, text length:', resumeText.length)

    if (!resumeText || resumeText.trim().length === 0) {
      console.log('No text extracted from PDF')
      return NextResponse.json(
        { success: false, error: 'Could not extract text from PDF' },
        { status: 400 }
      )
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not configured')
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    console.log('Calling OpenAI API...')

    // Use OpenAI to extract information
    const prompt = `
    Please analyze the following resume and extract the following information in JSON format:
    
    1. Full name of the candidate
    2. Top 3 technical skills (with confidence scores between 0 and 1)
    3. Estimated total years of experience
    
    Resume text:
    ${resumeText.substring(0, 4000)} // Limit to first 4000 characters
    
    Please respond with a JSON object in this exact format:
    {
      "name": "Full Name",
      "yearsOfExperience": number,
      "topSkills": [
        {
          "name": "Skill Name",
          "confidence": 0.95,
          "category": "Programming Language" or "Framework" or "Tool" or "Technology"
        }
      ]
    }
    
    Only return the JSON object, no additional text.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a resume parsing assistant. Extract structured information from resumes and return it in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 500,
    })

    const responseText = completion.choices[0]?.message?.content
    console.log('OpenAI response received:', responseText?.substring(0, 100))

    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let parsedData
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0])
        console.log('Parsed data:', parsedData)
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText)
      throw new Error('Failed to parse AI response')
    }

    // Validate the parsed data
    if (!parsedData.name || !parsedData.yearsOfExperience || !parsedData.topSkills) {
      throw new Error('Incomplete data from AI analysis')
    }

    // Ensure topSkills is an array with at most 3 items
    if (!Array.isArray(parsedData.topSkills)) {
      parsedData.topSkills = []
    }
    
    // Limit to top 3 skills
    parsedData.topSkills = parsedData.topSkills.slice(0, 3)

    // Ensure each skill has required properties
    parsedData.topSkills = parsedData.topSkills.map((skill: any) => ({
      name: skill.name || 'Unknown Skill',
      confidence: Math.min(Math.max(skill.confidence || 0.5, 0), 1),
      category: skill.category || 'Technology'
    }))

    console.log('Returning successful response')
    return NextResponse.json({
      success: true,
      data: {
        name: parsedData.name,
        yearsOfExperience: Math.max(0, Math.round(parsedData.yearsOfExperience)),
        topSkills: parsedData.topSkills
      }
    })

  } catch (error) {
    console.error('Error parsing resume:', error)
    
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { success: false, error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to parse resume' },
      { status: 500 }
    )
  }
} 