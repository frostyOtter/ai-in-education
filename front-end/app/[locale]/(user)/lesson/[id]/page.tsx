import { getLessonById } from "@/actions/lesson";
import { BackButton } from "@/components/back/button";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Book, BookOpen, Headphones, Lightbulb, PenTool } from "lucide-react";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{ id: string }>;
};

const LessonPage = async ({ params }: Params) => {
  const { id } = await params;
  const lesson = await getLessonById(Number(id));

  if (!lesson) {
    return notFound();
  }

  return (
    <div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">{lesson.title} Summary</h1>
          <p className="text-sm text-gray-500">
            Your AI assistant will help you synthetic all the lesson's
            information for you
          </p>
        </div>

        {/* Grammar Focus */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-3">
            <Book />
            <h3 className="font-semibold text-xl text-gray-900">
              Grammar Focus
            </h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Present Perfect for environmental actions:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>{'"I have recycled plastic bottles for years"'}</li>
              <li>{'"We have reduced our carbon footprint"'}</li>
              <li>{'"They have planted 100 trees this month"'}</li>
            </ul>
          </div>
        </div>

        {/* Key Vocabulary */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen />
            <h3 className="font-semibold text-xl text-gray-900">
              Key Vocabulary
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lesson.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 p-1.5 rounded-full text-sm font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Listening & Speaking */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-3">
            <Headphones />
            <h3 className="font-semibold text-xl text-gray-900">
              Listening & Speaking
            </h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Practice basic conversations about:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>The weather</li>
              <li>Nature and animals</li>
              <li>
                Simple environmental habits (e.g., recycling, turning off
                lights)
              </li>
            </ul>
            <p>
              Use simple sentence patterns like: “I always recycle”; “The
              weather is hot today”; “Trees help the Earth”
            </p>
          </div>
        </div>

        {/* Reading & Writing */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-3">
            <PenTool />
            <h3 className="font-semibold text-xl text-gray-900">
              Reading & Writing
            </h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Read short paragraphs about nature and climate.</li>
              <li>Match vocabulary words with pictures.</li>
              <li>
                Write 2–3 simple sentences using new words (e.g., “I plant
                trees”).
              </li>
            </ul>
          </div>
        </div>

        {/* Key Take Away */}
        <div className="flex flex-col gap-2 shadow-lg border-slate-100 border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-orange-500" />
            <h3 className="font-semibold text-xl text-orange-600">
              Key Take Away
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            Understand basic nature and environment terms, talk about weather
            and simple eco-friendly habits using the Present Perfect tense.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4 justify-center w-full items-center">
          <Link
            href={"/topic/1"}
            className={buttonVariants({
              variant: "secondary",
              className:
                "bg-gradient-orange border w-max rounded-full! min-w-xs text-lg! leading-6! h-auto! text-white px-10!",
            })}
          >
            Homework Activities
          </Link>
          <Button
            variant="outline"
            className="w-max rounded-full! min-w-xs text-lg! leading-6! h-auto! px-10!"
          >
            Study Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
