"use client";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
	CircularProgress,
	Paper,
	Button,
	Box,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

function CampaignTable() {
	const router = useRouter();

	const initialColumns = [
		{ field: "campaign_id", headerName: "Campaign ID", width: 130 },
		{ field: "campaign__name", headerName: "Campaign Name", flex: 1 },
		{
			field: "total_visitors",
			headerName: "Visitors",
			type: "number",
			width: 130,
		},
		{
			field: "filtered_visitors",
			headerName: "Filtered Visitors",
			type: "number",
			width: 160,
		},
		{
			field: "lander_searches",
			headerName: "Lander Searches",
			type: "number",
			width: 160,
		},
		{
			field: "lander_visitors",
			headerName: "Lander Visitors",
			type: "number",
			width: 160,
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
		{ field: "ctr", headerName: "CTR", type: "number", width: 100 },
		{ field: "rpm", headerName: "RPM", type: "number", width: 100 },
		{ field: "date", headerName: "Date", width: 250 },
		{ field: "campaign__created_at", headerName: "Created At", width: 100 },
	];
	const handleRowClick = (params) => {
		const campaignId = params.row.campaign_id;
		window.open(`/campaign/${campaignId}`, '_blank'); // Открытие в новой вкладке
	  };
	  

	const [startDate, setStartDate] = useState(dayjs().startOf("month")); // Начальная дата
	const [endDate, setEndDate] = useState(dayjs().endOf("month")); // Конечная дата
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [columns, setColumns] = useState(initialColumns);
	const [selectedTag, setSelectedTag] = useState("");

	// const rows = data.map((row, index) => ({
	// 	id: index,
	// 	campaign_id: row.campaign_id,
	// 	campaign__name: row.campaign__name,
	// 	campaign__created_at: row.campaign__created_at,
	// 	total_visitors: row.total_visitors,
	// 	filtered_visitors: row.filtered_visitors,
	// 	lander_searches: row.lander_searches,
	// 	lander_visitors: row.lander_visitors,
	// 	revenue_events: row.revenue_events,
	// 	revenue: row.revenue,
	// 	rpc: row.rpc,
	// 	rpv: row.rpv,
	// 	ctr: row.ctr,
	// 	rpm: row.rpm,
	// }));
	const rows = useMemo(
		() =>
			data.map((row, index) => ({
				id: index,
				...row,
				tag: row.campaign__name.split(/[- _]/)[0] // Извлекаем тег до первого дефиса или пробела
			})),
		[data]
	);
	console.log(rows);
	
	useEffect(() => {
		if (!startDate || !endDate) return;
		setLoading(true); // Показываем индикатор загрузки
		fetch(
			`/api/get-campaigns-info?startDate=${startDate.format(
				"YYYY-MM-DD"
			)}&endDate=${endDate.format("YYYY-MM-DD")}`
		)
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
	}, [startDate, endDate]);

	// Уникальные теги для выпадающего списка
	const uniqueTags = useMemo(
		() => Array.from(new Set(rows.map((row) => row.tag))),
		[rows]
	);

	// Отфильтрованные данные
	const filteredRows = useMemo(
		() => (selectedTag ? rows.filter((row) => row.tag === selectedTag) : rows),
		[rows, selectedTag]
	);
	// Обработчик изменения тега
	const handleTagChange = (event) => {
		setSelectedTag(event.target.value);
	};

	const handleDragStart = (index) => (event) => {
		event.dataTransfer.setData("columnIndex", index);
	};

	const handleDrop = (targetIndex) => (event) => {
		const sourceIndex = parseInt(event.dataTransfer.getData("columnIndex"), 10);
		if (sourceIndex === targetIndex) return;

		const newColumns = [...columns];
		const [removed] = newColumns.splice(sourceIndex, 1);
		newColumns.splice(targetIndex, 0, removed);

		setColumns(newColumns);
	};

	const handleRemoveColumn = (index) => {
		const newColumns = columns.filter((_, i) => i !== index);
		setColumns(newColumns);
	};

	const handleResetColumns = () => {
		setColumns(initialColumns);
	};

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Box sx={{ p: 4, pb:0 }}>
				<FormControl sx={{ mb: 2, width: 200 }}>
					{/* <InputLabel sx={{top: "-12px"}} id='tag-select-label'>Выберите тег</InputLabel> */}
					<Select
						labelId='tag-select-label'
						value={selectedTag}
						onChange={handleTagChange}
						displayEmpty
					>
						<MenuItem value=''>
							<em>Все теги</em>
						</MenuItem>
						{uniqueTags.map((tag) => (
							<MenuItem key={tag} value={tag}>
								{tag}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
			<Box sx={{ p: 4 }}>
				<Typography variant='h4' gutterBottom>
					Выберите диапазон дат
				</Typography>

				{/* Компоненты выбора дат */}
				<Box sx={{ display: "flex", gap: 2, mb: 4 }}>
					<DatePicker
						label='Начальная дата'
						value={startDate}
						onChange={(newStartDate) => setStartDate(newStartDate)}
					/>
					<DatePicker
						label='Конечная дата'
						value={endDate}
						onChange={(newEndDate) => setEndDate(newEndDate)}
					/>
				</Box>
				<div className='body-wrapper'>
					<div
						className='selection-wrapper'
						style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
					>
						{columns.map((column, index) => (
							<div
								key={column.field}
								draggable
								onDragStart={handleDragStart(index)}
								onDragOver={(event) => event.preventDefault()}
								onDrop={handleDrop(index)}
								style={{
									padding: "5px 10px",
									border: "1px solid #ccc",
									borderRadius: "5px",
									backgroundColor: "#f0f0f0",
									minWidth: "50px",
									position: "relative",
									cursor: "grab",
								}}
							>
								<p style={{ margin: 0, marginRight: "25px" }}>
									{column.headerName}
								</p>
								<button
									style={{
										position: "absolute",
										top: "5px",
										right: "5px",
										border: "none",
										backgroundColor: "transparent",
										color: "red",
										cursor: "pointer",
									}}
									onClick={() => handleRemoveColumn(index)}
								>
									<Image
										src={"/trash-icon.svg"}
										height={20}
										width={20}
										alt=''
									/>
								</button>
							</div>
						))}
					</div>
					<Paper style={{ height: "90vh", width: "100%", padding: "10px" }}>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "10px",
								marginBottom: "10px",
							}}
						>
							<Button
								variant='outlined'
								color='primary'
								onClick={handleResetColumns}
							>
								Reset
							</Button>
						</div>
						<DataGrid
							rows={filteredRows}
							columns={columns}
							pageSize={10}
							rowsPerPageOptions={[10, 20, 50]}
							checkboxSelection={false}
							disableSelectionOnClick
							sortingMode='client'
							style={{ width: "100%", height: "calc(100% - 100px)" }}
							onRowClick={handleRowClick}
						/>
					</Paper>
				</div>
			</Box>
		</LocalizationProvider>
	);
}

export default CampaignTable;
