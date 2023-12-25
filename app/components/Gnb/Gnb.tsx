import { Body } from "@libs/shared-ui";
import { bind } from "@libs/shared-util/constructor";
import Link from "next/link";
import { useGnb } from "./useGnb";

export const Gnb = bind(useGnb, ({ menus }) => (
  <header className="container flex items-center justify-between py-3">
    <Link href="/">
      <Body level={3} display>
        yeop.in
      </Body>
    </Link>
    <ul className="flex gap-8">
      {menus.map((menu) => (
        <li key={menu}>
          <Body level={3}>
            <Link href={`/${menu}`}>{menu}</Link>
          </Body>
        </li>
      ))}
    </ul>
  </header>
));
