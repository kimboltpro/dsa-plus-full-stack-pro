
export async function fetchLeetCodeStats(username: string): Promise<{
  problemsSolved: number;
  contestRating: number | null;
  streak: number | null;
  badges: { name: string }[];
  recentSubmissions: { title: string; time: string }[];
  avatar: string | null;
  profileUrl: string;
}> {
  try {
    const resp = await fetch('https://pqkqzbkwguoktggszvus.supabase.co/functions/v1/leetcode-proxy', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxa3F6Ymt3Z3Vva3RnZ3N6dnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjIzNDMsImV4cCI6MjA1MDUzODM0M30.ej1RDN_KQKUPcRTh4xpZLFHd9Q2p7YF4zDKGfXzBVSM'}`
      },
      body: JSON.stringify({ username }),
    });

    if (!resp.ok) throw new Error('Failed to fetch LeetCode data');
    const data = await resp.json();

    if (!data.data || !data.data.matchedUser) throw new Error('LeetCode user not found');

    const acSum = data.data.matchedUser.submitStats?.acSubmissionNum?.find(
      (x: any) => x.difficulty === "All"
    )?.count ?? 0;

    const rating = data.data.userContestRanking?.rating ?? null;
    const badgeNames = [
      ...(data.data.matchedUser.badge ? [data.data.matchedUser.badge] : []),
      ...(data.data.matchedUser.contestBadge ? [data.data.matchedUser.contestBadge] : []),
    ].filter(Boolean);

    return {
      problemsSolved: acSum,
      contestRating: rating,
      streak: null,
      badges: badgeNames,
      recentSubmissions:
        data.data.recentSubmissionList?.map((s: any) => ({
          title: s.title,
          time: new Date(Number(s.timestamp) * 1000).toLocaleString(),
        })) ?? [],
      avatar: data.data.matchedUser.profile?.userAvatar ?? null,
      profileUrl: `https://leetcode.com/${username}/`,
    };
  } catch (err) {
    console.error("LeetCode fetch error", err);
    throw err;
  }
}
