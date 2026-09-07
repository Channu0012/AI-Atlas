import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Repository } from "@/lib/db/repository";

const ToolSubmissionSchema = z.object({
  toolName: z.string().min(2, "Tool name must be at least 2 characters"),
  website: z.string().url("Valid website URL required"),
  tagline: z.string().min(10, "Tagline must be at least 10 characters"),
  description: z.string().min(20, "Detailed description required"),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
  pricingModel: z.enum(["free", "freemium", "paid", "custom", "unknown"]),
  startingPrice: z.number().optional(),
  openSource: z.boolean().default(false),
  platforms: z.array(z.string()).default(["web"]),
  contactEmail: z.string().email("Valid contact email required")
});

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const parsed = ToolSubmissionSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_FAILED",
            message: parsed.error.issues[0]?.message || "Invalid submission data"
          }
        },
        { status: 400 }
      );
    }

    const { submission, isDuplicate } = await Repository.createSubmission(parsed.data);

    return NextResponse.json({
      success: true,
      data: {
        submission,
        isDuplicate,
        message: isDuplicate 
          ? "Potential duplicate tool detected. Submission routed to administrator queue for manual review."
          : "Tool submitted successfully. Our team will verify credentials, pricing, and features before publication."
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SUBMISSION_FAILED",
          message: error.message || "Failed to submit tool"
        }
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const submissions = await Repository.getSubmissions();
    return NextResponse.json({
      success: true,
      data: submissions
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "FETCH_FAILED", message: error.message }
      },
      { status: 500 }
    );
  }
}
