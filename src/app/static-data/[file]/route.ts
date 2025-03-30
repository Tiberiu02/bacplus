import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export function generateStaticParams() {
  const files = fs.existsSync(".next/static-data")
    ? fs.readdirSync(".next/static-data")
    : ["empty.json"];

  return files.map((file) => ({
    file,
  }));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  const file = (await params).file;
  if (file === "empty.json") {
    return NextResponse.json({});
  }

  const data = fs.readFileSync(".next/static-data/" + file, "utf-8");
  return NextResponse.json(JSON.parse(data));
}
