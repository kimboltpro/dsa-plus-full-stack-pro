
/**
 * Fetches user stats from LeetCode's public GraphQL API (unofficial).
 */
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
    // LeetCode unofficial API endpoint
    const endpoint = "https://leetcode.com/graphql";
    const body = {
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              userAvatar
            }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
            badge {
              name
            }
            contestBadge {
              name
            }
          }
          userContestRanking(username: $username) {
            rating
            attendedContestsCount
            topPercentage
          }
          recentSubmissionList(username: $username, limit: 5) {
            title
            timestamp
          }
        }
      `,
      variables: { username },
    };

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!resp.ok) throw new Error("Failed to fetch LeetCode data");
    const data = await resp.json();

    if (!data.data || !data.data.matchedUser) throw new Error("LeetCode user not found");

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
      streak: null, // LeetCode doesn't expose streak via API; leave null for now.
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
