import IssuesTable from "@/components/IssuesTable"

import { AssignedToMe } from "@/lib/DummyData/assigned-to-me"

function AssignedMe() {
    return (
        <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
            <div className="bg-white dark:sidebar border border-border shadow-md rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Assigned to Me</h2>
                <IssuesTable data={AssignedToMe} />
            </div>
        </main>
    )
}

export default AssignedMe