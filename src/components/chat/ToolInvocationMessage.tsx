"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocationMessageProps {
  toolName: string;
  args: any;
  state: string;
}

export function ToolInvocationMessage({
  toolName,
  args,
  state,
}: ToolInvocationMessageProps) {
  const getMessage = (): string => {
    if (toolName === "str_replace_editor") {
      const filename = args?.path ? args.path.split("/").pop() || args.path : "file";
      
      switch (args?.command) {
        case "create":
          return `Creating ${filename}`;
        case "str_replace":
          return `Updating ${filename}`;
        case "insert":
          return `Adding content to ${filename}`;
        case "view":
          return `Reading ${filename}`;
        default:
          return `Working on ${filename}`;
      }
    } else if (toolName === "file_manager") {
      const filename = args?.path ? args.path.split("/").pop() || args.path : "file";
      
      switch (args?.command) {
        case "rename":
          const oldName = args?.path ? args.path.split("/").pop() || args.path : "file";
          const newName = args?.new_path ? args.new_path.split("/").pop() || args.new_path : "file";
          return `Moving ${oldName} to ${newName}`;
        case "delete":
          return `Deleting ${filename}`;
        default:
          return `Managing ${filename}`;
      }
    }
    
    // Fallback for unknown tools
    return toolName;
  };

  const isCompleted = state === "result";
  const message = getMessage();

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isCompleted ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}...</span>
        </>
      )}
    </div>
  );
}