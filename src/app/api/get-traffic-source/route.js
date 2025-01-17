import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const campaign_id = url.searchParams.get("campaign_id");

    if (!campaign_id) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      );
    }

    // Отправляем запрос на внешнее API
    const response = await fetch(

        `https://app.crossroads.ai/api/v2/get-traffic-sources?key=e876c5f9-aa66-462d-bcc7-7d58d86fedda&campaign_id=${campaign_id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch traffic sources");
    }

    const data = await response.json();

    return NextResponse.json(data); // Возвращаем данные из внешнего API
  } catch (error) {
    console.error("Error fetching traffic sources:", error);
    return NextResponse.json(
      { error: "Failed to fetch traffic sources" },
      { status: 500 }
    );
  }
}
