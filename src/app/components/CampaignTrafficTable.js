import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tooltip } from "@mui/material";

const CampaignTrafficTable = ({ data }) => {
  if (!data || !data.naked_links) {
    return (
      <Typography>
        Нет данных для отображения.
      </Typography>
    );
  }

  const handleCopyClick = (url) => {
    navigator.clipboard.writeText(url);
    alert(`Скопировано: ${url}`);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Ссылки на трафик
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Название</strong></TableCell>
              <TableCell><strong>URL</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.naked_links.map((link) => (
              <TableRow key={link.id}>
                <TableCell>{link.name}</TableCell>
                <TableCell>
                  <Tooltip title="Кликните, чтобы скопировать">
                    <Typography
                      variant="body2"
                      color="primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCopyClick(link.url)}
                    >
                      {link.url}
                    </Typography>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CampaignTrafficTable;
