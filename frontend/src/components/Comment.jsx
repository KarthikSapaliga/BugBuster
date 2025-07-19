import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format } from "date-fns"
import { getUserName } from "@/lib/api"
import { apiClient } from "@/lib/axios"
import { GET_USER_ROUTE } from "@/lib/routes"

export default function Comment({ comment }) {
    const { author, content, timestamp } = comment
    const [name, setName] = useState("")

    useEffect(() => {
        const fetchName = async () => {
            const res = await apiClient.get(`${GET_USER_ROUTE}/${author}`)
            setName(res.data.name)
        }
        if (author) fetchName()
    }, [author])


    const formattedTime = timestamp
        ? format(new Date(timestamp), "PPpp")
        : "Unknown time"

    return (
        <Card className="border-muted/40">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{name}</CardTitle>
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
