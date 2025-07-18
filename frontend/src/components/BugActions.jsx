import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

import { useAppStore } from '@/store/store'

function BugActions({ bug }) {
    const { user } = useAppStore();
    const navigate = useNavigate();

    const updateBugDetails = (bug) => {
        navigate(`/bugs/update-bug/${bug.id}`)
    }

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
                                {/* <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="critical">Critical</SelectItem> */}
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