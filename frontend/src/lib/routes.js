export const HOST = import.meta.env.VITE_SERVER_URL;

export const SIGNIN_ROUTE = "/api/auth/signin";
export const SIGNUP_ROUTE = "/api/auth/signup";

export const GET_DEVELOPERS_ROUTE = "/api/users/developers"        
export const GET_DEVELOPERS_AND_TESTERS_ROUTE = "/api/users/devs-and-testers"

// Project Routes
export const CREATE_PROJECT_ROUTE = "/api/projects/create-project";
export const UPDATE_PROJECT_ROUTE = "/api/projects/update-project"
export const GET_MY_PROJECTS_ROUTE = "/api/projects/my-projects";
export const GET_PROJECT_BY_ID_ROUTE = "/api/projects/get-by-id";

// Bug Routes
export const CREATE_BUG_ROUTE = "/api/bugs";                        // POST - Create a new bug
export const GET_ALL_BUGS_ROUTE = "/api/bugs";                      // GET - Get all bugs

export const GET_BUG_BY_ID_ROUTE = "/api/bugs";                     // GET - Append /:id when calling
export const UPDATE_BUG_ROUTE = "/api/bugs";                        // PUT - Append /:id when calling
export const DELETE_BUG_ROUTE = "/api/bugs";                        // DELETE - Append /:id when calling

export const GET_BUGS_BY_PROJECT_ROUTE = "/api/bugs/project";       // GET - Append /:projectId when calling
export const GET_BUGS_ASSIGNED_TO_ROUTE = "/api/bugs/assignedTo";   // GET - Append /:userId
export const GET_BUGS_CREATED_BY_ROUTE = "/api/bugs/createdBy";     // GET - Append /:userId

export const CLOSE_BUG_ROUTE = "/api/bugs";                         // PATCH - Append /:id/close?closedBy=userId
export const ASSIGN_BUG_ROUTE = "/api/bugs";                        // PATCH - Append /:id/assign?assignedTo=userId&assignedBy=userId
