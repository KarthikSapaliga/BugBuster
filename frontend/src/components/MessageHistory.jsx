import { formatDate } from "@/lib/utils";
import { User, CheckCircle, CheckSquare } from "lucide-react";

function parseMessage(msg, type) {
  const [timestampRaw, content] = msg.split("] ");
  const timestamp = timestampRaw.replace("[", "");
  return {
    timestamp: new Date(timestamp),
    content,
    type,
  };
}

function MessageHistory({ bug }) {
  // Combine assignment and resolve messages
  const combinedMessages = [
    ...(bug.assignmentMessages || []).map((msg) =>
      parseMessage(msg, "assignment")
    ),
    ...(bug.resolveMessages || []).map((msg) => parseMessage(msg, "resolve")),
    ...(bug.closeMessages || []).map((msg) => parseMessage(msg, "closed")),
  ];

  // Sort by timestamp
  combinedMessages.sort((a, b) => a.timestamp - b.timestamp);

  return (
    <>
      {/* Interleaved Assignment and Resolve Messages */}
      {combinedMessages.length > 0 && (
        <div>
          <ul className="space-y-2 pl-4 border-l border-border">
            {combinedMessages.map((msg, idx) => (
              <li
                key={`${msg.type}-${idx}`}
                className="text-sm text-muted-foreground flex gap-1"
              >
                <span className="font-mono text-xs w-40">
                  {formatDate(msg.timestamp)}
                </span>
                <div>
                  
                  {msg.type === "assignment" && (
                    <>
                    —{" "}
                      <User className="inline w-3 h-3 mr-1 text-blue-500" />
                      {msg.content}
                    </>
                  )}
                  {msg.type === "resolve" && (
                    <>
                    —{" "}
                      <CheckSquare className="inline w-3 h-3 mr-1 text-yellow-500" />
                      {msg.content}
                    </>
                  )}
                  {msg.type === "closed" && (
                    <>
                    —{" "}
                      <CheckCircle className="inline w-3 h-3 mr-1 text-green-500" />
                      {msg.content}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default MessageHistory;
