"use client";

import { type UIMessage, type UseChatHelpers, useChat } from "@ai-sdk/react";
import { Presence } from "@radix-ui/react-presence";
import { DefaultChatTransport } from "ai";
import Link from "fumadocs-core/link";
import { Loader2, MessageCircleIcon, RefreshCw, Send, X } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type SyntheticEvent,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { z } from "zod";
import { Markdown } from "@/components/markdown";
import { buttonVariants } from "@/components/ui/button";
import type { ProvideLinksToolSchema } from "@/lib/inkeep-qa-schema";
import { cn } from "@/lib/utils";

const Context = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: UseChatHelpers<UIMessage>;
} | null>(null);

function useAISearch() {
  const context = use(Context);
  if (!context) {
    throw new Error("useAISearch must be used within AISearchTrigger");
  }
  return context;
}

function useChatContext() {
  return useAISearch().chat;
}

function Header() {
  const { setOpen } = useAISearch();

  return (
    <div className="sticky top-0 flex items-start gap-2">
      <div className="flex-1 rounded-xl border bg-fd-card p-3 text-fd-card-foreground">
        <p className="mb-2 font-medium text-sm">Ask AI</p>
        <p className="text-fd-muted-foreground text-xs">
          Powered by{" "}
          <a
            href="https://inkeep.com"
            rel="noreferrer noopener"
            target="_blank"
          >
            Inkeep AI
          </a>
        </p>
      </div>
      <button
        aria-label="Close"
        className={cn(
          buttonVariants({
            size: "icon",
            variant: "secondary",
            className: "rounded-full",
          })
        )}
        onClick={() => setOpen(false)}
        tabIndex={-1}
      >
        <X />
      </button>
    </div>
  );
}

function SearchAIActions() {
  const { messages, status, setMessages, regenerate } = useChatContext();
  const isLoading = status === "streaming";

  if (messages.length === 0) {
    return null;
  }

  return (
    <>
      {!isLoading && messages.at(-1)?.role === "assistant" && (
        <button
          className={cn(
            buttonVariants({
              variant: "secondary",
              size: "sm",
              className: "gap-1.5 rounded-full",
            })
          )}
          onClick={() => regenerate()}
          type="button"
        >
          <RefreshCw className="size-4" />
          Retry
        </button>
      )}
      <button
        className={cn(
          buttonVariants({
            variant: "secondary",
            size: "sm",
            className: "rounded-full",
          })
        )}
        onClick={() => setMessages([])}
        type="button"
      >
        Clear Chat
      </button>
    </>
  );
}

const StorageKeyInput = "__ai_search_input";
function SearchAIInput(props: ComponentProps<"form">) {
  const { status, sendMessage, stop } = useChatContext();
  const [input, setInput] = useState(
    () => localStorage.getItem(StorageKeyInput) ?? ""
  );
  const isLoading = status === "streaming" || status === "submitted";
  const onStart = (e?: SyntheticEvent) => {
    e?.preventDefault();
    void sendMessage({ text: input });
    setInput("");
  };

  localStorage.setItem(StorageKeyInput, input);

  useEffect(() => {
    if (isLoading) {
      document.getElementById("nd-ai-input")?.focus();
    }
  }, [isLoading]);

  return (
    <form
      {...props}
      className={cn("flex items-start pe-2", props.className)}
      onSubmit={onStart}
    >
      <Input
        autoFocus
        className="p-3"
        disabled={status === "streaming" || status === "submitted"}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === "Enter") {
            onStart(event);
          }
        }}
        placeholder={isLoading ? "AI is answering..." : "Ask a question"}
        value={input}
      />
      {isLoading ? (
        <button
          className={cn(
            buttonVariants({
              variant: "secondary",
              className: "mt-2 gap-2 rounded-full transition-all",
            })
          )}
          key="bn"
          onClick={stop}
          type="button"
        >
          <Loader2 className="size-4 animate-spin text-fd-muted-foreground" />
          Abort Answer
        </button>
      ) : (
        <button
          className={cn(
            buttonVariants({
              variant: "secondary",
              className: "mt-2 rounded-full transition-all",
            })
          )}
          disabled={input.length === 0}
          key="bn"
          type="submit"
        >
          <Send className="size-4" />
        </button>
      )}
    </form>
  );
}

function List(props: Omit<ComponentProps<"div">, "dir">) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    function callback() {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      container.scrollTo({
        top: container.scrollHeight,
        behavior: "instant",
      });
    }

    const observer = new ResizeObserver(callback);
    callback();

    const element = containerRef.current.firstElementChild;

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        "fd-scroll-container flex min-w-0 flex-col overflow-y-auto",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

function Input(props: ComponentProps<"textarea">) {
  const ref = useRef<HTMLDivElement>(null);
  const shared = cn("col-start-1 row-start-1", props.className);

  return (
    <div className="grid flex-1">
      <textarea
        id="nd-ai-input"
        {...props}
        className={cn(
          "resize-none bg-transparent placeholder:text-fd-muted-foreground focus-visible:outline-none",
          shared
        )}
      />
      <div className={cn(shared, "invisible break-all")} ref={ref}>
        {`${props.value?.toString() ?? ""}\n`}
      </div>
    </div>
  );
}

const roleName: Record<string, string> = {
  user: "you",
  assistant: "fumadocs",
};

function Message({
  message,
  ...props
}: { message: UIMessage } & ComponentProps<"div">) {
  let markdown = "";
  let links: z.infer<typeof ProvideLinksToolSchema>["links"] = [];

  for (const part of message.parts) {
    if (part.type === "text") {
      markdown += part.text;
      continue;
    }

    if (part.type === "tool-provideLinks" && part.input) {
      links = (part.input as z.infer<typeof ProvideLinksToolSchema>).links;
    }
  }

  return (
    <div {...props}>
      <p
        className={cn(
          "mb-1 font-medium text-fd-muted-foreground text-sm",
          message.role === "assistant" && "text-fd-primary"
        )}
      >
        {roleName[message.role]}
      </p>
      <div className="prose text-sm">
        <Markdown text={markdown} />
      </div>
      {links && links.length > 0 && (
        <div className="mt-2 flex flex-row flex-wrap items-center gap-1">
          {links.map((item, i) => (
            <Link
              className={
                "block rounded-lg border p-3 text-xs hover:bg-fd-accent hover:text-fd-accent-foreground"
              }
              href={item.url}
              key={i}
            >
              <p className="font-medium">{item.title}</p>
              <p className="text-fd-muted-foreground">Reference {item.label}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function AISearchTrigger() {
  const [open, setOpen] = useState(false);
  const chat = useChat({
    id: "search",
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      setOpen(false);
      e.preventDefault();
    }

    if (e.key === "/" && (e.metaKey || e.ctrlKey) && !open) {
      setOpen(true);
      e.preventDefault();
    }
  };

  const onKeyPressRef = useRef(onKeyPress);
  onKeyPressRef.current = onKeyPress;
  useEffect(() => {
    const listener = (e: KeyboardEvent) => onKeyPressRef.current(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  return (
    <Context value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}>
      <style>
        {`
        @keyframes ask-ai-open {
          from {
            translate: 100% 0;
          }
        }
        
        @keyframes ask-ai-close {
          to {
            translate: 100% 0;
            opacity: 0;
          }
        }`}
      </style>
      <Presence present={open}>
        <div
          className={cn(
            "fixed inset-y-2 z-30 flex flex-col rounded-2xl border bg-fd-popover p-2 text-fd-popover-foreground shadow-lg max-sm:inset-x-2 sm:end-2 sm:w-[460px]",
            open
              ? "animate-[ask-ai-open_300ms]"
              : "animate-[ask-ai-close_300ms]"
          )}
        >
          <Header />
          <List
            className="flex-1 overscroll-contain px-3 py-4"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)",
            }}
          >
            <div className="flex flex-col gap-4">
              {chat.messages
                .filter((msg) => msg.role !== "system")
                .map((item) => (
                  <Message key={item.id} message={item} />
                ))}
            </div>
          </List>
          <div
            className={
              "rounded-xl border bg-fd-card text-fd-card-foreground has-focus-visible:ring-2 has-focus-visible:ring-fd-ring"
            }
          >
            <SearchAIInput />
            <div className={"flex items-center gap-1.5 p-1 empty:hidden"}>
              <SearchAIActions />
            </div>
          </div>
        </div>
      </Presence>
      <button
        className={cn(
          "fixed bottom-4 z-20 flex h-10 w-24 items-center gap-3 rounded-2xl border bg-fd-secondary px-2 font-medium text-fd-muted-foreground text-sm shadow-lg transition-[translate,opacity]",
          "end-[calc(var(--removed-body-scroll-bar-size,0px)+var(--fd-layout-offset)+1rem)]",
          open && "translate-y-10 opacity-0"
        )}
        onClick={() => setOpen(true)}
      >
        <MessageCircleIcon className="size-4.5" />
        Ask AI
      </button>
    </Context>
  );
}
