import { NextRequest, NextResponse } from "next/server";

const EXPECTED_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "channupatil@gmail.com").toLowerCase().trim();
const EXPECTED_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Channu@0012";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password);

    if (cleanEmail !== EXPECTED_ADMIN_EMAIL || cleanPassword !== EXPECTED_ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid administrative credentials." },
        { status: 401 }
      );
    }

    const adminProfile = {
      id: "admin-channu-patil",
      email: cleanEmail,
      displayName: "Channu Patil (Administrator)",
      role: "admin",
      onboardingCompleted: true,
      profile: {
        userType: "admin",
        interests: ["AI Architecture", "System Governance"],
        skillLevel: "professional"
      },
      preferences: {
        currency: "USD"
      },
      savedToolIds: ["chatgpt", "cursor", "claude", "perplexity"],
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: new Date().toISOString()
    };

    const response = NextResponse.json({
      success: true,
      user: adminProfile
    });

    // Set secure admin session cookie (HTTP only)
    response.cookies.set("ai_atlas_admin_session", "authorized", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    });

    return response;
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during admin authentication." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get("ai_atlas_admin_session");
  const isAuthorized = session?.value === "authorized";

  return NextResponse.json({
    isAdminAuthorized: isAuthorized,
    adminEmail: isAuthorized ? EXPECTED_ADMIN_EMAIL : null
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Admin session cleared." });
  response.cookies.delete("ai_atlas_admin_session");
  return response;
}
