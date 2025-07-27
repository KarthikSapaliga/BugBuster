import { User, CheckCircle, XCircle } from "lucide-react";

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
    ...(bug.resolveMessages || []).map((msg) =>
      parseMessage(msg, "resolve")
    ),
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
              <li key={`${msg.type}-${idx}`} className="text-sm text-muted-foreground">
                <span className="font-mono text-xs">
                  {msg.timestamp.toISOString()}
                </span>{" "}
                —{" "}
                {msg.type === "assignment" && (
                  <>
                    <User className="inline w-3 h-3 mr-1 text-blue-500" />
                    {msg.content}
                  </>
                )}
                {msg.type === "resolve" && (
                  <>
                    <CheckCircle className="inline w-3 h-3 mr-1 text-green-500" />
                    {msg.content}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {bug.closeMessages && bug.closeMessages.length > 0 && (
        <div>
          <h2 className="text-md font-semibold mb-2 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Closure History
          </h2>
          <ul className="space-y-2 pl-4 border-l border-border">
            {bug.closeMessages.map((msg, idx) => {
              const [time, text] = msg.split("] ");
              return (
                <li
                  key={`close-${idx}`}
                  className="text-sm text-muted-foreground"
                >
                  <span className="font-mono text-xs">
                    {time.replace("[", "")}
                  </span>{" "}
                  — {text}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

export default MessageHistory