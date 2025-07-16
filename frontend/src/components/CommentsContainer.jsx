import React, { useState } from "react"
import Comment from "./Comment"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function CommentsContainer({ bugId, comments, onAddComment }) {
    const [newComment, setNewComment] = useState("")

    const handleSubmit = () => {
        if (newComment.trim() === "") return

        // handle the add comment

        setNewComment("")
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
                />
                <div className="mt-2 flex justify-end">
                    <Button onClick={handleSubmit}>Comment</Button>
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
