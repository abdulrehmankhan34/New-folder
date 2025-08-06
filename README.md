# Resume Parser & Skill Mapper

A modern web application that allows job seekers to upload their resumes and get AI-powered insights about their skills, experience, and career readiness.

## Features

- **PDF Resume Upload**: Drag-and-drop or click-to-upload PDF resumes
- **AI-Powered Analysis**: Uses OpenAI GPT-4 to extract key information
- **Skill Extraction**: Identifies top 3 technical skills with confidence scores
- **Experience Estimation**: Calculates total years of experience
- **Visual Analytics**: Beautiful charts and progress bars for skill visualization
- **Modern UI**: Responsive design with Tailwind CSS

## What We Extract

1. **Candidate Name**: Full name from the resume
2. **Top 3 Technical Skills**: Most prominent technical skills with confidence scores
3. **Years of Experience**: Estimated total professional experience

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4 API
- **PDF Parsing**: pdf-parse library

## Prerequisites

- Node.js 18+ 
- OpenAI API key (paid access required)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-parser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   Get your OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Upload Resume**: Drag and drop a PDF resume or click to browse
2. **Wait for Analysis**: The AI will process your resume (usually takes 10-30 seconds)
3. **View Results**: See your extracted information and skill visualizations

## API Endpoints

- `POST /api/parse-resume`: Parses uploaded PDF resume using OpenAI

## File Structure

```
├── app/
│   ├── api/
│   │   └── parse-resume/
│   │       └── route.ts          # API endpoint for resume parsing
│   ├── components/
│   │   ├── ResumeUpload.tsx      # File upload component
│   │   └── SkillVisualization.tsx # Charts and skill display
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page component
│   └── types.ts                  # TypeScript type definitions
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

## Error Handling

The application includes comprehensive error handling for:
- Invalid file types (only PDF supported)
- File size limits (10MB max)
- OpenAI API errors
- PDF parsing failures
- Network issues

## Security Features

- File type validation
- File size limits
- Input sanitization
- Error message sanitization

## Performance Optimizations

- PDF text extraction limited to first 4000 characters
- Responsive design for all screen sizes
- Optimized chart rendering
- Efficient state management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on the repository. 