import { describe, it, expect, beforeEach } from "vitest";
import { POST, GET, DELETE } from "../route";
import { NextRequest } from "next/server";

describe("Admin Authentication API (/api/v1/auth/admin-login)", () => {
  beforeEach(() => {
    process.env.ADMIN_EMAIL = "channupatil@gmail.com";
    process.env.ADMIN_PASSWORD = "Channu@0012";
  });

  it("should authenticate successfully with valid credentials", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/auth/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "channupatil@gmail.com",
        password: "Channu@0012"
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.user.role).toBe("admin");
    expect(data.user.email).toBe("channupatil@gmail.com");
    expect(data.user.displayName).toContain("Channu Patil");
  });

  it("should reject incorrect password", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/auth/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "channupatil@gmail.com",
        password: "WrongPassword123"
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.error).toContain("Invalid administrative credentials");
  });

  it("should reject non-admin email", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/auth/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "imposter@gmail.com",
        password: "Channu@0012"
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should return 400 when fields are missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/v1/auth/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "channupatil@gmail.com"
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should clear session on DELETE", async () => {
    const res = await DELETE();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
