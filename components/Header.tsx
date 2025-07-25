// components/Header.tsx
import { getMenu } from "@/lib/drupal";
import Link from "next/link";

export async function Header() {
  const menu = await getMenu("main");

  return (
    <header className="p-4 bg-black border-b">
      <nav>
        <ul className="flex space-x-4">
          {menu.map((item) => (
            <li key={item.id}>
              <Link href={item.url}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
