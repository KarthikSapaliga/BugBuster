import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/axios'
import { useAppStore } from '@/store/store'
import { GITHUB_IMPORT_ROUTE } from '@/lib/routes'
import { useParams } from 'react-router-dom'

export default function ImportGithubIssueForm({ bug, closePage }) {
    const { user, token } = useAppStore()

    const { projectId } = useParams()

    console.log({ bug })

    const [formData, setFormData] = useState({
        title: bug?.title || '',
        description: bug?.description || '',
        steps: bug?.steps || '',
        expected: bug?.expected || '',
        actual: bug?.actual || '',
        severity: bug?.severity.toLowerCase() || '',
        urgency: bug?.urgency.toLowerCase() || '',
        project: projectId,
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.title || !formData.description || !formData.severity || !formData.urgency || !formData.project) {
            toast.error("Please fill in all required fields.")
            return
        }

        const payload = {
            title: formData.title,
            description: formData.description,
            state: "OPEN",
            reproductionSteps: formData.steps,
            expectedOutcome: formData.expected,
            actualOutcome: formData.actual,
            severity: formData.severity,
            urgency: formData.urgency,
            projectId: formData.project,
            attachments: bug?.attachments,
            fromGithub: true,
            issueId: bug?.issueId,
        }

        console.log({ payload })
        try {
            await apiClient.post(
                GITHUB_IMPORT_ROUTE,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            toast.success("Imported issue created successfully!")
        } catch (err) {
            console.error(err)
            toast.error("Failed to import issue.")
        }
    }

    return (
        <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background ">
            <div className="bg-card border border-border rounded-xl p-6 dark:bg-sidebar shadow-md">
                <div className='flex justify-between'>
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground mb-2">Import External Issue</h1>
                        <p className="text-muted-foreground mb-4">
                            Import and edit issue details before creating it in your project.
                        </p>
                    </div>
                    <div>
                        <button onClick={closePage} className='bg-red-400 p-2 rounded-sm'>Close</button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Short summary of the bug"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the bug in detail..."
                            rows={5}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="steps">Steps to Reproduce</Label>
                        <Textarea
                            id="steps"
                            name="steps"
                            value={formData.steps}
                            onChange={handleChange}
                            placeholder="Step-by-step instructions to reproduce the bug..."
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expected">Expected Outcome</Label>
                        <Textarea
                            id="expected"
                            name="expected"
                            value={formData.expected}
                            onChange={handleChange}
                            placeholder="What did you expect to happen?"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="actual">Actual Outcome</Label>
                        <Textarea
                            id="actual"
                            name="actual"
                            value={formData.actual}
                            onChange={handleChange}
                            placeholder="What actually happened?"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="space-y-2">
                            <Label>Severity</Label>
                            <Select
                                value={formData.severity}
                                onValueChange={(value) => handleSelectChange("severity", value)}
                            >
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

                        <div className="space-y-2">
                            <Label>Urgency</Label>
                            <Select
                                value={formData.urgency}
                                onValueChange={(value) => handleSelectChange("urgency", value)}
                            >
                                <SelectTrigger id="urgency">
                                    <SelectValue placeholder="Select urgency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full sm:w-auto">
                            Create Bug
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    )
}
