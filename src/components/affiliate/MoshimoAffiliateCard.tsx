'use client';

import { useEffect, useMemo } from 'react';
import { useAffiliateMeasurement } from '@/components/affiliate/useAffiliateMeasurement';

const SOURCE_B64 = 'PCEtLSBTVEFSVCBNb3NoaW1vQWZmaWxpYXRlRWFzeUxpbmsgLS0+CjxzY3JpcHQgdHlwZT0idGV4dC9qYXZhc2NyaXB0Ij4KKGZ1bmN0aW9uKGIsYyxmLGcsYSxkLGUpe2IuTW9zaGltb0FmZmlsaWF0ZU9iamVjdD1hOwpiW2FdPWJbYV18fGZ1bmN0aW9uKCl7YXJndW1lbnRzLmN1cnJlbnRTY3JpcHQ9Yy5jdXJyZW50U2NyaXB0Cnx8Yy5zY3JpcHRzW2Muc2NyaXB0cy5sZW5ndGgtMl07KGJbYV0ucT1iW2FdLnF8fFtdKS5wdXNoKGFyZ3VtZW50cyl9OwpjLmdldEVsZW1lbnRCeUlkKGEpfHwoZD1jLmNyZWF0ZUVsZW1lbnQoZiksZC5zcmM9ZywKZC5pZD1hLGU9Yy5nZXRFbGVtZW50c0J5VGFnTmFtZSgiYm9keSIpWzBdLGUuYXBwZW5kQ2hpbGQoZCkpfSkKKHdpbmRvdyxkb2N1bWVudCwic2NyaXB0IiwiLy9kbi5tc21zdGF0aWMuY29tL3NpdGUvY2FyZGxpbmsvYnVuZGxlLmpzPzIwMjIwMzI5IiwibXNtYWZsaW5rIik7Cm1zbWFmbGluayh7Im4iOiLmtbflpJbml4XooYznlKgy5Y+j5aSJ5o+b44OX44Op44KwIEFcL0JGXC9DXC9P44K/44Kk44OXIFVTQjIuMUEg44Kr44K344Og44OpIFRJLTE2NSjmtbflpJZcL+aXheihjFwv44Kz44Oz44K744Oz44OIXC9VU0JcL+WFhembu1wv5rW35aSW5Ye65by1XC/lpInmj5tcL+ODl+ODqeOCsCkiLCJiIjoiIiwidCI6IiIsImQiOiJodHRwczpcL1wvdGh1bWJuYWlsLmltYWdlLnJha3V0ZW4uY28uanAiLCJjX3AiOiJcL0AwX21hbGxcL2thbmFlbWluYVwvY2FiaW5ldFwvazAwMVwvYTAwNiIsInAiOlsiXC9rMDAxLTQ5MDc5ODYyMDE2NTkuanBnIiwiXC9rMDAxLTQ5MDc5ODYyMDE2NTlfMi5qcGciXSwidSI6eyJ1IjoiaHR0cHM6XC9cL2l0ZW0ucmFrdXRlbi5jby5qcFwva2FuYWVtaW5hXC9rMDAxLTQ5MDc5ODYyMDE2NTlcLyIsInQiOiJyYWt1dGVuIiwicl92IjoiIn0sInYiOiIyLjEiLCJiX2wiOlt7ImlkIjoxLCJ1X3R4Ijoi5qW95aSp5biC5aC044Gn6KaL44KLIiwidV9iYyI6IiNmNzY5NTYiLCJ1X3VybCI6Imh0dHBzOlwvXC9pdGVtLnJha3V0ZW4uY28uanBcL2thbmFlbWluYVwvazAwMS00OTA3OTg2MjAxNjU5XC8iLCJhX2lkIjo1NzgxNTE1LCJwX2lkIjo1NCwicGxfaWQiOjI3MDU5LCJwY19pZCI6NTQsInNfbiI6InJha3V0ZW4iLCJ1X3NvIjoxfSx7ImlkIjozLCJ1X3R4IjoiWWFob28h44K344On44OD44OU44Oz44Kw44Gn6KaL44KLIiwidV9iYyI6IiM2NmE3ZmYiLCJ1X3VybCI6Imh0dHBzOlwvXC9zaG9wcGluZy55YWhvby5jby5qcFwvc2VhcmNoP2ZpcnN0PTFcdTAwMjZwPSVFNiVCNSVCNyVFNSVBNCU5NiVFNiU5NyU4NSVFOCVBMSU4QyVFNyU5NCVBODIlRTUlOEYlQTMlRTUlQTQlODklRTYlOEYlOUIlRTMlODMlOTclRTMlODMlQTklRTMlODIlQjAlMjBBJTJGQkYlMkZDJTJGTyVFMyU4MiVCRiVFMyU4MiVBNCVFMyU4MyU5NyUyMFVTQjIuMUElMjAlRTMlODIlQUIlRTMlODIlQjclRTMlODMlQTAlRTMlODMlQTklMjBUSS0xNjUoJUU2JUI1JUI3JUU1JUE0JTk2JTJGJUU2JTk3JTg1JUU4JUExJThDJTJGJUUzJTgyJUIzJUUzJTgzJUIzJUUzJTgyJUJCJUUzJTgzJUIzJUUzJTgzJTg4JTJGVVNCJTJGJUU1JTg1JTg1JUU5JTlCJUJCJTJGJUU2JUI1JUI3JUU1JUE0JTk2JUU1JTg3JUJBJUU1JUJDJUI1JTJGJUU1JUE0JTg5JUU2JThGJTlCJTJGJUUzJTgzJTk3JUUzJTgzJUE5JUUzJTgyJUIwKSIsImFfaWQiOjU3ODE1MTgsInBfaWQiOjEyMjUsInBsX2lkIjoyNzA2MSwicGNfaWQiOjE5MjUsInNfbiI6InlhaG9vIiwidV9zbyI6Mn1dLCJlaWQiOiJJMjJFNCIsInMiOiJzIn0pOwo8L3NjcmlwdD4KPGRpdiBpZD0ibXNtYWZsaW5rLUkyMkU0Ij7jg6rjg7Pjgq88L2Rpdj4KPCEtLSBNb3NoaW1vQWZmaWxpYXRlRWFzeUxpbmsgRU5EIC0tPg==';
const CARD_ID = 'moshimo-card-study-work-hub-packing-list';
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-VHFZBP0192';

declare global {
  interface Window {
    __moshimoParsedCardIds?: Set<string>;
  }
}

function decodeSource() {
  return new TextDecoder().decode(
    Uint8Array.from(atob(SOURCE_B64), (character) => character.charCodeAt(0))
  );
}

export default function MoshimoAffiliateCard() {
  const sourceHtml = useMemo(() => decodeSource(), []);
  const affiliateMeasurement = useAffiliateMeasurement<HTMLElement>({
    measurementId: GA_MEASUREMENT_ID,
    siteId: '686751',
    programId: 'moshimo-easy-link',
    placementId: 'article_inline_1',
    materialType: 'product_card',
  });

  useEffect(() => {
    const wrapper = affiliateMeasurement.elementRef.current;
    if (!wrapper) return;

    window.__moshimoParsedCardIds ??= new Set<string>();
    if (!window.__moshimoParsedCardIds.has(CARD_ID)) {
      const source = wrapper.querySelector<HTMLElement>('[data-moshimo-source]');
      source?.querySelectorAll('script').forEach((original) => {
        const executable = document.createElement('script');
        for (const attribute of Array.from(original.attributes)) {
          executable.setAttribute(attribute.name, attribute.value);
        }
        executable.text = original.textContent ?? '';
        document.body.append(executable);
        executable.remove();
      });
      window.__moshimoParsedCardIds.add(CARD_ID);
    }

    return () => {
      window.__moshimoParsedCardIds?.delete(CARD_ID);
    };
  }, [affiliateMeasurement.elementRef]);

  return (
    <aside
      ref={affiliateMeasurement.elementRef}
      onClickCapture={affiliateMeasurement.onClickCapture}
      id={CARD_ID}
      aria-label="海外旅行用変換プラグの広告"
      data-affiliate-network="moshimo"
      data-affiliate-site-id="686751"
      data-affiliate-program-id="moshimo-easy-link"
      data-affiliate-placement-id="article_inline_1"
      data-affiliate-material-type="product_card"
      className="my-10 rounded-xl border border-gray-200 bg-white p-4"
    >
      <p className="mb-2 text-xs font-normal leading-5 text-gray-600">広告（PR）</p>
      <div data-moshimo-source dangerouslySetInnerHTML={{ __html: sourceHtml }} />
      <script
        dangerouslySetInnerHTML={{
          __html:
            "window.__moshimoParsedCardIds ??= new Set(); window.__moshimoParsedCardIds.add('" +
            CARD_ID +
            "');",
        }}
      />
    </aside>
  );
}
