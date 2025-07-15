import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

function BugReportingForm() {
    const [screenshot, setScreenshot] = useState(null)
    const [previewURL, setPreviewURL] = useState(null)

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setScreenshot(file)
            setPreviewURL(URL.createObjectURL(file))
        }
    }

    return (
        <main className="p-4 md:p-8 lg:p-12 flex flex-col gap-6 bg-background">
            <div className="bg-card border border-border shadow-sm rounded-xl p-6 dark:bg-sidebar">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground mb-2">Bug Report</h1>
                    <p className="text-muted-foreground mb-4">
                        Please fill out the form below to report a bug.
                    </p>
                </div>
                <form action="" method="post" className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" placeholder="Short summary of the bug" required />
                    </div>

                    {/* Description */}
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

                    {/* Steps to Reproduce */}
                    <div className="space-y-2">
                        <Label htmlFor="steps">Steps to Reproduce</Label>
                        <Textarea
                            id="steps"
                            name="steps"
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
                            placeholder="What actually happened?"
                            rows={3}
                        />
                    </div>

                    {/* Screenshot Upload */}
                    <div className="space-y-2">
                        <Label htmlFor="screenshot">Upload Screenshot</Label>
                        <Input
                            id="screenshot"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file:text-muted file:bg-secondary file:border-0 file:rounded-md file:py-1 file:px-3"
                        />
                        {previewURL && (
                            <div className="mt-4">
                                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                                <img
                                    src={previewURL}
                                    alt="Screenshot Preview"
                                    className="rounded-lg border w-full max-w-sm"
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
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
