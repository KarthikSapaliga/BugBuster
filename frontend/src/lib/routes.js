// Host Route
export const HOST = import.meta.env.VITE_SERVER_URL;

// Auth Routes
export const SIGNIN_ROUTE = "/api/auth/signin";
export const SIGNUP_ROUTE = "/api/auth/signup";

// User Routes
export const GET_USER_ROUTE = "/api/users";
export const GET_DEVELOPERS_ROUTE = "/api/users/developers";
export const GET_DEVELOPERS_AND_TESTERS_ROUTE = "/api/users/devs-and-testers";

// User + Project Routes
export const GET_DEVS_IN_TEAM_ROUTE = "/api/projects/developers";
export const GET_TESTERS_IN_TEAM_ROUTE = "/api/projects/testers";
export const RECENT_BUGS_ROUTE = "/api/bugs/recent";

// Project Routes
export const CREATE_PROJECT_ROUTE = "/api/projects/create-project";
export const UPDATE_PROJECT_ROUTE = "/api/projects/update-project";
export const GET_MY_PROJECTS_ROUTE = "/api/projects/my-projects";
export const GET_PROJECT_BY_ID_ROUTE = "/api/projects/get-by-id";

// Bug Routes
export const CREATE_BUG_ROUTE = "/api/bugs"; // POST - Create a new bug
export const GET_ALL_BUGS_ROUTE = "/api/bugs/all"; // GET - Get all bugs
export const GET_ASSIGNED_BUGS_ROUTE = "/api/bugs/assigned"; // GET - Get assigned bugs
export const GET_CLOSE_REQUESTS_ROUTE = "/api/bugs/close-requests"; // GET - Get close requests

export const GET_BUG_BY_ID_ROUTE = "/api/bugs"; // GET - Append /:id
export const UPDATE_BUG_ROUTE = "/api/bugs"; // PUT - Append /:id
export const DELETE_BUG_ROUTE = "/api/bugs"; // DELETE - Append /:id

export const GET_BUGS_BY_PROJECT_ROUTE = "/api/bugs/project"; // GET - Append /:projectId
export const GET_BUGS_ASSIGNED_TO_ROUTE = "/api/bugs/assignedTo"; // GET - Append /:userId
export const GET_BUGS_CREATED_BY_ROUTE = "/api/bugs/createdBy"; // GET - Append /:userId

export const CLOSE_BUG_ROUTE = "/api/bugs/close"; // PATCH - Append /:id
export const ASSIGN_BUG_ROUTE = "/api/bugs/assign"; // PATCH - Append /:id
export const RESOLVE_BUG_ROUTE = "/api/bugs/resolve"; // PATCH - Append /:id
export const START_WORKING_ROUTE = "/api/bugs/start-working"; // PATCH - Append /:id

export const BUG_UPLOAD_ROUTE = "/api/bugs/files/upload"; // POST
export const BUG_DOWNLOAD_ROUTE = "/api/bugs/files"; // GET - Append /{filename:.+}

export const GITHUB_IMPORT_ROUTE = "/api/bugs/github-import";

// Comment Routes
export const GET_COMMENTS_ROUTE = "/api/bugs/comments"; // GET - Append /:id
export const POST_COMMENT_ROUTE = "/api/bugs/comments"; // POST - Append /:id

// Imported Issues
export const IMPORTED_ISSUE_IDS = "/api/github/imported-issue-ids";
