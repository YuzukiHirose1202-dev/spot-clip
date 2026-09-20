import he from "he";

const url = "https://www.instagram.com/p/DdTXYTVGPTa/";

async function main() {
  const response = await fetch(url);
  const html = await response.text();

  const descriptionMatch = html.match(
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/
  );

  if (!descriptionMatch) {
    console.log("説明が見つかりませんでした");
    return;
  }

  const description = he.decode(descriptionMatch[1]);

  console.log(description);
}

main();