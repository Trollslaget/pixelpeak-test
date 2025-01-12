import fetch from "node-fetch";

export async function GET(req) {
  try {
    const response = await fetch(
      "https://app.crossroads.ai/api/v2/get-campaigns-info?key=e876c5f9-aa66-462d-bcc7-7d58d86fedda&start-date=2024-12-07&end-date=2025-01-10"
    );
    const data = await response.json();
    console.log(data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error fetching data" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

