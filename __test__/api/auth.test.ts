import { POST } from "@/app/api/auth/login/route";
import { db } from "@/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import "whatwg-fetch"; // Polyfill fetch API for Jest

// Mock dependencies
jest.mock("@/db", () => ({
  db: {
    select: jest.fn(),
  },
}));
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

// Helper function to create a mock request
const createMockRequest = (body: any): NextRequest =>
  new NextRequest(
    new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  );

// Helper function to mock database query results
const mockDbQuery = (result: any[]) => {
  (db.select as jest.Mock).mockReturnValue({
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue(result),
  });
};

// Helper function to mock bcrypt comparison
const mockBcryptCompare = (result: boolean) => {
  (bcrypt.compare as jest.Mock).mockResolvedValue(result);
};

// Helper function to mock JWT token generation
const mockJwtSign = (token: string) => {
  (jwt.sign as jest.Mock).mockReturnValue(token);
};

describe("Login API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if user does not exist", async () => {
    mockDbQuery([]); // Simulate no user found

    const req = createMockRequest({ email: "test@example.com", password: "password" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data).toEqual({ error: "User not found" });
  });

  it("should return 401 if password is incorrect", async () => {
    mockDbQuery([{ id: 1, email: "test@example.com", password: "hashedpassword" }]);
    mockBcryptCompare(false); // Password mismatch

    const req = createMockRequest({ email: "test@example.com", password: "wrongpassword" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data).toEqual({ error: "Invalid credentials" });
  });

  it("should return 200 and a token if login is successful", async () => {
    const mockUser = { id: 1, email: "test@example.com", password: "hashedpassword" };
    mockDbQuery([mockUser]);
    mockBcryptCompare(true);
    mockJwtSign("mocked_token");

    const req = createMockRequest({ email: "test@example.com", password: "password" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toMatchObject({
      token: "mocked_token",
      user: mockUser,
    });
  });

  it("should return 500 if an internal error occurs", async () => {
    (db.select as jest.Mock).mockImplementation(() => {
      throw new Error("Database error");
    });

    const req = createMockRequest({ email: "test@example.com", password: "password" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toEqual({ error: "Internal server error" });
  });
});
