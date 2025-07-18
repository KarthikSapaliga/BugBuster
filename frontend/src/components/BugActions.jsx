import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/ui/button'

import { useAppStore } from '@/store/store'

function BugActions({ bug }) {
    const { user } = useAppStore();

    return (
        <div className='flex flex-col gap-4'>
            {user && user.role === "TESTER" &&
                <>
                    <div className='flex gap-4 w-full'>
                        <div className="space-y-2 w-full">
                            <Label htmlFor="severity">Assign To</Label>
                            <Select>
                                <SelectTrigger id="severity">
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 w-full">
                            <Label htmlFor="severity">Severity</Label>
                            <Select>
                                <SelectTrigger id="severity">
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <p>Actions</p>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                            <Button>Update the Details</Button>
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