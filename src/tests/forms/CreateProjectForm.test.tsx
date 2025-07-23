import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import CreateProjectForm from "@/components/forms/projectform";
import { createProject } from "@/api/project";
import { useMutation } from "@tanstack/react-query";

// Mock the required dependencies
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
}));

vi.mock("@/api/project", () => ({
  createProject: vi.fn(),
}));

describe("CreateProjectForm", () => {
  // Setup mocks before each test
  beforeEach(() => {
    useMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders the form correctly", () => {
    render(<CreateProjectForm />);
    
    // Check if form elements are rendered
    expect(screen.getByText("Create Project")).toBeInTheDocument();
    expect(screen.getByLabelText("Project Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Project" })).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    render(<CreateProjectForm />);
    
    // Submit form without filling in the inputs
    const submitButton = screen.getByRole("button", { name: "Create Project" });
    fireEvent.click(submitButton);
    
    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText("Project name must be at least 3 characters")).toBeInTheDocument();
      expect(screen.getByText("Description must be at least 10 characters")).toBeInTheDocument();
    });
  });

  test("shows validation error for short project name", async () => {
    render(<CreateProjectForm />);
    
    // Fill in a short project name
    const nameInput = screen.getByLabelText("Project Name");
    await userEvent.type(nameInput, "AB");
    
    // Fill in a valid description
    const descriptionInput = screen.getByLabelText("Description");
    await userEvent.type(descriptionInput, "This is a valid description");
    
    // Submit form
    const submitButton = screen.getByRole("button", { name: "Create Project" });
    fireEvent.click(submitButton);
    
    // Check for specific validation error
    await waitFor(() => {
      expect(screen.getByText("Project name must be at least 3 characters")).toBeInTheDocument();
      expect(screen.queryByText("Description must be at least 10 characters")).not.toBeInTheDocument();
    });
  });

  test("shows validation error for short description", async () => {
    render(<CreateProjectForm />);
    
    // Fill in a valid project name
    const nameInput = screen.getByLabelText("Project Name");
    await userEvent.type(nameInput, "Valid Name");
    
    // Fill in a short description
    const descriptionInput = screen.getByLabelText("Description");
    await userEvent.type(descriptionInput, "Too short");
    
    // Submit form
    const submitButton = screen.getByRole("button", { name: "Create Project" });
    fireEvent.click(submitButton);
    
    // Check for specific validation error
    await waitFor(() => {
      expect(screen.queryByText("Project name must be at least 3 characters")).not.toBeInTheDocument();
      expect(screen.getByText("Description must be at least 10 characters")).toBeInTheDocument();
    });
  });

  test("submits the form with valid data", async () => {
    const mutateMock = vi.fn();
    useMutation.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      isError: false,
      error: null,
    });
    
    render(<CreateProjectForm />);
    
    // Fill in valid data
    const nameInput = screen.getByLabelText("Project Name");
    const descriptionInput = screen.getByLabelText("Description");
    
    await userEvent.type(nameInput, "Test Project");
    await userEvent.type(descriptionInput, "This is a test project description");
    
    // Submit form
    const submitButton = screen.getByRole("button", { name: "Create Project" });
    fireEvent.click(submitButton);
    
    // Check if mutation was called with correct data
    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith({
        name: "Test Project",
        description: "This is a test project description",
      });
    });
  });

  test("shows loading spinner during form submission", async () => {
    useMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      isError: false,
      error: null,
    });
    
    render(<CreateProjectForm />);
    
    // Check if the spinner is shown
    expect(screen.getByRole("button", { name: "" })).toBeInTheDocument(); // The button contains the spinner
    expect(screen.queryByText("Create Project")).not.toBeInTheDocument(); // Button text is replaced by spinner
  });

  test("navigates to dashboard on successful submission", async () => {
    const routerPushMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      push: routerPushMock,
    });

    const successCallback = vi.fn();
    useMutation.mockReturnValue({
      mutate: (values) => successCallback(values),
      isPending: false,
      isError: false,
      error: null,
    });
    
    createProject.mockResolvedValue({ id: "123", name: "Test Project" });
    
    render(<CreateProjectForm />);
    
    // Fill in valid data
    const nameInput = screen.getByLabelText("Project Name");
    const descriptionInput = screen.getByLabelText("Description");
    
    await userEvent.type(nameInput, "Test Project");
    await userEvent.type(descriptionInput, "This is a test project description");
    
    // Submit form
    const submitButton = screen.getByRole("button", { name: "Create Project" });
    fireEvent.click(submitButton);
    
    // Trigger the success callback with the expected result
    useMutation.mock.calls[0][0].onSuccess({ id: "123", name: "Test Project" });
    
    // Check if navigation occurred
    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("handles API error properly", async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    useMutation.mockReturnValue({
      mutate: (values, options) => {
        options.onError(new Error("API Error"));
      },
      isPending: false,
      isError: true,
      error: new Error("API Error"),
    });
    
    render(<CreateProjectForm />);
    
    // Fill in valid data
    const nameInput = screen.getByLabelText("Project Name");
    const descriptionInput = screen.getByLabelText("Description");
    
    await userEvent.type(nameInput, "Test Project");
    await userEvent.type(descriptionInput, "This is a test project description");
    
    // Submit form
    const submitButton = screen.getByRole("button", { name: "Create Project" });
    fireEvent.click(submitButton);
    
    // Check if error was logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error creating project:", expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
});