import React from 'react'
import WeeklyProgressChart from '@/components/charts/WeeklyProgressChart'
import BugStatusPieChart from '@/components/charts/BugStatusPieChart'

function Dashboard() {
    return (
        <main className='p-4 md:p-8 lg:p-12 flex flex-col gap-6'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                <div className='border rounded-lg bg-muted text-center p-4'>
                    <h1 className='text-2xl font-semibold mb-4 '>Projects</h1>
                    <h1 className='text-5xl font-bold'>01</h1>
                </div>
                <div className='border rounded-lg bg-muted text-center p-4'>
                    <h1 className='text-2xl font-semibold mb-4'>Assigned</h1>
                    <h1 className='text-5xl font-bold'>12</h1>
                </div>
                <div className='border rounded-lg bg-muted text-center p-4'>
                    <h1 className='text-2xl font-semibold mb-4'>Completed</h1>
                    <h1 className='text-5xl font-bold'>04</h1>
                </div>
                <div className='border rounded-lg bg-muted text-center p-4'>
                    <h1 className='text-2xl font-semibold mb-4'>Pending</h1>
                    <h1 className='text-5xl font-bold'>08</h1>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <div className='col-span-3 border rounded-lg bg-muted p-4'>
                    <h2 className='text-xl font-semibold mb-4'>Weekly Progress</h2>
                    <WeeklyProgressChart />
                </div>
                <div className='col-span-1 border rounded-lg bg-muted p-4'>
                    <h2 className='text-xl font-semibold mb-4'>Bug Status</h2>
                    <BugStatusPieChart />
                </div>
            </div>
        </main>
    )
}

export default Dashboard