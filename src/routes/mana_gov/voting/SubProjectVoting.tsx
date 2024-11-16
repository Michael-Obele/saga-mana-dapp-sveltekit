import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface SubProjectVotingProps {
    subProjectId: number;
}

const SubProjectVoting: React.FC<SubProjectVotingProps> = ({ subProjectId }) => {
    const { data: session } = useSession();
    const [hasVoted, setHasVoted] = useState(false);
    const [vote, setVote] = useState<boolean | null>(null);

    // ... (Logic to fetch existing vote for this subproject) ...

    const handleVote = async (newVote: boolean) => {
        // ... (Send vote to your API route) ...
        setHasVoted(true);
        setVote(newVote);
    };

    return (
        <div className="mt-2">
            {!hasVoted && (
                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 rounded-lg bg-amber-400 text-white"
                        onClick={() => handleVote(true)}
                    >
                        Yes
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg bg-amber-400 text-white"
                        onClick={() => handleVote(false)}
                    >
                        No
                    </button>
                </div>
            )}
            {hasVoted && (
                <p className="text-xs text-amber-600">You voted: {vote ? 'Yes' : 'No'}</p>
            )}
        </div>
    );
};

export default SubProjectVoting;
