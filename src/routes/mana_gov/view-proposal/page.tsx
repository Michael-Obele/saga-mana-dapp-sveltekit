'use client';

import React, { useEffect, useState } from 'react';
import { Proposal } from '@prisma/client';
import { authenticate, fetchUserProposalsWithDetails, type FetchUserProposalsWithDetailsResponse } from "@/lib/actions";
import SubProjectsList from './SubProjectsList';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserProjectsPage() {
    const router = useRouter();
    const [proposals, setProposals] = useState<FetchUserProposalsWithDetailsResponse['proposals']>([]);
    const [selectedProposalId, setSelectedProposalId] = useState<number | null>(null);
    const [session, setSession] = useState(false);
    const [username, setUsername] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState<string | undefined>('');

    useEffect(() => {
        const fetchData = async () => {
            const authResult = await authenticate();
            setSession(authResult.success);
            setUsername(authResult.user?.username || '');

            if (authResult.success && authResult.user?.username) {
                const projectResult = await fetchUserProposalsWithDetails(authResult.user.username);

                if (projectResult.success === false) {
                    setError(true);
                    setMessage(projectResult.message);
                } else {
                    setError(false);
                    setMessage(projectResult.message || '');
                    setProposals(projectResult.proposals ?? []);
                }
            }
        };

        fetchData();
    }, []);

    const handleProposalClick = (proposalId: number) => {
        // Toggle selection
        setSelectedProposalId(prevId => (prevId === proposalId ? null : proposalId));
    };

    return (
        <div className="min-h-screen bg-amber-50 px-4 py-8">
            <h1 className="mb-8 text-center text-3xl font-bold text-amber-900">My Projects</h1>

            {session ? (
                <>
                    {error && <div className="font-semibold text-red-500">{message}</div>}
                    {proposals.length > 0 ? (
                        <ul className="space-y-4">
                            {proposals?.map((proposal) => (
                                <li key={proposal.id} className="rounded-lg bg-white p-4 shadow-md">
                                    <button
                                        onClick={() => handleProposalClick(proposal.id)}
                                        className="w-full text-left text-lg font-medium text-amber-900 hover:underline"
                                    >
                                        {proposal.title}
                                    </button>

                                    {selectedProposalId === proposal.id && (
                                        <div className="mt-4 border-t border-amber-200 pt-4">
                                            <p className="font-medium text-amber-700">
                                                Description: <span className="font-normal text-amber-900">{proposal.description}</span>
                                            </p>
                                            <p className="font-medium text-amber-700">
                                                MANA Allocated: <span className="font-normal text-amber-900">{proposal.manaTokenAllocated}</span>
                                            </p>

                                            <SubProjectsList subProjects={proposal.subProjects} />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex h-64 flex-col items-center justify-center">
                            <p className="text-lg font-medium text-amber-900">No projects available. Please create one.</p>
                            <Link
                                href='/mana_gov/create-project'
                                className="mt-4 rounded-lg bg-amber-400 px-4 py-2 text-white hover:bg-amber-500"
                            >
                                Create Project
                            </Link>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-amber-900">Please log in to view your projects.</p>
            )}
        </div>
    );
};
