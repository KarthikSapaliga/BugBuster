import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/axios'
import { useAppStore } from '@/store/store'
import { useParams } from 'react-router-dom'
import { GET_MY_PROJECTS_ROUTE, GET_BUG_BY_ID_ROUTE, UPDATE_BUG_ROUTE } from '@/lib/routes'

function BugUpdateForm() {
    const params = useParams()
    const bugId = params.id

    const { user, token } = useAppStore()
    const [projects, setProjects] = useState([])
    const [bug, setBug] = useState(null)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        steps: '',
        expected: '',
        actual: '',
        severity: '',
        urgency: '',
        project: ''
    })

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await apiClient.get(GET_MY_PROJECTS_ROUTE, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setProjects(res.data || [])
            } catch (err) {
                console.error("Failed to fetch projects", err)
            }
        }

        const fetchBugInfo = async () => {
            try {
                const res = await apiClient.get(`${GET_BUG_BY_ID_ROUTE}/${bugId}`)
                setBug(res.data)

                setFormData({
                    title: res.data.title || '',
                    description: res.data.description || '',
                    steps: res.data.reproductionSteps || '',
                    expected: res.data.expectedOutcome || '',
                    actual: res.data.actualOutcome || '',
                    severity: res.data.severity || '',
                    urgency: res.data.urgency || '',
                    project: res.data.projectId || ''
                })
            } catch (err) {
                console.error(err)
                toast.error("Failed to fetch the bug info")
            }
        }

        if (user) {
            fetchProjects()
        }

        if (bugId) {
            fetchBugInfo()
        }
    }, [user, bugId])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.title || !formData.description || !formData.severity || !formData.urgency || !formData.project) {
            toast.error("Please fill in all required fields.")
            return
        }

        const payload = {
            id: bugId,
            title: formData.title,
            description: formData.description,
            state: bug?.state || "OPEN",
            reproductionSteps: formData.steps,
            expectedOutcome: formData.expected,
            actualOutcome: formData.actual,
            severity: formData.severity,
            urgency: formData.urgency,
            projectId: formData.project,
            fromGithub: bug?.fromGithub || false,
            attachments: bug?.attachments || []
        }

        try {
            const res = await apiClient.put(
                `${UPDATE_BUG_ROUTE}/${bugId}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            toast.success("Bug updated successfully!")
        } catch (err) {
            console.error(err)
            toast.error("Failed to update bug. Please try again.")
        }
    }

    return (
        <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
            <div className="bg-card border border-border rounded-xl p-6 dark:bg-sidebar shadow-md">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground mb-2">Update Bug</h1>
                    <p className="text-muted-foreground mb-4">
                        Update the details of the bug you reported.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
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

                    {/* Description */}
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

                    {/* Steps to Reproduce */}
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

                    {/* Expected Outcome */}
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

                    {/* Actual Outcome */}
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
                        {/* Project Dropdown */}
                        <div className="space-y-2">
                            <Label>Project</Label>
                            <Select
                                value={formData.project}
                                onValueChange={(value) => handleSelectChange("project", value)}
                            >
                                <SelectTrigger id="project">
                                    <SelectValue placeholder="Select Project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map(project => (
                                        <SelectItem key={project.id} value={project.id}>
                                            {project.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Severity Dropdown */}
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

                        {/* Urgency Dropdown */}
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

                    {/* Existing Attachments */}
                    {bug?.attachments?.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Existing Attachments</Label>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                                {bug.attachments.map((file, idx) => (
                                    <li key={idx}>
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            {file.originalName || file.filename}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="pt-4">
                        <Button type="submit" className="w-full sm:w-auto">
                            Update Bug
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default BugUpdateForm
