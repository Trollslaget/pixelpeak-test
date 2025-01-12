"use client";
import React, { useState, useEffect } from "react";
import { Paper, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
function CampaignTable() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	console.log(data);
	const columns = [
		{ field: "campaign_id", headerName: "Campaign ID", width: 130 },
		{ field: "campaign__name", headerName: "Campaign Name", flex: 1 },
		{
			field: "total_visitors",
			headerName: "Visitors",
			type: "number",
			width: 130,
		},
		{ field: "revenue", headerName: "Revenue", type: "number", width: 130 },
		{
			field: "revenue_events",
			headerName: "Revenue Events",
			type: "number",
			width: 150,
		},
		{ field: "rpc", headerName: "RPC", type: "number", width: 100 },
		{ field: "rpv", headerName: "RPV", type: "number", width: 100 },
		{ field: "campaign__created_at", headerName: "Created At", width: 250 },
	];

	const rows = data.map((row, index) => ({
		id: index,
		campaign_id: row.campaign_id,
		campaign__name: row.campaign__name,
		total_visitors: row.total_visitors,
		revenue: row.revenue,
		revenue_events: row.revenue_events,
		rpc: row.rpc,
		rpv: row.rpv,
		campaign__created_at: row.campaign__created_at,
	}));
	useEffect(() => {
		fetch("/api/get-campaigns-info")
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((result) => {
				setData(result.campaigns_info);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<h1>Campaign Data</h1>
			<Paper style={{ height: 600 }}>
				<DataGrid
					rows={rows}
					columns={columns}
					pageSize={10}
					rowsPerPageOptions={[10, 20, 50]}
					checkboxSelection
					disableSelectionOnClick
					sortingMode='client'
					style={{ width: "100%" }}
				/>
			</Paper>
		</div>
	);
}

export default CampaignTable;
