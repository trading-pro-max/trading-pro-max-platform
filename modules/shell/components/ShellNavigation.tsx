import Link from "next/link";

export type ShellNavigationItem = {
  href: string;
  label: string;
};

type ShellNavigationProps = {
  items: ShellNavigationItem[];
  label: string;
  variant: "public" | "founder";
};

export default function ShellNavigation({
  items,
  label,
  variant,
}: ShellNavigationProps) {
  return (
    <div
      className={`tpm-shell-nav tpm-shell-nav-${variant} ${
        variant === "public" ? "tpm-public-nav tpm-foundation-nav-links" : ""
      }`}
      aria-label={label}
    >
      {items.map((item) => (
        <Link key={`${item.href}-${item.label}`} href={item.href} className="tpm-foundation-link">
          {item.label}
        </Link>
      ))}
    </div>
  );
}
