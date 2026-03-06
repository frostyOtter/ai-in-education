import { X } from "lucide-react";

import { useRoomContext } from "@livekit/components-react";
import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@/components/ui/button";
import { ErrorHelper } from "@/lib/error-helper";
import { FC } from "react";

const ExitRoom: FC<ButtonProps & { iconClass?: string }> = ({
  iconClass,
  ...props
}) => {
  const router = useRouter();
  const { disconnect } = useRoomContext();

  const handleExit = async () => {
    try {
      await disconnect();
      router.push("/");
    } catch (error) {
      ErrorHelper(error);
    }
  };

  return (
    <Button {...props} onClick={handleExit}>
      <X className={iconClass} />
    </Button>
  );
};

export default ExitRoom;
