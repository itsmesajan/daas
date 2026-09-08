import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    if (!WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const expectedSignature = `sha256=${crypto.createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex")}`;

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { modules, action, table } = payload as { modules?: string[]; action?: string; table?: string };

    // { expire: 0 } forces immediate expiration — this Next.js version's
    // revalidateTag requires a cache-life profile as the 2nd argument even
    // for purging a plain fetch()-level tag (no "use cache" involved here).
    if (Array.isArray(modules) && modules.length > 0) {
      modules.forEach((tag) => revalidateTag(tag, { expire: 0 }));
      console.log(`[Webhook] Revalidated tags: ${modules.join(", ")}`);
    } else {
      console.log("[Webhook] No modules provided. Revalidating all.");
    }

    // Always revalidate the "all" tag and the full layout to ensure absolute freshness
    revalidateTag("all", { expire: 0 });
    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      message: "Revalidation triggered successfully",
      action,
      table,
    });
  } catch (error) {
    console.error("[Webhook Error]", error);
    const details = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal Server Error", details }, { status: 500 });
  }
}
