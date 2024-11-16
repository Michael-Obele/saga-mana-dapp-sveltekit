import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { fetchUserProposalsWithDetails } from '@/lib/actions';
import { DetailedProposal } from '@/lib/actions';
import SubProjectVoting from './SubProjectVoting';
import TaskPerformanceVoting from './TaskPerformanceVoting';

interface SubProjectsListProps {
    subProjects: DetailedProposal[];
}

const SubProjectsList: React.FC<SubProjectsListProps> = ({ subProjects }) => {
    const router = useRouter();
    const { data: session } = useSession();

    const [proposals, setProposals] = useState<DetailedProposal[]>([]);

    useEffect(() => {
        const fetchProposals = async () => {
            if (session?.user?.username) {
                const result = await fetchUserProposalsWithDetails(session.user.username);
                if (result.success) {
                    setProposals(result.proposals || []);
                }
            }
        };
        fetchProposals();
    }, [session]);

    if (!session) {
        return (
            <div className="flex min-h-screen flex-col items-center py-10 text-white">
                <div className="w-full max-w-4xl px-4">
                    <header className="mb-12 text-center">
                        <h1 className="mb-2 text-4xl font-bold">Governance Voting</h1>
                        <p className="text-lg">Participate in the governance by voting on proposals.</p>
                        {/* Need to add NEAR Wallet Login/Logout */}
                        <div>
                            <button className="rounded-lg bg-primary px-4 py-2 text-white" onClick={() => router.push('/auth/login')}>Login with NEAR</button>
                        </div>
                    </header>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center py-10 text-white">
            <div className="w-full max-w-4xl px-4">
                <header className="mb-12 text-center">
                    <h1 className="mb-2 text-4xl font-bold">Governance Voting</h1>
                    <p className="text-lg">Participate in the governance by voting on proposals.</p>
                </header>

                <div className="mb-16">
                    {proposals.length > 0 ? (
                        <ul>
                            {proposals.map((proposal) => (
                                <li key={proposal.id} className="mb-4 p-4 rounded-lg bg-amber-50">
                                    <p className="text-lg font-semibold text-amber-900">{proposal.title}</p>
                                    <p className="text-sm text-amber-700">{proposal.description}</p>

                                    {proposal.subProjects.map((subProject) => (
                                        <div key={subProject.id} className="mt-4">
                                            <h3 className="text-md font-medium text-amber-800">Sub-Project: {subProject.subProjectName}</h3>
                                            <SubProjectVoting subProjectId={subProject.id} />

                                            {subProject.epics.map((epic) => (
                                                <div key={epic.id} className="mt-2">
                                                    <h4 className="text-sm font-medium text-amber-700">Epic: {epic.epicName}</h4>
                                                    {epic.tasks.map((task) => (
                                                        <div key={task.id} className="mt-1">
                                                            <p className="text-xs text-amber-600">Task: {task.taskName}</p>
                                                            {task.assignedTo && (
                                                                <TaskPerformanceVoting taskId={task.id} voteeId={task.assignedTo} />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No proposals available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubProjectsList;
