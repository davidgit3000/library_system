"use client";

import BookCard from "@/components/bookcard/bookcard";
import { formatDate } from "@/lib/utils";
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";

// Data array for categories that will be listed in the sidebar
const categories = [
  "All",
  "Trending",
  "Fiction",
  "Non-fiction",
  "Thriller",
  "Mystery",
  "Fantasy",
  "Self-help",
  "Computer Science",
];

// Main React component for the Home page
export default function Home() {
  const [books, setBooks] = useState([
    {
      bookID: "",
      title: "",
      author: "",
      datePublished: "",
      genre: "",
      imageURL: "",
    },
  ]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All"); // Default to "All" genre
  const [activeGenre, setActiveGenre] = useState<string>(""); // To track the active genre for styling
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const response = await fetch("/api/book");
        const data = await response.json();
        const allBooks = data.books;
        console.log(allBooks);
        if (allBooks) {
          // Map and directly set the new state
          setBooks(
            allBooks.map((book: any) => ({
              bookID: book.bookID,
              title: book.title,
              author: book.author,
              datePublished: formatDate(book.datePublished),
              genre: book.genre,
              imageURL: book.imageURL,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchAllBooks();
  }, []);

  // Group books by genre
  const groupedBooks = books.reduce((acc: Record<string, any[]>, book: any) => {
    const genres = book.genre.split(", ").map((g: string) => g.trim()); // Support for multiple genres
    // console.log(genres);
    genres.forEach((genre: string) => {
      if (!acc[genre]) acc[genre] = [];
      acc[genre].push(book);
    });
    return acc;
  }, {});

  const filteredGroupedBooks =
    selectedGenre === "All"
      ? groupedBooks
      : { [selectedGenre]: groupedBooks[selectedGenre] || [] };

  // console.log(books);
  // Function to handle click events on category items
  const handleCategoryClick = (category: string) => {
    setSelectedGenre(category);
    setActiveGenre(category); // Hightlight the selected genre
  };

  const [category, setCategory] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
    setSelectedGenre(event.target.value);
  };
  // Render the component
  return (
    <>
      <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
        {/* Show loading spinner while fetching books */}
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              minHeight: "100vh",
            }}
          >
            <CircularProgress color="success" />
            <Typography sx={{ mt: 2 }}>Fetching books...</Typography>
          </Box>
        ) : (
          <>
            {/* Sidebar container for category listings */}
            <Box
              sx={{
                position: "fixed", // Keeps the sidebar visible while scrolling
                bgcolor: "white", // Background color
                overflowY: "auto", // Allows scrolling if content exceeds the viewport height
                borderRight: "1px solid #ddd", // Right border styling
                zIndex: 1,
                display: { xs: "none", sm: "block" },
              }}
            >
              {/* List component that contains clickable list items for categories */}
              <List sx={{ width: "100%", padding: "0.5rem 0.8rem" }}>
                {categories.map((category, index) => (
                  <ListItem
                    component="button"
                    key={index}
                    onClick={() => handleCategoryClick(category)}
                    sx={{
                      backgroundColor:
                        activeGenre === category ? "#00843d" : "white", // Highlight selected genre
                      color: activeGenre === category ? "white" : "black", // Change text color based on selection
                      boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                      borderBottom: "2px solid #ddd",
                      borderRadius: "5px",
                      marginBottom: "5px",
                      justifyContent: "center",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease", // Smooth transition
                      "&:hover": {
                        backgroundColor: "#00843d",
                        color: "white",
                        boxShadow: 5,
                        transform: "scale(1.08)",
                      },
                    }}
                  >
                    <ListItemText primary={category} />
                    {/* Displayed the category name */}
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Main Content Area for displaying books by category */}
            <Box
              sx={{
                marginLeft: { xs: "0", sm: "12rem" },
                width: "100%",
                flex: 1, // Takes up remaining space after the sidebar
                padding: "0 1.5rem 1.5rem 1.5rem", // Padding around the content area
                justifyContent: "center", // Centers the content horizontally
              }}
            >
              <FormControl
                variant="filled"
                sx={{
                  mt: 2,
                  width: "100%",
                  display: { xs: "block", sm: "none" },
                  backgroundColor: "#00843D",
                  color: "white",
                  opacity: 0.9,
                  borderRadius: "1rem",
                  "& .MuiFilledInput-root": {
                    borderRadius: "1rem", // Rounds the inner Select component
                    backgroundColor: "#00843D", // Ensure consistent background
                    borderBottom: "none", // Remove the bottom border
                    "&:before": {
                      borderBottom: "none", // Removes the underline before focus
                    },
                    "&:after": {
                      borderBottom: "none", // Removes the underline after focus
                    },
                  },
                }}
              >
                <InputLabel
                  id="demo-simple-select-filled-label"
                  sx={{
                    color: "white",
                    borderRadius: "1rem",
                    "&.Mui-focused": {
                      color: "white", // Change this to your desired color
                    },
                  }}
                >
                  Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  value={category}
                  onChange={handleChange}
                  sx={{
                    width: "100%",
                    color: "white",
                    borderRadius: "1rem",
                  }}
                >
                  {categories.map((category, index) => (
                    <MenuItem key={index} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Iterates over each category and its books to render them */}
              {Object.entries(filteredGroupedBooks).map(([genre, books]) => (
                <Box key={genre} sx={{ marginBottom: "2rem" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mt: 2,
                      mb: 2,
                      color: "#00843d",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                    }}
                  >
                    {genre}
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(1, 1fr)",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                      },
                      gap: 2,
                    }}
                  >
                    {books.length > 0 ? (
                      books.map((book) => (
                        <BookCard
                          key={book.bookID}
                          bookID={book.bookID}
                          title={book.title}
                          author={book.author}
                          datePublished={book.datePublished}
                          imageURL={book.imageURL}
                        />
                      ))
                    ) : (
                      <Typography variant="h6">No books found.</Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
