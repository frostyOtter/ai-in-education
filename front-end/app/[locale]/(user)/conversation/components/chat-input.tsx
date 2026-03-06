import { ComponentProps, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps extends ComponentProps<"form"> {
  onSend?: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = (props: ChatInputProps) => {
  const { onSend, className, disabled, ...formProps } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onSubmit?.(e);
    onSend?.(message);
    setMessage("");
    inputRef.current?.focus();
  };

  const isDisabled = disabled || message.trim().length === 0;

  useEffect(() => {
    if (disabled) return;
    // when not disabled refocus on input
    inputRef.current?.focus();
  }, [disabled]);

  return (
    <form
      {...formProps}
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-2 rounded-md pl-1 text-sm",
        className
      )}
    >
      <Input
        autoFocus
        ref={inputRef}
        type="text"
        value={message}
        disabled={disabled}
        placeholder="Type something..."
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
      <Button
        size="icon"
        type="submit"
        variant={isDisabled ? "ghost" : "default"}
        disabled={isDisabled}
        className="font-mono"
      >
        <Send />
      </Button>
    </form>
  );
};

export default ChatInput;
