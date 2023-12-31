import { writingResolver } from "@libs/resolvers";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { Body, Heading, SkewBlock } from "@libs/shared-ui";
import { ko } from "date-fns/locale";

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
            I primarily write articles on development, journal, and lessons
            aimed at being remembered for a long time.
          </Body>
        </div>
      </SkewBlock>

      <ul className="container">
        {writings.map((writing) => (
          <li key={writing.slug} className="py-6 border-b-2 last:border-0">
            <Link
              href={`writings/${writing.slug}`}
              className="flex flex-col gap-4"
            >
              <div className="flex gap-3 ">
                {writing.tags.map((tag) => (
                  <div key={tag} className="px-2 py-1 bg-primary rounded-md">
                    <Body level={1} weight="500">
                      {tag}
                    </Body>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <Body level={3} weight="600">
                  {writing.title}
                </Body>
                <div className="flex flex-col gap-1">
                  <Body level={2}>{writing.description}</Body>
                  <Body level={1}>
                    {formatDistanceToNowStrict(new Date(writing.createdAt), {
                      addSuffix: true,
                      locale: ko,
                    })}
                    &nbsp;작성됨
                  </Body>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
