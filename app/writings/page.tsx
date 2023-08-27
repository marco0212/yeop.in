import { LIST_WRITING } from "@/libs/dummy";
import { format } from "date-fns";
import Link from "next/link";

const writings = LIST_WRITING;

export default function Writings() {
  return (
    <main>
      <header className="mb-5">
        <h2 className="text-[38px] text-gray300 mb-3">Writings</h2>
        <p className="text-gray100 text-[20px]">
          내가 겪은 것, 읽은 것, 본 것에 대해 느낀 점을 적은 글입니다.
        </p>
      </header>

      <ul>
        {writings.map((writing) => (
          <li
            key={writing.id}
            className="py-10 border-b-2 border-gray100/20 last:border-0"
          >
            <Link
              href={`writings/${writing.id}`}
              className="flex flex-col gap-4"
            >
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
              <div className="flex flex-col gap-4">
                <h3 className="text-[24px] text-gray200 font-bold">
                  {writing.title}
                </h3>
                <p className="h-[42px] overflow-hidden text-100 whitespace-pre-line">
                  {writing.summary}
                </p>
                <time className="text-gray200">
                  {format(
                    new Date(writing.createdAt),
                    "yyyy년 MM월 dd일 HH:mm"
                  )}
                </time>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}