"use client";

import CustomStepIcon from "@/components/order/CustomStepIcon";
import { formatDate } from "@/lib/utils";
import { Warning } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  StepConnector as MuiStepConnector,
  Step,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@mui/material";
import { BookOrder, OrderStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Steps for the Stepper
const steps = ["Order placed", "Preparing", "Ready to pick up", "Picked up"];

// Custom Step Connector
const CustomStepConnector = styled(MuiStepConnector)(({ theme }) => ({
  [`& .MuiStepConnector-line`]: {
    borderColor: "#ddd",
    borderWidth: 2, // Thickness of the line
  },
}));

type BookItem = {
  bookID: string;
  title: string;
  author: string;
  imageURL: string;
};

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<BookOrder[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, BookItem[]>>({});
  const [studentID, setStudentID] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New state for dialog control
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState<string | null>(null);

  // Fetch studentID when the component loads
  useEffect(() => {
    const fetchStudentID = async () => {
      const userID = localStorage.getItem("userID");

      if (!userID) {
        console.error("Failed to fetch student ID. Please try again.");
        return;
      }

      try {
        const response = await fetch(`/api/user/${userID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch student ID");
        }

        const data = await response.json();
        // console.log(data);
        setStudentID(data.studentID);
      } catch (error) {
        console.error("Error fetching student ID:", error);
      }
    };

    fetchStudentID();
  }, []);

  // Fetch orders when studentID is available
  useEffect(() => {
    if (!studentID) return;

    setIsLoading(true);
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders/${studentID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        const { orders } = data;

        // Sort orders by orderDate (assuming it's a string in ISO format)
        const sortedOrders = orders.sort(
          (a: BookOrder, b: BookOrder) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );

        // console.log(sortedOrders);
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchOrders();
  }, [studentID, isCanceling]);

  // Get book items in each order ID
  useEffect(() => {
    setIsLoading(true);
    const fetchOrderItems = async () => {
      try {
        const items = await Promise.all(
          orders.map(async ({ orderID }) => {
            const response = await fetch(`/api/order/${orderID}`);
            const data = await response.json();
            const { orderItems } = data;
            // console.log(orderItems);
            return { orderID, items: orderItems };
          })
        );

        const itemsByOrderID: Record<string, BookItem[]> = items.reduce(
          (acc: Record<string, BookItem[]>, { orderID, items }) => {
            acc[orderID] = items;
            return acc;
          },
          {} as Record<string, BookItem[]> // Initialize with the correct type
        );

        // console.log(itemsByOrderID);
        setOrderItems(itemsByOrderID);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchOrderItems();
  }, [orders]);

  // Get current stage of orders
  const currentStatus = (status: OrderStatus) => {
    switch (status) {
      case "ORDERED":
        return 0;
      case "RECEIVED":
        return 1;
      case "READY":
        return 2;
      case "BORROWED":
        return 3;
      default:
        return 0;
    }
  };

  const handleCancelOrder = async (orderID: string) => {
    try {
      setIsCanceling(true);
      const response = await fetch(`/api/order/${orderID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "CANCELED" }),
      });
      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    } finally {
      setIsCanceling(false); // Set loading to false once the fetch is complete
      setIsDialogOpen(false); // Close dialog after action
    }
  };

  // Dialog control functions
  const openDialog = (orderID: string) => {
    setSelectedOrderID(orderID);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedOrderID(null);
    setIsDialogOpen(false);
  };

  return (
    <>
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
          <Typography sx={{ mt: 2 }}>Fetching your orders...</Typography>
        </Box>
      ) : (
        <Box sx={{ padding: 4 }}>
          <Typography variant="h4" fontWeight={"bold"} gutterBottom>
            Your Orders
          </Typography>

          {orders.length > 0 ? (
            orders.map((order) => {
              const items = orderItems[order.orderID] || [];
              const firstBook = items[0] || null; // Get the first book
              const remainingBooks = items.length - 1; // Count remaining books

              return (
                <Box
                  key={order.orderID}
                  sx={{
                    marginBottom: 4,
                    padding: 2,
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #00843D",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Order Date: {formatDate(order.orderDate)}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    {/* Book Image */}
                    <Card sx={{ width: 120, height: 160, overflow: "hidden" }}>
                      {firstBook ? (
                        <img
                          src={firstBook.imageURL}
                          alt={firstBook.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Typography variant="caption" align="center">
                          No image available
                        </Typography>
                      )}
                    </Card>

                    {/* Book Info */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        flex: 1,
                        justifyContent: { xs: "center", md: "flex-start" },
                        alignItems: "center",
                        gap: { xs: 1, md: 2 },
                      }}
                    >
                      <CardContent>
                        {firstBook ? (
                          <>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: "bold",
                                textAlign: { xs: "center", md: "left" },
                                fontSize: { xs: "1.1em", md: "1.3rem" },
                              }}
                            >
                              {firstBook.title}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontSize: { xs: "1em", md: "1rem" },
                                textAlign: { xs: "center", md: "left" },
                              }}
                            >
                              by {firstBook.author}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No book information available
                          </Typography>
                        )}
                      </CardContent>
                      {order.status !== "CANCELED" &&
                        order.status !== "RETURNED" &&
                        order.status !== "OVERDUE" && (
                          <Stepper
                            activeStep={currentStatus(order.status)}
                            alternativeLabel
                            connector={<CustomStepConnector />}
                            sx={{
                              flex: 1,
                              maxWidth: { xs: "100%", md: "80%" }, // Reduce the length of the Stepper
                              marginLeft: "auto",
                              marginRight: "auto",
                            }}
                          >
                            {steps.map((label, stepIndex) => (
                              <Step key={stepIndex}>
                                <StepLabel
                                  StepIconComponent={(props) => (
                                    <CustomStepIcon {...props} />
                                  )}
                                >
                                  <Typography variant="caption">
                                    {label}
                                  </Typography>
                                </StepLabel>
                              </Step>
                            ))}
                          </Stepper>
                        )}
                      {order.status === "OVERDUE" && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#FFC107", // Yellow warning color
                            padding: 1,
                            borderRadius: 2,
                          }}
                        >
                          <Warning sx={{ mr: 1 }} />
                          <Typography variant="body1" fontWeight="bold">
                            Overdue
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* "+ More" Link */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" }, // Horizontal layout
                        alignItems: "center", // Center vertically
                        justifyContent: "flex-end",
                        gap: { xs: 2, md: 8 },
                      }}
                    >
                      {remainingBooks > 0 && (
                        <Typography
                          variant="body1"
                          color="primary"
                          sx={{
                            border: "1px solid #00843D",
                            color: "#00843D",
                            padding: 1,
                            borderRadius: 2,
                          }}
                        >
                          +{remainingBooks}{" "}
                          {remainingBooks === 1 ? "book" : "books"} more
                        </Typography>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: 3,
                            boxShadow: 7,
                            backgroundColor: "#00843d",
                            "&:hover": {
                              opacity: 0.7,
                            },
                          }}
                          onClick={() =>
                            router.push(`/orders/${order.orderID}`)
                          }
                        >
                          View Details
                        </Button>
                        {order.status !== "BORROWED" &&
                          order.status !== "OVERDUE" &&
                          order.status !== "RETURNED" && (
                            <Button
                              disabled={order.status === "CANCELED"}
                              variant="contained"
                              sx={{
                                borderRadius: 3,
                                boxShadow: 7,
                                backgroundColor: `${
                                  order.status === "CANCELED"
                                    ? "#808080"
                                    : "#F6171A"
                                }`,
                                "&:hover": {
                                  opacity: 0.7,
                                },
                              }}
                              onClick={() => openDialog(order.orderID)}
                            >
                              {order.status === "CANCELED"
                                ? "Order Canceled"
                                : "Cancel Order"}
                            </Button>
                          )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography variant="h6">You don't have any orders yet.</Typography>
          )}

          {/* Confirmation Dialog */}
          <Dialog open={isDialogOpen} onClose={closeDialog}>
            <DialogTitle fontWeight={"bold"}>Confirm Cancellation</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to cancel this order?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDialog} color="inherit">
                No
              </Button>
              <Button
                onClick={() =>
                  selectedOrderID && handleCancelOrder(selectedOrderID)
                }
                color="error"
                variant="contained"
              >
                {isCanceling ? "Cancelling..." : "Yes"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
}
