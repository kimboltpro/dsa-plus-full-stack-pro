
export async function fetchGithubStats(username: string): Promise<{
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  dsaRepos: any[];
  contributionsThisYear: number;
  avatar: string | null;
  profileUrl: string;
}> {
  try {
    const [userResp, reposResp] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars`)
    ]);

    if (!userResp.ok || !reposResp.ok) {
      throw new Error('Failed to fetch GitHub data');
    }

    const userData = await userResp.json();
    const reposData = await reposResp.json();

    const dsaKeywords = ['dsa', 'algorithm', 'data-structure', 'leetcode', 'coding', 'competitive'];
    const dsaRepos = reposData.filter((repo: any) => 
      dsaKeywords.some(keyword => 
        repo.name.toLowerCase().includes(keyword) || 
        (repo.description && repo.description.toLowerCase().includes(keyword))
      )
    ).slice(0, 5);

    const totalStars = reposData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);

    return {
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      totalStars,
      dsaRepos: dsaRepos.map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        url: repo.html_url,
        language: repo.language
      })),
      contributionsThisYear: 0, // Would need GraphQL API for this
      avatar: userData.avatar_url,
      profileUrl: userData.html_url,
    };
  } catch (err) {
    console.error("GitHub fetch error", err);
    throw err;
  }
}
