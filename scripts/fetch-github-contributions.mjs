import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";

const outputUrl = new URL("../src/data/contributions.json", import.meta.url);
const siteUrl = new URL("../content/site.json", import.meta.url);
const site = JSON.parse(await readFile(siteUrl, "utf8"));
const username = process.env.GITHUB_USERNAME || site.profile.githubUser;
const token = process.env.GH_CONTRIBUTIONS_TOKEN;

const keepSnapshot = (reason) => {
  console.warn(`GitHub contributions: ${reason}; keeping the current snapshot.`);
  process.exit(0);
};

if (!token) {
  console.log("GitHub contributions: no token configured, keeping the current snapshot.");
  process.exit(0);
}

const query = `
  query ContributionCalendar($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            firstDay
            contributionDays {
              date
              contributionCount
              contributionLevel
              color
              weekday
            }
          }
        }
      }
    }
  }
`;

let response;

try {
  response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "luwisp-notes-build"
    },
    body: JSON.stringify({ query, variables: { login: username } })
  });
} catch (error) {
  keepSnapshot(error instanceof Error ? error.message : "request failed");
}

if (!response.ok) {
  keepSnapshot(`request failed with ${response.status} ${response.statusText}`);
}

const payload = await response.json();
if (payload.errors?.length) {
  keepSnapshot(`GraphQL error: ${payload.errors[0].message}`);
}

const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
if (!calendar) {
  keepSnapshot(`user not found or contribution calendar unavailable for @${username}`);
}

await writeFile(
  outputUrl,
  `${JSON.stringify(
    {
      username,
      generatedAt: new Date().toISOString(),
      status: "ready",
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks
    },
    null,
    2
  )}\n`,
  "utf8"
);

console.log(`GitHub contributions: wrote ${calendar.totalContributions} contributions for @${username}.`);
