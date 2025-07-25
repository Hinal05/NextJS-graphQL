// lib/drupal.ts
const API_URL = process.env.DRUPAL_BASE_URL + "/jsonapi/menu_items/main";

export async function getMenu(name: string = "main") {
  const res = await fetch(`${process.env.DRUPAL_BASE_URL}/jsonapi/menu_items/${name}`);
  if (!res.ok) throw new Error("Failed to fetch menu");
  const json = await res.json();

  return json.data.map((item: any) => ({
    id: item.id,
    title: item.attributes.title,
    url: item.attributes.url,
    description: item.attributes.description,
  }));
}
