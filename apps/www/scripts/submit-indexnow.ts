export {}

const siteUrl = process.env.INDEXNOW_SITE_URL ?? "https://limeplay.winoffrg.dev"
const endpoint =
  process.env.INDEXNOW_ENDPOINT ?? "https://api.indexnow.org/indexnow"
const key = process.env.INDEXNOW_KEY

if (!key || !/^[A-Za-z0-9-]{8,128}$/.test(key)) {
  throw new Error(
    "INDEXNOW_KEY must contain 8-128 letters, numbers, or dashes."
  )
}

const siteOrigin = new URL(siteUrl).origin
const keyLocation = `${siteOrigin}/indexnow-key.txt`
const keyResponse = await fetch(keyLocation)
const publishedKey = (await keyResponse.text()).trim()

if (!keyResponse.ok || publishedKey !== key) {
  throw new Error(
    `IndexNow verification failed at ${keyLocation}. Deploy the same INDEXNOW_KEY before submitting URLs.`
  )
}

const sitemapUrl = `${siteOrigin}/sitemap.xml`
const sitemapResponse = await fetch(sitemapUrl)

if (!sitemapResponse.ok) {
  throw new Error(
    `Unable to fetch ${sitemapUrl}: HTTP ${sitemapResponse.status}`
  )
}

const sitemap = await sitemapResponse.text()
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1]
)

if (urlList.length === 0) {
  throw new Error(`No URLs found in ${sitemapUrl}`)
}

if (urlList.some((url) => new URL(url).origin !== siteOrigin)) {
  throw new Error("The sitemap contains a URL outside the configured host.")
}

const response = await fetch(endpoint, {
  body: JSON.stringify({
    host: new URL(siteOrigin).host,
    key,
    keyLocation,
    urlList,
  }),
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  method: "POST",
})

if (![200, 202].includes(response.status)) {
  const body = await response.text()
  throw new Error(
    `IndexNow returned HTTP ${response.status}${body ? `: ${body}` : ""}`
  )
}

console.log(`Submitted ${urlList.length} canonical URLs to IndexNow.`)
