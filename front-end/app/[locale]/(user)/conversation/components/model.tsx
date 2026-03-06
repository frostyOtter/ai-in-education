import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FC } from "react";

type ModelProps = {
  name?: string;
  description?: string;
  avatar?: string;
};

const Model: FC<ModelProps> = ({ name, description, avatar }) => {
  const model = name ?? "Unknown Model";

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarImage src={avatar ?? "/emma.png"} className="object-cover" />
        <AvatarFallback>{model.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="text-lg font-semibold">{model}</div>

      <Badge
        variant={"secondary"}
        className={"rounded-full text-blue-800 bg-blue-100 py-2 px-3"}
      >
        {description ?? "Friendly and encouraging"}
      </Badge>
    </div>
  );
};

export default Model;
