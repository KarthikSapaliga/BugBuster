import { Octokit } from "@octokit/rest";

export function initOctokit(GITHUB_TOKEN) {
    return new Octokit({
        auth: GITHUB_TOKEN,
    });
}

export async function fetchIssues(octokit, owner, repo) {
    try {
        const response = await octokit.rest.issues.listForRepo({
            owner: owner,
            repo: repo,
            state: "all",
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
        ### ${sectionTitle}[\\s\\S]*?\\n+([\\s\\S]*?)(?=\\n###|$),
        "i"
    );
    const match = body.match(regex);
    return match ? match[1].trim() : "";
}

// Extract attachment URLs starting with https://github.com/user-attachments/
function extractAttachments(body) {
    const urlRegex = /https:\/\/github\.com\/user-attachments\/[^\s)"']+/g;
    const matches = body.match(urlRegex) || [];

    return matches.map((url) => {
        const filename = url.split("/").pop();
        return {
            filename,
            originalName: filename,
            size: "unknown",
            uploadedAt: null,
            url,
        };
    });
}

export async function closeIssue(octokit, owner, repo, issue_number) {
    try {
        const response = await octokit.rest.issues.update({
            owner,
            repo,
            issue_number,
            state: "closed",
        });

        console.log(Issue #${issue_number} closed successfully!);
        console.log(URL: ${response.data.html_url});
    } catch (error) {
        console.error("Error closing issue:", error);
    }
}
