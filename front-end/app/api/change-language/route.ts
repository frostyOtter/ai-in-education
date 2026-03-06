import { changeLanguage } from "@/actions/language";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { language } = body;

  const changeLanguageRes = await changeLanguage(language);
  if (!changeLanguageRes) {
    throw new Error("Failed to change language");
  }

  return NextResponse.json({ message: "Language changed" }, { status: 200 });
}
