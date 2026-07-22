"use server";

import api from "../api/axios";
import { API } from "../api/endpoints";

export async function initiateKhaltiPayment(data: any) {
  try {
    const response = await api.post(
      API.PAYMENT.INITIATE,
      data
    );

    return response.data;
  } catch (error: any) {
    console.log("========== PAYMENT INITIATE ERROR ==========");
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);

    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.detail ||
      "Khalti payment failed"
    );
  }
}

export async function verifyKhaltiPayment(
  pidx: string,
  purchase_order_id: string
) {
  try {
    const response = await api.post(
      API.PAYMENT.VERIFY,
      {
        pidx,
        purchase_order_id,
      }
    );

    return response.data;
  } catch (error: any) {
    console.log("========== PAYMENT VERIFY ERROR ==========");
    console.log("Status:", error.response?.status);
    console.log("Response:", error.response?.data);

    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.detail ||
      "Payment verification failed"
    );
  }
}