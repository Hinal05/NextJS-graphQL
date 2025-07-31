// components/Header.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="p-4 bg-black text-white flex justify-between items-center">
      <nav>
        <ul className="flex space-x-4">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          {session && (
            <li><Link href="/articles">Articles</Link></li>
          )}
        </ul>
      </nav>

      <div>
        {session ? (
          <div className="flex items-center space-x-4">
            <span>👤 {session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

// import { getMenu } from "@/lib/drupal";
// import Link from "next/link";

// export async function Header() {
//   const menu = await getMenu("main");

//   return (
//     <header className="p-4 bg-black border-b">
//       <nav>
//         <ul className="flex space-x-4">
//           {menu.map((item) => (
//             <li key={item.id}>
//               <Link href={item.url}>{item.title}</Link>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </header>
//   );
// }
