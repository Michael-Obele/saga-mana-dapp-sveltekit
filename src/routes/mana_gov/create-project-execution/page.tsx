"use client"; // This is a client-side component

import { useEffect, useState } from 'react';
import ProjectExecutionForm from '../components/ProjectExecutionForm';
import '../styles.css';

// Define the main component
export default function CreateProjectExecutionPage() {
  const [projectPlans, setProjectPlans] = useState<{ id: number; projectName: string; tasks?: { id: number }[] }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch list of project plans
  useEffect(() => {
    async function fetchProjectPlans() {
      try {
        const response = await fetch('/api/project-plans'); // Adjust the endpoint as necessary
        if (!response.ok) {
          throw new Error('Failed to fetch project plans');
        }
        const data = await response.json();
        setProjectPlans(data); // Populate project plans
      } catch (err) {
        console.error('Error fetching project plans:', err);
        setProjectPlans([]); // Set an empty array if an error occurs
      } finally {
        setLoading(false);
      }
    }

    fetchProjectPlans();
  }, []);

  // Define the addProjectExecution function with derived defaults from ProjectPlan
  const addProjectExecution = (projectExecution: {
    projectPlanId: number;
    actualManaHours: number;
  }) => {
    // Find the associated ProjectPlan to derive defaults
    const associatedProjectPlan = projectPlans.find(plan => plan.id === projectExecution.projectPlanId);

    // Derive default values for tasks and peerVotes from the associated ProjectPlan
    const fullProjectExecution = {
      ...projectExecution,
      id: Date.now(), // Replace with actual ID if generated by the backend
      projectPlanId: associatedProjectPlan?.id || projectExecution.projectPlanId, // Ensure projectPlanId is set correctly
      tasks: associatedProjectPlan?.tasks?.map(task => ({
        taskPlanId: task.id,
        actualManaHours: 0, // Initialize actual hours as zero or set based on requirements
        status: 'NotStarted' as const, // Default status for each task
      })) || [],
      peerVotes: [], // Initialize as empty; can be populated from ProjectPlan participants if needed
    };

    console.log('Project execution submitted:', fullProjectExecution);
    // Handle project execution submission (e.g., save to a database or send to an API)
  };

  // Show a loading indicator while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render the page with the Project Execution Form
  return (
    <div className="create-project-execution-page">
      <header className="text-white text-xl font-bold">
        <div className="title flex-grow text-center">
          <h1 className="text-white text-xl font-bold">Create New Project Execution</h1>
        </div>
      </header>

      <section className="project-execution-form">
        <ProjectExecutionForm addProjectExecution={addProjectExecution} projectPlans={projectPlans} />
      </section>
    </div>
  );
}
