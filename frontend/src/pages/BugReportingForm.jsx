import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { apiClient } from '@/lib/axios'
import { useAppStore } from '@/store/store'
import { GET_MY_PROJECTS_ROUTE } from '@/lib/routes'
import { CREATE_BUG_ROUTE } from '@/lib/routes'

function BugReportingForm() {

    const { user, token } = useAppStore();
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await apiClient.get(GET_MY_PROJECTS_ROUTE, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(res.data || []);
            } catch (err) {
                console.error("Failed to fetch projects", err);
            }
        };
        if (user) {
            fetchProjects();
        }
    }, [user]);

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

    const [attachments, setAttachments] = useState([]);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);

        const updated = [
            ...attachments,
            ...newFiles.filter(
                (newFile) => !attachments.some((f) => f.name === newFile.name)
            ),
        ];

        setAttachments(updated);
        e.target.value = "";
    };

    const removeFile = (name) => {
        setAttachments((prev) => prev.filter((file) => file.name !== name));
    };

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

        let uploadedAttachments = []
        try {
            uploadedAttachments = await Promise.all(
                attachments.map(async file => {
                    const fd = new FormData()
                    fd.append('file', file)
                    const res = await apiClient.post(
                        '/api/bugs/files/upload',
                        fd,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    )
                    return res.data
                })
            )
        } catch (uploadErr) {
            console.error(uploadErr)
            toast.error("One or more attachments failed to upload.")
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
            fromGithub: false,
            attachments: uploadedAttachments,
        }

        console.log({ payload });

        try {
            const res = await apiClient.post(
                CREATE_BUG_ROUTE,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            console.log(res.data)
            toast.success("Bug reported successfully!")
            setFormData({
                title: '',
                description: '',
                steps: '',
                expected: '',
                actual: '',
                severity: '',
                urgency: '',
                project: ''
            })
            setAttachments([])
        } catch (err) {
            console.error(err)
            toast.error("Failed to submit bug. Please try again.")
        }
    }

    return (
        <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
            <div className="bg-card border border-border rounded-xl p-6 dark:bg-sidebar shadow-md">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground mb-2">Bug Report</h1>
                    <p className="text-muted-foreground mb-4">
                        Please fill out the form below to report a bug.
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

                    {/* Expected Behavior */}
                    <div className="space-y-2">
                        <Label htmlFor="expected">Expected Behavior</Label>
                        <Textarea
                            id="expected"
                            name="expected"
                            value={formData.expected}
                            onChange={handleChange}
                            placeholder="What did you expect to happen?"
                            rows={3}
                        />
                    </div>

                    {/* Actual Behavior */}
                    <div className="space-y-2">
                        <Label htmlFor="actual">Actual Behavior</Label>
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
                            <Label htmlFor="severity">Project</Label>
                            <Select
                                value={formData.project}
                                onValueChange={(value) => handleSelectChange("project", value)}
                            >
                                <SelectTrigger id="project">
                                    <SelectValue placeholder="Select Project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map(project => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Severity Dropdown */}
                        <div className="space-y-2">
                            <Label htmlFor="severity">Severity</Label>
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
                            <Label htmlFor="urgency">Urgency</Label>
                            <Select
                                value={formData.urgency}
                                onValueChange={(value) => handleSelectChange("urgency", value)}
                            >
                                <SelectTrigger id="urgency">
                                    <SelectValue placeholder="Select priority" />
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

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="attachments" className="text-sm font-medium">
                            Attachments
                        </Label>
                        <input
                            type="file"
                            id="attachments"
                            multiple
                            onChange={handleFileChange}
                            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0 file:text-sm file:font-semibold
                   file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />

                        {attachments.length > 0 && (
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                {attachments.map((file, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center justify-between bg-gray-100 px-3 py-1 rounded-md"
                                    >
                                        <span className="truncate">{file.name}</span>
                                        <button
                                            onClick={() => removeFile(file.name)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={16} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full sm:w-auto">
                            Submit Bug Report
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default BugReportingForm
