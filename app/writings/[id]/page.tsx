import { format } from "date-fns";
import Image from "next/image";

const writing = {
  id: "1",
  title: "세이노의 가르침",
  content: `What is Lorem Ipsum?
  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
  
  Why do we use it?
  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`,
  tags: ["book"],
  createdAt: new Date().toISOString(),
};

export default function WritingDetail() {
  return (
    <main className="flex flex-col gap-10">
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
        <h2 className="text-[38px] text-gray300 mb-3 font-bold">
          {writing.title}
        </h2>
        <div className="flex items-center gap-4">
          <div className="rounded-full overflow-hidden w-[30px] h-[30px]">
            <Image width={30} height={30} src="/assets/me.jpg" alt="me!" />
          </div>
          <p className="flex items-center gap-1">
            <span className="text-gray100">정인엽</span>
            <i>·</i>
            <time>
              {format(new Date(writing.createdAt), "yyyy년 MM월 dd일 HH:mm")}
            </time>
          </p>
        </div>
      </header>
      <div className="whitespace-pre-line">{writing.content}</div>
    </main>
  );
}
