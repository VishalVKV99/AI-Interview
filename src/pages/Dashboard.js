import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import { useInterview } from '../contexts/InterviewContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const { interviewData } = useInterview();  // Assuming interviewData contains scores, strengths, etc.

  const scores = interviewData?.answers?.map((a, index) => ({
    name: `Q${index + 1}`,
    score: a.score || 0
  })) || [];

  const strengths = interviewData?.answers?.flatMap(ans => ans.strengths || []) || [];
  const areasToImprove = interviewData?.answers?.flatMap(ans => ans.areas_to_improve || []) || [];

  const pieData = [
    { name: 'Strengths', value: strengths.length },
    { name: 'Areas to Improve', value: areasToImprove.length }
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Interview Performance Dashboard</h2>

      {/* Bar Chart for Scores */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Score per Question</h3>
        <BarChart width={600} height={300} data={scores}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Bar dataKey="score" fill="#8884d8" />
        </BarChart>
      </div>

      {/* Pie Chart for Strengths vs Areas to Improve */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Strengths vs Areas to Improve</h3>
        <PieChart width={400} height={400}>
          <Pie
            data={pieData}
            cx={200}
            cy={200}
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>

      {/* Optional: Radar Chart for detailed feedback */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Feedback Radar (Optional)</h3>
        <RadarChart outerRadius={90} width={500} height={300} data={[
          { subject: 'Confidence', A: 6, fullMark: 10 },
          { subject: 'Technical', A: 8, fullMark: 10 },
          { subject: 'Communication', A: 7, fullMark: 10 },
          { subject: 'Examples', A: 5, fullMark: 10 },
        ]}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 10]} />
          <Radar name="Your Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </div>

    </div>
  );
};

export default Dashboard;
