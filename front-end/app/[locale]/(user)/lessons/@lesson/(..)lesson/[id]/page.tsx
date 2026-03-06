import LessonPage from "@/app/[locale]/(user)/lesson/[id]/page";

type Params = {
  params: Promise<{ id: string }>;
};

const LessonSideBar = ({ params }: Params) => {
  return (
    <div className="h-[80dvh] w-full overflow-y-scroll">
      <LessonPage params={params} />
    </div>
  );
};

export default LessonSideBar;
