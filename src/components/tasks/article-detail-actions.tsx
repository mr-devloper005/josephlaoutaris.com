"use client";

import { useMemo, useState } from "react";
import { Heart, Link as LinkIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  url: string;
  title: string;
};

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers / permissions issues
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}

export function ArticleDetailActions({ url, title }: Props) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = useMemo(() => ({ title, url }), [title, url]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button
        type="button"
        variant="ghost"
        className="gap-2 rounded-full px-3"
        onClick={() => setLiked((prev) => !prev)}
        aria-pressed={liked}
      >
        <Heart className={liked ? "h-4 w-4 fill-current" : "h-4 w-4"} />
        Like
      </Button>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          className="gap-2 rounded-full px-3"
          onClick={async () => {
            const ok = await copyToClipboard(url);
            setCopied(ok);
            window.setTimeout(() => setCopied(false), 1400);
          }}
        >
          <LinkIcon className="h-4 w-4" />
          {copied ? "Copied" : "Copy link"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="gap-2 rounded-full px-3"
          onClick={async () => {
            if (typeof navigator !== "undefined" && "share" in navigator) {
              try {
                // @ts-expect-error - Web Share API typing can vary by TS lib version
                await navigator.share(shareData);
                return;
              } catch {
                // ignore
              }
            }
            await copyToClipboard(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          }}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}

