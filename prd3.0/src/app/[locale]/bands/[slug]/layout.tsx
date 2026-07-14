import { bands } from "@/data/bands";
import { locales } from "@/lib/i18n";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const band of bands) {
      params.push({ locale, slug: band.slug });
    }
  }
  return params;
}

export default function BandSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
