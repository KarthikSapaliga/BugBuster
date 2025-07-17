import React from 'react'
import { useAppStore } from '@/store/store'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const status = [
    { label: 'Projects', value: '01' },
    { label: 'Assigned', value: '12' },
    { label: 'Completed', value: '04' },
    { label: 'Pending', value: '08' },
]

function Dashboard() {
    const { user } = useAppStore()
    const navigate = useNavigate();

    const createProject = () => {
        // alert("create project")
        navigate("/create-project");
    }

    return (
        <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">

            <div className='pb-5 border-b flex flex-col md:flex-row justify-between items-center'>
                <div>
                    <h1 className='text-4xl font-bold mb-2'>{user.name}</h1>
                    <div className='flex gap-2 items-center'>
                        <p className='text-xs px-2 py-1 bg-purple-300/30 border border-purple-400/50 rounded-full'>{user.role}</p>
                        <p className='text-xs px-2 py-1 bg-emerald-300/30 border border-emerald-400/50 rounded-full'>{user.email}</p>
                    </div>
                </div>
                {
                    user.role === "Manager" ? <Button onClick={createProject} >Create New Project</Button> : <></>
                }
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {status.map(({ label, value }) => (
                    <div
                        key={label}
                        className="bg-white dark:bg-zinc-900 border border-border shadow-md rounded-xl p-6 text-center"
                    >
                        <h2 className="text-lg font-medium text-muted-foreground mb-2">
                            {label}
                        </h2>
                        <p className="text-5xl font-bold text-foreground">{value}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Dashboard