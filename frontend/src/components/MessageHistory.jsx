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

          <table className="w-full text-sm text-muted-foreground border-collapse">
            <tbody>
              {combinedMessages.map((msg, idx) => (
                <tr
                  key={`${msg.type}-${idx}`}
                  className="border-b border-border"
                >
                  <td className="px-2 py-1 font-mono text-xs whitespace-nowrap">
                    {formatDate(msg.timestamp)}
                  </td>
                  <td className="px-2 py-1">
                    {msg.type === "assignment" && (
                      <User className="w-4 h-4 text-blue-500" />
                    )}
                    {msg.type === "resolve" && (
                      <CheckSquare className="w-4 h-4 text-yellow-500" />
                    )}
                    {msg.type === "closed" && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </td>
                  <td className="px-2 py-1">{msg.content}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </>
  );
}

export default MessageHistory;
