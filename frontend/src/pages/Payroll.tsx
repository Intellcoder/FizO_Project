import { useEffect, useState } from "react";
import { Paper, Typography, Grid, Button, Container } from "@mui/material";
import api from "../api/axiosInstance";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type PaymentForm = {
  account_name: string;
  account_number: string;
  bank: string;
};

export default function WorkerPaymentPage() {
  const { register, handleSubmit, reset } = useForm<PaymentForm>();
  const [paymentInfo, setPaymentInfo] = useState<{
    totalPay: number;
    totalHours: number;
    account_name: string;
    account_number: string;
    bank: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const onSubmit = async (data: PaymentForm) => {
    setLoading(true);
    try {
      console.log(data);
      const res = await api.patch("/payment/accountdetails", data);
      toast.success(res.data.message || "Account details added successfully!");
      reset();
      setIsFormOpen(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to add account details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const res = await api.get("/payments/my-payments");
        setPaymentInfo(res.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentInfo();
  }, []);

  if (loading) return;

  const formatTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return "0 hrs 0 mins 0 secs";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs} hr${hrs !== 1 ? "s" : ""} ${mins} min${
      mins !== 1 ? "s" : ""
    } ${secs} sec${secs !== 1 ? "s" : ""}`;
  };

  if (error) {
    return (
      <Typography color="error" textAlign="center" mt={5}>
        {error}
      </Typography>
    );
  }

  if (!paymentInfo) {
    return (
      <Typography textAlign="center" mt={5}>
        No payment record found.
      </Typography>
    );
  }

  return (
    <div style={{ padding: "2rem" }} className="min-h-screen">
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          My Payment Summary
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#4153ef", borderRadius: "8px" }}
          onClick={() => setIsFormOpen(true)}
        >
          Update Payment Details
        </Button>
      </Grid>

      <Grid container spacing={3}>
        <div>
          <Paper sx={{ p: 3 }}>
            <Typography>Total Hours Worked</Typography>
            <Typography variant="h5" fontWeight="bold" color="#4153ef">
              {formatTime(paymentInfo.totalHours)}
            </Typography>
          </Paper>
        </div>

        <div>
          <Paper sx={{ p: 3 }}>
            <Typography>Total Pay</Typography>
            <Typography variant="h5" fontWeight="bold" color="#4CAF50">
              #{paymentInfo.totalPay.toFixed(2)}
            </Typography>
          </Paper>
        </div>
      </Grid>
      <div className="md:flex justify-center md:max-w-[50%]">
        <Container sx={{ mt: 2, mb: 2, ml: 0 }}>
          <Paper sx={{ p: 3 }}>
            <div className="mb-2 flex items-center">
              <Typography>Account Name:</Typography>
              <Typography variant="h5" fontWeight={"bold"} color="#4153ef">
                {paymentInfo.account_name}
              </Typography>
            </div>
            <div className="mt-2 mb-2 flex items-center">
              <Typography>Account Number:</Typography>
              <Typography variant="h5" fontWeight={"bold"} color="#4153ef">
                {paymentInfo.account_number}
              </Typography>
            </div>
            <div className="mt-2 flex items-center">
              <Typography>Bank:</Typography>
              <Typography variant="h6" fontWeight={"bold"} color="#4153ef">
                {paymentInfo.bank}
              </Typography>
            </div>
          </Paper>
        </Container>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFormOpen(false)}
          >
            {" "}
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
            >
              {" "}
              <div className="flex justify-end">
                {" "}
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 text-2xl hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <h1 className="text-lg font-bold text-gray-900 mb-4">
                Add Payment Account Details
              </h1>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <input
                  type="text"
                  placeholder="Account Name"
                  {...register("account_name", {
                    required: "Account name is required",
                  })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef]"
                />
                <input
                  type="text"
                  placeholder="Account Number"
                  {...register("account_number", {
                    required: "Account name is required",
                  })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef]"
                />{" "}
                <input
                  type="text"
                  placeholder="bank"
                  {...register("bank", { required: "Bank is required" })}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#4153ef]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#4153ef] text-white py-2 rounded-lg hover:bg-[#3542c8] transition"
                >
                  {loading ? "Loading..." : "Submit"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
