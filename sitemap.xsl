<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="tr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>Site Haritasi | Taftri</title>
        <style>
          :root{--navy:#0A1628;--navy2:#12233F;--gold:#F5A623;--paper:#F7F7F5;
                --ink:#1B1F27;--ink2:#5A6172;--line:#E3E5EA}
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:ui-sans-serif,system-ui,'Segoe UI',sans-serif;
               background:var(--paper);color:var(--ink);line-height:1.6;padding:28px 18px}
          .kap{max-width:1000px;margin:0 auto}
          header{border-bottom:2px solid var(--navy);padding-bottom:16px;margin-bottom:22px}
          h1{font-size:23px;font-weight:800;letter-spacing:-.02em;color:var(--navy)}
          h1 span{color:var(--gold)}
          .ozet{margin-top:6px;color:var(--ink2);font-size:14.5px}
          table{width:100%;border-collapse:collapse;background:#fff;
                border:1px solid var(--line);border-radius:10px;overflow:hidden}
          th{background:var(--navy);color:#fff;text-align:left;font-size:12px;
             letter-spacing:.06em;text-transform:uppercase;padding:11px 14px;font-weight:700}
          td{padding:11px 14px;border-top:1px solid var(--line);font-size:14.5px;
             vertical-align:top}
          tr:hover td{background:#FAFAF8}
          a{color:var(--navy2);text-decoration:none;word-break:break-word}
          a:hover{color:var(--gold);text-decoration:underline}
          .dil{display:inline-block;font-size:11px;font-weight:700;color:var(--ink2);
               border:1px solid var(--line);border-radius:99px;padding:1px 7px;margin-right:4px}
          .sag{text-align:right;color:var(--ink2);white-space:nowrap;font-size:13.5px}
          .tablo-kap{overflow-x:auto;-webkit-overflow-scrolling:touch}
          table{min-width:640px}
          td:first-child{max-width:460px}
          @media (max-width:640px){
            body{padding:18px 12px}
            th,td{padding:9px 10px;font-size:13.5px}
          }
          footer{margin-top:18px;color:var(--ink2);font-size:13px}
        </style>
      </head>
      <body>
        <div class="kap">
          <header>
            <h1>taf<span>tri</span> — Site Haritası</h1>
            <p class="ozet">
              Toplam <strong><xsl:value-of select="count(s:urlset/s:url)" /></strong> adres.
              Bu sayfa arama motorları için hazırlanmıştır; okunabilir olması için biçimlendirilmiştir.
            </p>
          </header>
          <div class="tablo-kap">
          <table>
            <tr>
              <th>Adres</th>
              <th>Diller</th>
              <th class="sag">Güncelleme</th>
              <th class="sag">Öncelik</th>
            </tr>
            <xsl:for-each select="s:urlset/s:url">
              <xsl:sort select="s:priority" order="descending" />
              <tr>
                <td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td>
                <td>
                  <xsl:for-each select="xhtml:link">
                    <span class="dil"><xsl:value-of select="@hreflang" /></span>
                  </xsl:for-each>
                </td>
                <td class="sag"><xsl:value-of select="s:lastmod" /></td>
                <td class="sag"><xsl:value-of select="s:priority" /></td>
              </tr>
            </xsl:for-each>
          </table>
          </div>
          <footer>Site haritası adresi: https://taftri.com/sitemap.xml</footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
