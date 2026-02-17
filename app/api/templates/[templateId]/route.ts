import { NextRequest, NextResponse } from "next/server";
import { templates } from "../../../../convex/templates";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  const { templateId } = await params;
  
  const template = templates[templateId];
  
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }
  
  return NextResponse.json(template);
}
