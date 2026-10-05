export function Brand({ href = "/" }: { href?: string }) {
  return (
    <a className="brand" href={href} aria-label="AngraJobs, início">
      <img
  src="/logo-angrajobs.png"
  alt=""
  className="brand-logo"
/>
      <span className="brand-name">AngraJobs</span>
    </a>
  );
}
