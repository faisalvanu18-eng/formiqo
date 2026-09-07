import type { FormVersion } from "@/lib/types";
import { ExternalIcon } from "./icons";

/**
 * Shows official source, application type, notification/version and the
 * official application link.
 */
export function TrustIndicators({ version }: { version: FormVersion }) {
  return (
    <div className="card p-5">
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Authority
          </dt>
          <dd className="break-words text-slate-800">{version.authority}</dd>
        </div>
        {version.applicationType && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Application type
            </dt>
            <dd className="text-slate-800">{version.applicationType}</dd>
          </div>
        )}
        {version.notification && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Notification / version
            </dt>
            <dd className="text-slate-800">{version.notification}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Official application
          </dt>
          <dd>
            <a
              href={version.officialUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1 font-medium text-brand-700 hover:underline"
            >
              Official website <ExternalIcon className="h-3.5 w-3.5" />
            </a>
          </dd>
        </div>
      </dl>
    </div>
  );
}
