export function Brand({ href = "/" }: { href?: string }) {
  return (
    <a className="brand" href={href} aria-label="AngraJobs, início">
      <span className="brand-mark" aria-hidden="true">AJ</span>
      <span className="brand-name">AngraJobs</span>
    </a>
  );
}
