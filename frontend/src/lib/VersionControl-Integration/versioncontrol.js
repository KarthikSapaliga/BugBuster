import { Octokit } from "@octokit/rest";

export function initOctokit(GITHUB_TOKEN) {
    return new Octokit({
        auth: GITHUB_TOKEN,
    });
}

export const extractGithubOwner = (url) => {
    try {
        const parsed = new URL(url);
        const parts = parsed.pathname.split("/").filter(Boolean);
        return parts[0] || null;
    } catch {
        return null;
    }
};

export const extractGithubRepo = (url) => {
    try {
        const parsed = new URL(url);
        const parts = parsed.pathname.split("/").filter(Boolean);
        return parts[1]?.replace(/\.git$/, "") || null;
    } catch {
        return null;
    }
};

export async function fetchIssues(octokit, owner, repo) {
    try {
        const response = await octokit.rest.issues.listForRepo({
            owner: owner,
            repo: repo,
            state: "open",
        });

        const issues = response.data;

        const extractedIssues = issues.map((issue) => {
            const body = issue.body || "";

            const description = extractSection(body, "Description");
            const steps = extractSection(body, "Steps to Reproduce");
            const expected = extractSection(body, "Expected Behavior");
            const actual = extractSection(body, "Actual Behavior");
            const urgency = extractSection(body, "Urgency");
            const severity = extractSection(body, "Severity");

            const attachments = extractAttachments(body);

            return {
                issueId: issue.number,
                title: issue.title,
                state: issue.state,
                createdAt: issue.created_at,
                createdBy: issue.user ? issue.user.login : null,
                createdByAvatar: issue.user ? issue.user.avatar_url : null,
                closedAt: issue.closed_at,
                closedBy: issue.closed_by ? issue.closed_by.login : null,
                closedByAvatar: issue.closed_by
                    ? issue.closed_by.avatar_url
                    : null,
                description: description.trim(),
                steps: steps.trim(),
                expected: expected.trim(),
                actual: actual.trim(),
                urgency: urgency.trim(),
                severity: severity.trim(),
                attachments,
                fromGithub: true,
                issue_url: issue.html_url,
            };
        });

        return JSON.stringify(extractedIssues, null, 2);
    } catch (error) {
        console.error("Error fetching issues:", error);
        return null;
    }
}

function extractSection(body, sectionTitle) {
    const regex = new RegExp(
        `### ${sectionTitle}[\\s\\S]*?\\n+([\\s\\S]*?)(?=\\n###|$)`,
        "i"
    );
    const match = body.match(regex);
    return match ? match[1].trim() : "";
}

function extractAttachments(body) {
  const attachments = [];

  // 1️⃣ Extract inline images: ![alt](url)
  const imageRegex = /!\[[^\]]*\]\((https:\/\/github\.com\/user-attachments\/[^\s)]+)\)/g;
  let imgMatch;
  while ((imgMatch = imageRegex.exec(body)) !== null) {
    const url = imgMatch[1];
    attachments.push({
      filename: url,
      originalName: url,
      url,
      type: 'image',
      uploadedAt: null,
      size: 0,
    });
  }

  // 2️⃣ Extract all raw links (files)
  const fileRegex = /(?<!\!)\[[^\]]*\]\((https:\/\/github\.com\/user-attachments\/[^\s)]+)\)/g;
  let fileMatch;
  while ((fileMatch = fileRegex.exec(body)) !== null) {
    const url = fileMatch[1];
    // Skip if already added
    if (!attachments.some((a) => a.url === url)) {
      attachments.push({
        filename: url,
        originalName: url,
        url,
        type: 'file',
        uploadedAt: null,
        size: 0,
      });
    }
  }

  // 3️⃣ Fallback: plain pasted links (very rare, but possible)
  const urlRegex = /https:\/\/github\.com\/user-attachments\/[^\s)"']+/g;
  const matches = body.match(urlRegex) || [];
  matches.forEach((url) => {
    if (!attachments.some((a) => a.url === url)) {
      attachments.push({
        filename: url,
        originalName: url,
        url,
        type: 'file',
        uploadedAt: null,
        size: 0,
      });
    }
  });

  return attachments;
}

export async function closeGithubIssue(octokit, owner, repo, issue_number) {
    try {
        const response = await octokit.rest.issues.update({
            owner,
            repo,
            issue_number,
            state: "closed",
        });

        console.log(`Issue #${issue_number} closed successfully!`);
        console.log(`URL: ${response.data.html_url}`);
    } catch (error) {
        console.error("Error closing issue:", error);
    }
}
