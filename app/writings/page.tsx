import { writingResolver } from "@libs/resolvers";
import { format } from "date-fns";
import Link from "next/link";
import { Body, Heading, SkewBlock } from "@libs/shared-ui";

export default async function Writings() {
  const writings = await writingResolver.writings();

  return (
    <div>
      <SkewBlock>
        <div className="flex flex-col gap-4">
          <Heading level={2} weight="500">
            Writings
          </Heading>
          <Body level={1}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the standard dummy text ever since
            the 1500s, when an unknown printer.
          </Body>
        </div>
      </SkewBlock>

      <ul className="container">
        {writings.map((writing) => (
          <li key={writing.slug} className="py-10 border-b-2 last:border-0">
            <Link
              href={`writings/${writing.slug}`}
              className="flex flex-col gap-4"
            >
              <div className="flex gap-2 ">
                {writing.tags.map((tag) => (
                  <div key={tag} className="px-2 py-1 bg-primary rounded-md">
                    <Body level={1} weight="500">
                      {tag}
                    </Body>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <Body level={2} weight="600">
                  {writing.title}
                </Body>
                <Body level={1}>{writing.description}</Body>
                <Body level={1}>
                  {format(new Date(writing.createdAt), "yyyy년 MM월 dd일")}
                </Body>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
