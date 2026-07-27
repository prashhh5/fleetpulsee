"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/cn";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/vehicles", label: "Vehicles" },
  { href: "/dashboard/drivers", label: "Drivers" },
  { href: "/dashboard/trips", label: "Trips" },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <nav className="flex h-full flex-col justify-between border-r border-line bg-surface px-4 py-6">
      <div>
        <Link href="/dashboard" className="mb-8 block font-mono text-sm tracking-widest text-fog">
          FLEETPULSE
        </Link>
        <ul className="flex flex-col gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition",
                    active
                      ? "bg-surface-raised text-paper"
                      : "text-fog hover:bg-surface-raised hover:text-paper",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-line pt-4">
        <p className="mb-2 truncate text-sm text-paper">{session?.user.name ?? "Signed in"}</p>
        <button
          onClick={async () => {
            await signOut();
            router.push("/");
            router.refresh();
          }}
          className="text-sm text-fog transition hover:text-alert"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
