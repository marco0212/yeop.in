import { writingResolver } from "@libs/resolvers";
import { Body, Heading, SkewBlock } from "@libs/shared-ui";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MdxRenderer } from "./feat-ui";

export async function generateStaticParams() {
  const writings = await writingResolver.writings();
  return writings.map((writing) => ({
    slug: writing.slug,
  }));
}

export default async function WritingDetail({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const writing = await writingResolver.writing(slug);

  if (!writing) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <SkewBlock>
        <header className="flex flex-col gap-4">
          <div className="flex gap-3">
            {writing.tags.map((tag) => (
              <div
                key={tag}
                className="px-2 py-1 border-white border-2 rounded-md"
              >
                <Body level={1} weight="500">
                  {tag}
                </Body>
              </div>
            ))}
          </div>
          <Heading level={1} weight="500">
            {writing.title}
          </Heading>
          <div className="flex items-center gap-4">
            <div className="rounded-full overflow-hidden w-[30px] h-[30px]">
              <Image width={30} height={30} src="/assets/me.jpg" alt="me!" />
            </div>
            <div className="flex items-center gap-1">
              <Body level={1}>정인엽</Body>
              <Body level={1}>·</Body>
              <Body level={1}>
                {format(new Date(writing.createdAt), "yyyy년 MM월 dd일")}
              </Body>
            </div>
          </div>
        </header>
      </SkewBlock>
      <div className="container">
        <MdxRenderer>{writing.content}</MdxRenderer>
      </div>
    </div>
  );
}
