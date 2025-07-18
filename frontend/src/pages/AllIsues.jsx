import IssuesTable from '@/components/IssuesTable'
import { apiClient } from '@/lib/axios';

import { AllIssuesTasks } from '@/lib/DummyData/all-issues'
import { GET_ALL_BUGS_ROUTE } from '@/lib/routes';
import { useEffect, useState } from 'react'

function AllIsues() {

    const [issues,setIssues] = useState([]);

    useEffect(()=>{

        async function fetchAllIssues() {
            const res = await apiClient.get(GET_ALL_BUGS_ROUTE);
            //console.log(res);
            setIssues(res.data);
        }

        fetchAllIssues();
    },[])


    return (
        <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
            <div className="bg-background dark:sidebar border border-border shadow-md rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">All Issues</h2>
                <IssuesTable data={issues} />
            </div>
        </main>
    )
}

export default AllIsues