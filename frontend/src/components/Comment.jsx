import React from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

export default function Comment({ comment }) {
    return (
        <div className="flex items-start gap-4 p-4 bg-muted rounded-lg shadow-sm border border-border">
            <Avatar className="h-10 w-10">
                <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{comment.user.name}</span>
                    <span>·</span>
                    <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                </div>
                <p className="mt-1 text-sm">{comment.text}</p>
            </div>
        </div>
    )
}
