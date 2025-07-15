import IssuesTable from "@/components/IssuesTable"

import { HighPriority } from "@/lib/DummyData/high-priority"

function HighPriority() {
    return (
        <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
            <div className="bg-white dark:sidebar border border-border shadow-md rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">High Priority</h2>
                <IssuesTable data={HighPriority} />
            </div>
        </main>
    )
}

export default HighPriority