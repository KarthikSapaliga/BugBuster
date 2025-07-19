import React from 'react'
import WeeklyProgressChart from '@/components/charts/WeeklyProgressChart'
import BugStatusPieChart from '@/components/charts/BugStatusPieChart'
import History from '@/components/History'
import BugStatusBarChart from '@/components/charts/BugStatusBarChart'
import MonthlyProgressChart from '@/components/charts/MonthlyProgressChart'
import Stats from '@/components/Stats'

function Analytics() {
    return (
        <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">

            {/* Stats*/}
            <Stats/>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-3 bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Weekly Progress</h2>
                    <WeeklyProgressChart />
                </div>
                <div className="col-span-1 bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Bug Status</h2>
                    <BugStatusPieChart />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="col-span-3 bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Monthly Progress</h2>
                    <MonthlyProgressChart />
                </div>
                <div className="col-span-2 bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Bug Status Bar Chart</h2>
                    <BugStatusBarChart/>
                </div>
            </div>

            {/* History */}
            <div className="bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">History</h2>
                <History />
            </div>
        </main>
    )
}

export default Analytics