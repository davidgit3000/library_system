import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Tooltip } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import Toolbar from "@mui/material/Toolbar";
import AccountMenu from "./accountmenu";
import Searchbar from "./searchbar";
import { memo } from "react";
import { useCart } from "@/contexts/CartContext";

const Headbar = memo(() => {
  const { cart } = useCart();

  return (
    <AppBar position="sticky" style={{ backgroundColor: "#00843d" }}>
      <Toolbar className="flex gap-4 justify-between">
        <div className="flex gap-4 flex-1 items-center">
          {/* Logo */}
          <Link
            href="/"
            color="inherit"
            className="hover:bg-green-100/70 hover:text-black rounded-xl"
          >
            <h4 className="font-bold text-4xl">CPPLib</h4>
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
              className="hover:bg-green-100/70 hover:text-black rounded-full"
            >
              <IconButton color="inherit">
                <HomeIcon fontSize="large" />
              </IconButton>
            </Link>
          </Tooltip>

          {/* Cart Icon */}
          <Tooltip title="Book Cart" arrow>
            <Link
              href="/"
              color="inherit"
              className="hover:bg-green-100/70 hover:text-black rounded-full"
            >
              <IconButton color="inherit">
                <Badge badgeContent={cart.length} color="error">
                  <ShoppingCartIcon fontSize="large" />
                </Badge>
              </IconButton>
            </Link>
          </Tooltip>

          {/* Account Menu with Logout */}
          <AccountMenu className="bg-white w-9 h-9 flex items-center justify-center rounded-full text-black font-bold hover:bg-slate-700/45 hover:text-white hover:font-bold " />
        </div>
      </Toolbar>
    </AppBar>
  );
});

export default Headbar;
