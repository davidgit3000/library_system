import { useCart } from "@/contexts/CartContext";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import AccountMenu from "./accountmenu";
import Searchbar from "./searchbar";

const Headbar = memo(() => {
  const [role, setRole] = useState<string | null>("");

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    const getRole = async () => {
      try {
        const response = await fetch(`/api/user/${userID}`);
        const data = await response.json();
        setRole(data.role);
      } catch (error) {
        console.error("Error fetching role:", error);
        return null;
      }
    };
    getRole();
  }, []);
  // console.log(role);

  const drawerWidth = 240;
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };
  const navItems = {
    Home: () => navigateTo("/"),
    "Your Cart": () => navigateTo("/cart"),
  };
  const { cart } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: "bold" }}>
        CPPLib
      </Typography>
      <Divider />
      <List>
        {Object.entries(navItems).map(([text, func]) => (
          <ListItem key={text} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }} onClick={func}>
              {text === "Your Cart" && (
                <Badge badgeContent={cart.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              )}
              {text === "Home" && <HomeIcon />}
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" style={{ backgroundColor: "#00843d" }}>
        <Toolbar className="flex gap-4 justify-between">
          <div className="flex gap-4 flex-1 items-center">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            {/* Logo */}
            <Link
              href="/"
              color="inherit"
              className="hover:bg-green-100/70 hover:text-black rounded-xl"
            >
              <h4 className="hidden sm:block font-bold text-4xl">CPPLib</h4>
            </Link>

            {/* Search Bar */}
            <Searchbar />
          </div>

          <div className="flex gap-4 items-center">
            {/* Navigation Links */}
            <Tooltip title="Home" arrow>
              <Link
                href="/"
                color="inherit"
                className="hidden md:block hover:bg-green-100/70 hover:text-black rounded-full"
              >
                <IconButton color="inherit">
                  <HomeIcon fontSize="large" />
                </IconButton>
              </Link>
            </Tooltip>

            {/* Cart Icon */}
            {role === "STUDENT" && (
              <Tooltip title="Book Cart" arrow>
                <Link
                  href="/cart"
                  color="inherit"
                  className="hidden md:block hover:bg-green-100/70 hover:text-black rounded-full"
                >
                  <IconButton color="inherit">
                    <Badge badgeContent={cart.length} color="error">
                      <ShoppingCartIcon fontSize="large" />
                    </Badge>
                  </IconButton>
                </Link>
              </Tooltip>
            )}

            {/* Account Menu with Logout */}
            <AccountMenu className="bg-white w-9 h-9 flex items-center justify-center rounded-full text-black font-bold hover:bg-slate-700/45 hover:text-white hover:font-bold " />
          </div>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { md: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </>
  );
});

export default Headbar;
