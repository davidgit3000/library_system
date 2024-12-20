"use client";

import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

const Task: React.FC = () => {
  return (
    <Box sx={{ textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        {/* Manage Catalog Button */}
        <Link href="/catalog">
          <Button
            variant={"contained"}
            //   onClick={() => setActiveTask('Manage Catalog')}
            sx={{
              color: "black",
              borderColor: "black",
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#00843D", color: "white" },
            }}
          >
            Manage Catalog
          </Button>
        </Link>

        {/* Manage Orders Button */}
        <Link href="/order">
          <Button
            variant={"contained"}
            //   onClick={() => setActiveTask('Manage Orders')}
            sx={{
              color: "black",
              borderColor: "black",
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#00843D", color: "white" },
            }}
          >
            Manage Orders
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Task;
