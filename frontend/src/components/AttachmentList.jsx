import { Download, FileImage, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HOST, BUG_DOWNLOAD_ROUTE } from "@/lib/routes";


export function isImageAttachment(attachment) {
  //For github
  if (attachment?.type === "image") return true;

  //For local files
  const ext = attachment.filename.split('.').pop().toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp','svg'].includes(ext);
}

export default function AttachmentList({  attachments = [],fromGithub = false,}) {
  if (!attachments.length) return null;

  console.log(attachments);

  return (
    <div className="mt-6 space-y-4 w-full">
      <h2 className="text-lg font-semibold">Attachments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {attachments.map((attachment, idx) => {
          const fileUrl = fromGithub
            ? attachment.filename
            : `${HOST}${BUG_DOWNLOAD_ROUTE}/${attachment.filename}`;

          const displayName = (() => {
            try {
              const url = new URL(attachment.originalName);
              const path = url.pathname; 
              const lastSegment = path.split("/").pop();
              return lastSegment || attachment.originalName;
            } catch {
              return attachment.originalName;
            }
          })();

          return (
            <Card key={idx} className="shadow-md p-1 h-60">
              <CardContent className="flex flex-col gap-2 p-2 items-center justify-between h-full">
                {isImageAttachment(attachment) ? (
                  <img
                    src={fileUrl}
                    alt={displayName}
                    className="max-h-40 object-contain rounded-md border border-muted"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col justify-center items-center gap-2 h-40">
                    <FileText className="size-16 text-muted-foreground" />
                    <p className="text-sm text-center break-words">
                      {displayName}
                    </p>
                  </div>
                )}

                <a
                  href={fileUrl}
                  download
                  className="w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full h-10">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
