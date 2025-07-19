import React, { useState } from "react"
import Comment from "./Comment"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/axios"
import { useAppStore } from "@/store/store"
import toast from "react-hot-toast"

import { GET_COMMENTS_ROUTE, POST_COMMENT_ROUTE } from "@/lib/routes"

export default function CommentsContainer({ bugId, comments, setComments }) {
    const [newComment, setNewComment] = useState("")
    const [loading, setLoading] = useState(false)

    const { token } = useAppStore()

    const handleSubmit = async () => {
        if (newComment.trim() === "") return

        try {
            setLoading(true)
            const res = await apiClient.post(`${POST_COMMENT_ROUTE}/${bugId}`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            const commentRes = await apiClient.get(`${GET_COMMENTS_ROUTE}/${bugId}`)
            setComments(commentRes.data)

            setNewComment("")
        } catch (err) {
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-6 space-y-6">
            <h2 className="text-xl font-semibold">Comments</h2>

            <div className="border-t pt-4 mt-4">
                <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment"
                    rows={5}
                    disabled={loading}
                />
                <div className="mt-2 flex justify-end">
                    <Button onClick={handleSubmit} disabled={loading || newComment.trim() === ""}>
                        {loading ? "Posting..." : "Comment"}
                    </Button>
                </div>
            </div>

            {comments.length > 0 ? (
                comments.map((cmt, idx) => <Comment key={idx} comment={cmt} />)
            ) : (
                <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
            )}
        </div>
    )
}
