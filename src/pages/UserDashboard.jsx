import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { InterviewContext } from '../contexts/InterviewContext';
import { getUserDashboardData, getCompleteInterviewResults } from '../services/firebaseService';
import { BarChart, PieChart, Bar, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const UserDashboard = () => {
  const { userId } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(InterviewContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserDashboardData(userId);
        const history = await getCompleteInterviewResults(userId);
        setDashboardData({
          ...data,
          history
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="flex justify-center items-center min-h-screen">No dashboard data found</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const accuracyData = dashboardData.answers?.map((answer, idx) => ({
    name: `Q${idx + 1}`,
    accuracy: answer.analysis?.accuracy || 0,
    fullMarks: 100
  })) || [];

  const skillData = dashboardData.skills?.map(skill => ({
    name: skill.name,
    value: skill.score
  })) || [];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{user.name}'s Performance Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Overall Accuracy</h3>
          <p className="text-4xl font-bold">
            {dashboardData.metrics?.averageAccuracy?.toFixed(1) || 0}%
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Questions Attempted</h3>
          <p className="text-4xl font-bold">
            {dashboardData.metrics?.totalQuestions || 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Correct Answers</h3>
          <p className="text-4xl font-bold">
            {dashboardData.metrics?.correctAnswers || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Question Accuracy</h3>
          <BarChart
            width={500}
            height={300}
            data={accuracyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="accuracy" fill="#8884d8" name="Your Score" />
            <Bar dataKey="fullMarks" fill="#82ca9d" name="Full Marks" />
          </BarChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Skill Distribution</h3>
          <PieChart width={500} height={300}>
            <Pie
              data={skillData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {skillData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top Strengths</h3>
          <ul className="list-disc pl-5">
            {dashboardData.metrics?.topStrengths?.map((strength, i) => (
              <li key={i} className="mb-2">{strength}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Areas for Improvement</h3>
          <ul className="list-disc pl-5">
            {dashboardData.metrics?.topImprovements?.map((improvement, i) => (
              <li key={i} className="mb-2">{improvement}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;