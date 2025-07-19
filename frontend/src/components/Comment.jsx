import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format } from "date-fns"
import { getUserName } from "@/lib/api";

export default function Comment({ comment }) {
    const { author, content, timestamp } = comment

    const [commentAuthor, SetCommentAuthor] = useState("");

    useEffect(()=>{
        async function getAuthorName() {
            const name = await getUserName(author);

            SetCommentAuthor(name);
        }
        getAuthorName();
    },[])

    const formattedTime = timestamp
        ? format(new Date(timestamp), "PPpp")
        : "Unknown time"

    return (
        <Card className="border-muted/40">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{commentAuthor}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                    {formattedTime}
                </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground pt-0">
                {content}
            </CardContent>
        </Card>
    )
}
