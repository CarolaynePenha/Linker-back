import urlMetadata from "url-metadata";

export default async function getMetadata(url) {
  try {
    const metadata = await urlMetadata(url);
    return metadata;
  } catch (err) {
    console.log("fetch error:", err);
  }
}
