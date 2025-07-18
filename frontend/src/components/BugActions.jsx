import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

import { useAppStore } from '@/store/store'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import { GET_DEVELOPERS_ROUTE } from '@/lib/routes'

function BugActions({ bug }) {
    const { user } = useAppStore();
    const navigate = useNavigate();
    const [developers , setDevelopers] = useState([]);

    const updateBugDetails = (bug) => {
        navigate(`/bugs/update-bug/${bug.id}`)
    }

    const fetchDevelopers = async() =>{
        const res = await apiClient.get(GET_DEVELOPERS_ROUTE);
        //console.log(res.data);
        setDevelopers(res.data);
    }
    
    useEffect(()=>{
        fetchDevelopers();
    },[])

    return (
        <div className='flex flex-col gap-4'>
            {user && user.role === "TESTER" &&
                <>

                    <div className="space-y-2 w-full">
                        <Label htmlFor="member">Assign To</Label>
                        <Select>
                            <SelectTrigger id="member">
                                <SelectValue placeholder="Select member" />
                            </SelectTrigger>
                            <SelectContent>
                                {developers.map((developer)=>(
                                    <SelectItem key={developer.id} value ={developer.id} >{developer.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <p>Actions</p>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                            <Button onClick={() => updateBugDetails(bug)}>Update the Details</Button>
                            <Button>Close the issue</Button>
                            <Button>Reassign</Button>
                            <Button>Delete</Button>
                        </div>
                    </div>

                </>
            }
            {user && user.role === "DEVELOPER" &&
                <>
                    <div>
                        <p>Actions</p>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                            <Button>Request to Work</Button>
                            <Button>Mark as Resolved</Button>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default BugActions