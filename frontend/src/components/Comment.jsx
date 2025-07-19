import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserName } from "@/lib/api";

export default function Comment({ comment }) {
  const { author, content, timestamp } = comment;

  const [commentAuthor, SetCommentAuthor] = useState("");

  useEffect(() => {
    async function getAuthorName() {
      const name = await getUserName(author);

      SetCommentAuthor(name);
    }
    getAuthorName();
  }, []);

  const formattedTime = timestamp
    ? format(new Date(timestamp), "PPpp")
    : "Unknown time";

  return (
    <Card className="border-muted/80 w-full bg-sidebar">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="flex gap-3 items-center">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground text-xs font-semibold">
              {commentAuthor?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-base font-medium">
            {commentAuthor}
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground font-medium whitespace-nowrap">
          {formattedTime}
        </CardDescription>
      </CardHeader>
      <CardContent className="ml-11 text-sm text-muted-foreground pt-0 leading-relaxed">
        {content}
      </CardContent>
    </Card>
  );
}
