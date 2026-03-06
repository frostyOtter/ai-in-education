import { getAvatars } from "@/actions/avatar";
import { getTopicById } from "@/actions/topics";
import { BackButton } from "@/components/back/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{ id: string }>;
};

const AvatarPage = async ({ params }: Params) => {
  const { id } = await params;

  const topic = await getTopicById(Number(id));

  if (!topic) {
    return notFound();
  }

  const avatars = await getAvatars();

  return (
    <div className="mb-6">
      <BackButton />

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{topic.title}</h1>
          <Badge variant="outline" className="rounded-full">
            {topic.history}
          </Badge>
        </div>
        <p className="text-gray-600">{topic.description}</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {avatars.map((avatar) => (
          <Link
            key={avatar.id}
            href={`/conversation/${id}?avatar=${avatar.id}`}
          >
            <Card className="flex flex-col gap-2 rounded-2xl shadow hover:shadow-lg p-2">
              <CardContent className="p-0">
                <div className="aspect-video w-full">
                  <video
                    src={avatar.src}
                    autoPlay
                    loop
                    muted
                    className="rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-center items-center gap-2 py-4">
                  <h3 className="font-semibold text-xl text-gray-900">
                    {avatar.name}
                  </h3>
                  <p className="text-sm text-gray-600">{avatar.description}</p>
                  <Badge
                    variant={"outline"}
                    className="text-sm text-blue-800 bg-blue-100"
                  >
                    {avatar.character}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AvatarPage;
