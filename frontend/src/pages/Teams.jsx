import React, { useEffect, useState } from 'react';
import { useAppStore } from '@/store/store';
import { apiClient } from '@/lib/axios';
import { GET_USER_ROUTE } from '@/lib/routes';
import { useParams } from 'react-router-dom';

function Teams() {
    const { projectId } = useParams();
    const { token } = useAppStore();

    const [teamMembers, setTeamMembers] = useState([]);
    const [memberDetails, setMemberDetails] = useState([]);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await apiClient.get(`/api/projects/get-by-id/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTeamMembers(res.data.teamMembers || []);
            } catch (err) {
                console.error('Failed to fetch project', err);
            }
        };
        fetchTeam();
    }, [projectId, token]);

    useEffect(() => {
        if (teamMembers.length === 0) return;

        const fetchMemberDetails = async () => {
            try {
                const data = await Promise.all(
                    teamMembers.map(id =>
                        apiClient.get(`${GET_USER_ROUTE}${id}`).then(res => res.data)
                    )
                );
                setMemberDetails(data);
            } catch (err) {
                console.error('Failed to fetch member details', err);
            }
        };

        fetchMemberDetails();
    }, [teamMembers]);

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Team Members</h1>

            {memberDetails.length === 0 && <p>No team members found.</p>}

            <div className="grid gap-4">
                {memberDetails.map(member => (
                    <div
                        key={member.id}
                        className="p-4 border border-border rounded-lg bg-card shadow-sm"
                    >
                        <p><strong>Name:</strong> {member.name}</p>
                        <p><strong>Email:</strong> {member.email}</p>
                        <p><strong>Role:</strong> {member.role}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Teams;
