"use client";
import React, { useEffect, use, useState } from "react";
import { CircularProgress, Typography, Box, Button } from "@mui/material";
import CampaignTrafficTable from "@/app/components/CampaignTrafficTable";
import { useRouter } from "next/navigation";

const CampaignPage = ({ params }) => {
	const { campaign_id } = use(params);
	const [campaignData, setCampaignData] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	useEffect(() => {
		fetch(`/api/get-traffic-source?campaign_id=${campaign_id}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Failed to fetch campaign data");
				}
				return response.json();
			})
			.then((data) => {
				setCampaignData(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching campaign data:", error);
				setLoading(false);
			});
	}, [campaign_id]);

	if (loading) {
		return <CircularProgress />;
	}

	if (!campaignData) {
		return <Typography>Нет данных для этой кампании</Typography>;
	}

	return (
		<Box>
			<Button
				variant='outlined' // Стиль кнопки
				color='primary' // Цвет кнопки
				onClick={() => router?.push("/")} // Переход на главную страницу
				sx={{ mt: 2 }} // Отступ сверху для кнопки
			>
				Назад на главную
			</Button>
			<Typography variant='h4' gutterBottom>
				Кампания: {campaign_id}
			</Typography>

			<CampaignTrafficTable data={campaignData} />
		</Box>
	);
};

export default CampaignPage;
