import { ArrowUpRight, InfoIcon } from "lucide-react";
import Link from "next/link";

/**
 * it's conifugured at:
 * - https://supabase.com/docs/guides/auth/auth-smtp
 * - https://app.loops.so/transactional/cm6s8ygnr000wfol33mkpdzlc?stepName=Compose
 * @returns 
 */
export function SmtpMessage() {
  return null

  return (
    <div className="bg-muted/50 px-5 py-3 border rounded-md flex gap-4">
      <InfoIcon size={16} className="mt-0.5" />
      <div className="flex flex-col gap-1">
        <small className="text-sm text-secondary-foreground">
          <strong> Note:</strong> Emails are rate limited. Enable Custom SMTP to
          increase the rate limit.
        </small>
        <div>
          <Link
            href="https://supabase.com/docs/guides/auth/auth-smtp"
            target="_blank"
            className="text-primary/50 hover:text-primary flex items-center text-sm gap-1"
          >
            Learn more <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
