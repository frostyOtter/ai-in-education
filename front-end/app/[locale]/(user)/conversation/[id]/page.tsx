import { BackButton } from "@/components/back/button";
import { SpeechRoom } from "../components/speech";
import Model from "../components/model";

type Params = {
  params: Promise<{ id: string }>;
};

const Conversation = async ({ params }: Params) => {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-5">
      <BackButton className="w-max">Choose Different Avatar</BackButton>
      <Model avatar={"/emma.png"} name={"Emma"} />
      <SpeechRoom id={id} />
    </div>
  );
};

export default Conversation;
