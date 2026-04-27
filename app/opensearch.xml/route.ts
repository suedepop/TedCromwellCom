import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/metadata";

export const runtime = "nodejs";
export const revalidate = 86400;

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>${SITE_NAME}</ShortName>
  <Description>${SITE_DESCRIPTION}</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="32" height="32" type="image/x-icon">${siteUrl("/favicon.ico")}</Image>
  <Url type="text/html" method="get" template="${siteUrl("/search")}?q={searchTerms}" />
  <moz:SearchForm xmlns:moz="http://www.mozilla.org/2006/browser/search/">${siteUrl("/search")}</moz:SearchForm>
</OpenSearchDescription>`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/opensearchdescription+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400",
    },
  });
}
