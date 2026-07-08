import { bands } from "@/data/bands";
import { locales } from "@/lib/i18n";

export function generateStaticParams() {
  const params: { locale: string; slug: string; memberId: string }[] = [];
  for (const locale of locales) {
    for (const band of bands) {
      for (const member of band.members) {
        params.push({ locale, slug: band.slug, memberId: member.id });
      }
    }
  }
  return params;
}

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
