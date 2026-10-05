export function Brand({ href = "/" }: { href?: string }) {
  return (
    <a className="brand" href={href} aria-label="AngraJobs, início">
      <img className="brand-logo" src="/logo-angrajobs.png" alt="" aria-hidden="true" />
      <span className="brand-name">AngraJobs</span>
    </a>
  );
}
