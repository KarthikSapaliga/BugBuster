import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/axios.js';
import { useAppStore } from '@/store/store.js';
import { useParams } from 'react-router-dom';
import { GET_BUGS_BY_PROJECT_ROUTE, GET_PROJECT_BY_ID_ROUTE } from '@/lib/routes.js';

import ProjectBugsTable from '@/components/ProjectBugsTable';

function ProjectBugs() {
    const { projectId } = useParams();
    const { token } = useAppStore();
    const [project, setProject] = useState({});
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchProjectInfo = async () => {
            try {
                const res = await apiClient.get(`${GET_PROJECT_BY_ID_ROUTE}/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProject(res.data)
            } catch (error) {
                console.error('Failed to fetch bugs:', error);
            }
        }

        const fetchBugs = async () => {
            try {
                const res = await apiClient.get(`${GET_BUGS_BY_PROJECT_ROUTE}/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBugs(res.data);
                console.log(res.data)
            } catch (error) {
                console.error('Failed to fetch bugs:', error);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) fetchProjectInfo()
        if (projectId) fetchBugs();
    }, [projectId, token]);

    if (loading) return <p>Loading bugs...</p>;

    return (
        <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
            <div>
                <h1>Project Info</h1>
                <p>Id: {project.id}</p>
                <p>Name: {project.name}</p>
                <p>Description: {project.description}</p>
                <p>Created By: {project.createdBy}</p>
                <p>Github Link: {project.githubLink}</p>
                <p>Github Token: {project.githubToken}</p>
                <div>
                    <p>Team Members: </p>
                    <ul>
                        {
                            project.teamMembers.map(id => <li key={id}>user id: {id}</li>)
                        }
                    </ul>
                </div>
            </div>
            <div className="bg-background dark:sidebar border border-border shadow-md rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">All Issues</h2>
                <ProjectBugsTable data={bugs} />
            </div>
        </main>
    );
}

export default ProjectBugs;
