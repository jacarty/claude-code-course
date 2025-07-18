import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationMessage } from "../ToolInvocationMessage";

afterEach(() => {
  cleanup();
});

// str_replace_editor tests
test("shows creating message for str_replace_editor create command", () => {
  render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={{ command: "create", path: "components/Button.tsx" }}
      state="pending"
    />
  );

  expect(screen.getByText("Creating Button.tsx...")).toBeDefined();
});

test("shows updating message for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "src/components/Card.tsx" }}
      state="result"
    />
  );

  expect(screen.getByText("Updating Card.tsx")).toBeDefined();
});

test("shows adding content message for str_replace_editor insert command", () => {
  render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={{ command: "insert", path: "/lib/utils.ts" }}
      state="pending"
    />
  );

  expect(screen.getByText("Adding content to utils.ts...")).toBeDefined();
});

test("shows reading message for str_replace_editor view command", () => {
  render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={{ command: "view", path: "README.md" }}
      state="result"
    />
  );

  expect(screen.getByText("Reading README.md")).toBeDefined();
});

test("shows generic message for unknown str_replace_editor command", () => {
  render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={{ command: "unknown", path: "test.js" }}
      state="pending"
    />
  );

  expect(screen.getByText("Working on test.js...")).toBeDefined();
});

// file_manager tests
test("shows moving message for file_manager rename command", () => {
  render(
    <ToolInvocationMessage
      toolName="file_manager"
      args={{
        command: "rename",
        path: "old/Button.tsx",
        new_path: "new/Button.tsx",
      }}
      state="pending"
    />
  );

  expect(screen.getByText("Moving Button.tsx to Button.tsx...")).toBeDefined();
});

test("shows moving message with different filenames for file_manager rename", () => {
  render(
    <ToolInvocationMessage
      toolName="file_manager"
      args={{
        command: "rename",
        path: "components/OldButton.tsx",
        new_path: "components/NewButton.tsx",
      }}
      state="result"
    />
  );

  expect(screen.getByText("Moving OldButton.tsx to NewButton.tsx")).toBeDefined();
});

test("shows deleting message for file_manager delete command", () => {
  render(
    <ToolInvocationMessage
      toolName="file_manager"
      args={{ command: "delete", path: "temp/test.txt" }}
      state="pending"
    />
  );

  expect(screen.getByText("Deleting test.txt...")).toBeDefined();
});

test("shows generic message for unknown file_manager command", () => {
  render(
    <ToolInvocationMessage
      toolName="file_manager"
      args={{ command: "unknown", path: "file.txt" }}
      state="result"
    />
  );

  expect(screen.getByText("Managing file.txt")).toBeDefined();
});

// Edge cases
test("handles missing path in args", () => {
  render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={{ command: "create" }}
      state="pending"
    />
  );

  expect(screen.getByText("Creating file...")).toBeDefined();
});

test("handles empty args", () => {
  render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={{}}
      state="result"
    />
  );

  expect(screen.getByText("Working on file")).toBeDefined();
});

test("handles null args", () => {
  render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={null}
      state="pending"
    />
  );

  expect(screen.getByText("Working on file...")).toBeDefined();
});

test("handles path with no directory separators", () => {
  render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={{ command: "create", path: "Button.tsx" }}
      state="result"
    />
  );

  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("handles path with trailing slash", () => {
  render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={{ command: "create", path: "components/" }}
      state="pending"
    />
  );

  expect(screen.getByText("Creating components/...")).toBeDefined();
});

test("shows fallback for unknown tool", () => {
  render(
    <ToolInvocationMessage
      toolName="unknown_tool"
      args={{ some: "data" }}
      state="result"
    />
  );

  expect(screen.getByText("unknown_tool")).toBeDefined();
});

// Visual state tests
test("shows spinner for pending state", () => {
  const { container } = render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={{ command: "create", path: "test.tsx" }}
      state="pending"
    />
  );

  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
  expect(spinner?.classList.contains("text-blue-600")).toBe(true);
});

test("shows green dot for completed state", () => {
  const { container } = render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={{ command: "create", path: "test.tsx" }}
      state="result"
    />
  );

  const dot = container.querySelector(".bg-emerald-500");
  expect(dot).toBeDefined();
  expect(dot?.classList.contains("rounded-full")).toBe(true);
});

test("adds ellipsis for pending state", () => {
  render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={{ command: "create", path: "test.tsx" }}
      state="pending"
    />
  );

  expect(screen.getByText("Creating test.tsx...")).toBeDefined();
});

test("no ellipsis for completed state", () => {
  render(
    <ToolInvocationMessage
      toolName="str_replace_editor"
      args={{ command: "create", path: "test.tsx" }}
      state="result"
    />
  );

  expect(screen.getByText("Creating test.tsx")).toBeDefined();
  expect(screen.queryByText("Creating test.tsx...")).toBeNull();
});