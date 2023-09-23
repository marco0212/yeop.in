import { writingResolver } from "@/libs/resolvers";
import { MarkdownRenderer } from "@/libs/shared-ui/MarkdownRenderer/ReactMarkdown";
import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";

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
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <div className="flex gap-2 ">
          {writing.tags.map((tag) => (
            <span
              className="border-2 border-primary px-2 inline-block text-white leading-loose text-primary"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-[38px] text-gray300 mb-3">{writing.title}</h2>
        <div className="flex items-center gap-4">
          <div className="rounded-full overflow-hidden w-[30px] h-[30px]">
            <Image width={30} height={30} src="/assets/me.jpg" alt="me!" />
          </div>
          <p className="flex items-center gap-1">
            <span className="text-gray100">정인엽</span>
            <i>·</i>
            <time>
              {format(new Date(writing.createdAt), "yyyy년 MM월 dd일")}
            </time>
          </p>
        </div>
      </header>
      <MarkdownRenderer source={writing.content} />
    </main>
  );
}
