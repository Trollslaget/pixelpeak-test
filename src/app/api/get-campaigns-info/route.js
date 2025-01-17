import fetch from "node-fetch";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const response = await fetch(
      `https://app.crossroads.ai/api/v2/get-campaigns-info?key=e876c5f9-aa66-462d-bcc7-7d58d86fedda&start-date=${startDate}&end-date=${endDate}`
    );

    const data = await response.json();

    const updatedCampaignsInfo = data.campaigns_info.map((campaign) => {
      const landerSearches = campaign.lander_searches || 0;
      const totalVisitors = campaign.total_visitors || 0;
      const revenue = campaign.revenue || 0;

      // Расчёт CTR и RPM
      const ctr = landerSearches > 0 ? (campaign.filtered_visitors / landerSearches) * 100 : 0;
      const rpm = totalVisitors > 0 ? (revenue / totalVisitors) * 1000 : 0;

      return {
        ...campaign,
        ctr: parseFloat(ctr.toFixed(2)), // Округляем до 2 знаков
        rpm: parseFloat(rpm.toFixed(2)), // Округляем до 2 знаков
      };
    });

    return new Response(
      JSON.stringify({ campaigns_info: updatedCampaignsInfo }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error fetching data" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
