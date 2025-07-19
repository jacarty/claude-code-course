import { renderHook, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { signIn as signInAction, signUp as signUpAction } from "@/actions";
import { getAnonWorkData, clearAnonWork } from "@/lib/anon-work-tracker";
import { getProjects } from "@/actions/get-projects";
import { createProject } from "@/actions/create-project";

// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/actions", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@/lib/anon-work-tracker", () => ({
  getAnonWorkData: vi.fn(),
  clearAnonWork: vi.fn(),
}));

vi.mock("@/actions/get-projects", () => ({
  getProjects: vi.fn(),
}));

vi.mock("@/actions/create-project", () => ({
  createProject: vi.fn(),
}));

describe("useAuth", () => {
  const mockPush = vi.fn();
  const mockRouter = { push: mockPush };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("initial state", () => {
    it("should return initial state with isLoading false", () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);
      expect(typeof result.current.signIn).toBe("function");
      expect(typeof result.current.signUp).toBe("function");
    });
  });

  describe("signIn", () => {
    it("should handle successful sign in with anonymous work", async () => {
      const mockAnonWork = {
        messages: ["test message"],
        fileSystemData: { test: "data" },
      };
      const mockProject = { id: "project-123" };

      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(mockAnonWork);
      (createProject as any).mockResolvedValue(mockProject);

      const { result } = renderHook(() => useAuth());

      let signInResult;
      await act(async () => {
        signInResult = await result.current.signIn("test@example.com", "password");
      });

      expect(signInAction).toHaveBeenCalledWith("test@example.com", "password");
      expect(getAnonWorkData).toHaveBeenCalled();
      expect(createProject).toHaveBeenCalledWith({
        name: expect.stringMatching(/^Design from /),
        messages: mockAnonWork.messages,
        data: mockAnonWork.fileSystemData,
      });
      expect(clearAnonWork).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/project-123");
      expect(signInResult).toEqual({ success: true });
    });

    it("should handle successful sign in with existing projects", async () => {
      const mockProjects = [{ id: "existing-project-1" }, { id: "existing-project-2" }];

      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue(mockProjects);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password");
      });

      expect(getProjects).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/existing-project-1");
      expect(createProject).not.toHaveBeenCalled();
    });

    it("should handle successful sign in without existing projects", async () => {
      const mockNewProject = { id: "new-project-123" };

      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue([]);
      (createProject as any).mockResolvedValue(mockNewProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password");
      });

      expect(createProject).toHaveBeenCalledWith({
        name: expect.stringMatching(/^New Design #\d+$/),
        messages: [],
        data: {},
      });
      expect(mockPush).toHaveBeenCalledWith("/new-project-123");
    });

    it("should handle failed sign in", async () => {
      const mockError = { success: false, error: "Invalid credentials" };
      (signInAction as any).mockResolvedValue(mockError);

      const { result } = renderHook(() => useAuth());

      let signInResult;
      await act(async () => {
        signInResult = await result.current.signIn("test@example.com", "wrong-password");
      });

      expect(signInResult).toEqual(mockError);
      expect(getAnonWorkData).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should manage loading state during sign in", async () => {
      let resolveSignIn: any;
      const signInPromise = new Promise(resolve => {
        resolveSignIn = resolve;
      });

      (signInAction as any).mockReturnValue(signInPromise);
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue([]);
      (createProject as any).mockResolvedValue({ id: "test-project" });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);

      // Start the sign in process
      let signInResultPromise: Promise<any>;
      act(() => {
        signInResultPromise = result.current.signIn("test@example.com", "password");
      });

      // Check loading state is true immediately after starting
      expect(result.current.isLoading).toBe(true);

      // Resolve the sign in
      await act(async () => {
        resolveSignIn({ success: true });
        await signInResultPromise!;
      });

      // Check loading state is false after completion
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("signUp", () => {
    it("should handle successful sign up with anonymous work", async () => {
      const mockAnonWork = {
        messages: ["test message"],
        fileSystemData: { test: "data" },
      };
      const mockProject = { id: "project-456" };

      (signUpAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(mockAnonWork);
      (createProject as any).mockResolvedValue(mockProject);

      const { result } = renderHook(() => useAuth());

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUp("newuser@example.com", "password");
      });

      expect(signUpAction).toHaveBeenCalledWith("newuser@example.com", "password");
      expect(getAnonWorkData).toHaveBeenCalled();
      expect(createProject).toHaveBeenCalledWith({
        name: expect.stringMatching(/^Design from /),
        messages: mockAnonWork.messages,
        data: mockAnonWork.fileSystemData,
      });
      expect(clearAnonWork).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/project-456");
      expect(signUpResult).toEqual({ success: true });
    });

    it("should handle failed sign up", async () => {
      const mockError = { success: false, error: "Email already exists" };
      (signUpAction as any).mockResolvedValue(mockError);

      const { result } = renderHook(() => useAuth());

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUp("existing@example.com", "password");
      });

      expect(signUpResult).toEqual(mockError);
      expect(getAnonWorkData).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should manage loading state during sign up", async () => {
      let resolveSignUp: any;
      const signUpPromise = new Promise(resolve => {
        resolveSignUp = resolve;
      });

      (signUpAction as any).mockReturnValue(signUpPromise);
      (getAnonWorkData as any).mockReturnValue(null);
      (getProjects as any).mockResolvedValue([]);
      (createProject as any).mockResolvedValue({ id: "test-project" });

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);

      // Start the sign up process
      let signUpResultPromise: Promise<any>;
      act(() => {
        signUpResultPromise = result.current.signUp("newuser@example.com", "password");
      });

      // Check loading state is true immediately after starting
      expect(result.current.isLoading).toBe(true);

      // Resolve the sign up
      await act(async () => {
        resolveSignUp({ success: true });
        await signUpResultPromise!;
      });

      // Check loading state is false after completion
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle empty anonymous work data", async () => {
      const mockAnonWork = {
        messages: [],
        fileSystemData: {},
      };
      const mockProjects = [{ id: "project-789" }];

      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue(mockAnonWork);
      (getProjects as any).mockResolvedValue(mockProjects);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("test@example.com", "password");
      });

      // Should skip anonymous work and use existing project
      expect(createProject).not.toHaveBeenCalled();
      expect(clearAnonWork).not.toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/project-789");
    });

    it("should handle errors during project creation", async () => {
      const mockError = new Error("Failed to create project");

      (signInAction as any).mockResolvedValue({ success: true });
      (getAnonWorkData as any).mockReturnValue({
        messages: ["test"],
        fileSystemData: {},
      });
      (createProject as any).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth());

      await expect(
        act(async () => {
          await result.current.signIn("test@example.com", "password");
        })
      ).rejects.toThrow("Failed to create project");
    });

    it("should reset loading state on error", async () => {
      (signInAction as any).mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);

      try {
        await act(async () => {
          await result.current.signIn("test@example.com", "password");
        });
      } catch (error) {
        // Expected error
      }

      expect(result.current.isLoading).toBe(false);
    });
  });
});