import { bands } from "@/data/bands";

export function generateStaticParams() {
  const locales = ["zh", "ja", "en"];
  return bands.flatMap((band) =>
    locales.map((locale) => ({
      locale,
      slug: band.slug,
    }))
  );
}

export function generateMemberStaticParams() {
  const locales = ["zh", "ja", "en"];
  const params: { locale: string; slug: string; memberId: string }[] = [];
  for (const band of bands) {
    if (band.members) {
      for (const member of band.members) {
        for (const locale of locales) {
          params.push({ locale, slug: band.slug, memberId: member.id });
        }
      }
    }
  }
  return params;
}
