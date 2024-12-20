import { useUser } from "@/contexts/UserContext";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

export default function Footer() {
  const [userID, setUserID] = useState<string>("");
  const { role } = useUser();

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    if (userID) {
      setUserID(userID);
    }
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#00843d",
        color: "#fff",
        width: "100%",
        textAlign: "center",
        padding: "1rem",
        mt: "auto",
      }}
    >
      {/* Quick Links */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        <Link
          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          href="/"
          color="inherit"
          underline="hover"
        >
          Home
        </Link>
        <Link
          sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
          href="/credits"
          color="inherit"
          underline="hover"
        >
          About Us
        </Link>
        {userID && role === "STUDENT" && (
          <>
            <Link
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              href={`/profile/${userID}`}
              color="inherit"
              underline="hover"
            >
              Your Profile
            </Link>
            <Link
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              href="/orders"
              color="inherit"
              underline="hover"
            >
              Your Orders
            </Link>
          </>
        )}
        {userID && role === "STAFF" && (
          <>
            <Link
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              href="/catalog"
              color="inherit"
              underline="hover"
            >
              Manage Catalog
            </Link>
            <Link
              sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
              href="/order"
              color="inherit"
              underline="hover"
            >
              Manage Orders
            </Link>
          </>
        )}
      </Box>

      {/* Social Media Links */}
      <Box mt={1} sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <IconButton
          href="https://www.facebook.com"
          target="_blank"
          color="inherit"
          aria-label="Facebook"
        >
          <Facebook />
        </IconButton>
        <IconButton
          href="https://www.twitter.com"
          target="_blank"
          color="inherit"
          aria-label="Twitter"
        >
          <Twitter />
        </IconButton>
        <IconButton
          href="https://www.instagram.com"
          target="_blank"
          color="inherit"
          aria-label="Instagram"
        >
          <Instagram />
        </IconButton>
      </Box>

      {/* Copyright */}
      <Typography
        variant="body2"
        color="inherit"
        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
        mt={1}
      >
        © {new Date().getFullYear()} CPPLib. All rights reserved.
      </Typography>
    </Box>
  );
}
