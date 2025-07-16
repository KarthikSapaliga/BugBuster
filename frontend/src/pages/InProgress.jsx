import IssuesTable from "@/components/IssuesTable"

import { InProgressTasks } from "@/lib/DummyData/in-progress"

function InProgress() {
    return (
        <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
            <div className="bg-background dark:sidebar border border-border shadow-md rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">In Progress</h2>
                <IssuesTable data={InProgressTasks} />
            </div>
        </main>
    )
}

export default InProgress