import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { apiClient } from "@/lib/axios"
import { GET_USER_ROUTE } from "@/lib/routes"

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
            <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                <div>
                    <CardTitle className="text-base">{name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                        {formattedTime}
                    </CardDescription>
                </div>
                <Avatar className="h-8 w-8">
                    <AvatarFallback>{name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground pt-0">
                {content}
            </CardContent>
        </Card>
    )
}
