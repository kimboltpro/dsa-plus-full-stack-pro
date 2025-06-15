
export async function fetchCodeforcesStats(handle: string): Promise<{
  rating: number;
  maxRating: number;
  rank: string;
  problemsSolved: number;
  contestsParticipated: number;
  avatar: string | null;
  profileUrl: string;
}> {
  try {
    const [userResp, submissionsResp] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${handle}`),
      fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=10000`)
    ]);

    if (!userResp.ok || !submissionsResp.ok) {
      throw new Error('Failed to fetch Codeforces data');
    }

    const userData = await userResp.json();
    const submissionsData = await submissionsResp.json();

    if (userData.status !== 'OK' || submissionsData.status !== 'OK') {
      throw new Error('Codeforces user not found');
    }

    const user = userData.result[0];
    const solvedProblems = new Set();
    
    submissionsData.result.forEach((submission: any) => {
      if (submission.verdict === 'OK') {
        solvedProblems.add(`${submission.problem.contestId}-${submission.problem.index}`);
      }
    });

    return {
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || 'Unrated',
      problemsSolved: solvedProblems.size,
      contestsParticipated: user.contestCount || 0,
      avatar: user.avatar || null,
      profileUrl: `https://codeforces.com/profile/${handle}`,
    };
  } catch (err) {
    console.error("Codeforces fetch error", err);
    throw err;
  }
}
