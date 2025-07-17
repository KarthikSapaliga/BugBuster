import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

import MultiSelect from '@/components/MultiSelect'

const OPTIONS = [
    { label: "Jake", value: "jake" },
    { label: "Sara", value: "sara" },
    { label: "Frank", value: "frank" },
];

function CreateProjectForm() {


    const handleSelection = (values) => {
        console.log({ values })
    };

    return (
        <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
            <div className="bg-card border border-border shadow-sm rounded-xl p-6 dark:bg-sidebar">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground mb-2">Create Project</h1>
                    <p className="text-muted-foreground mb-4">
                        Please fill out the form below to create a Project.
                    </p>
                </div>
                <form action="" method="post" className="space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="title">Project Name</Label>
                        <Input id="title" name="title" placeholder="Short summary of the bug" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe the bug in detail..."
                            rows={5}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Github Repository Link</Label>
                        <Input id="title" name="title" placeholder="Project github repository link" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Github Token</Label>
                        <Input id="title" name="title" placeholder="Enter github token" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Add Team Members</Label>
                        <MultiSelect options={OPTIONS} onChange={handleSelection} placeholder="Select Team Members" />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full sm:w-auto">
                            Create Project
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default CreateProjectForm
