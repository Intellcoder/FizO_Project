import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function useFormWithLoader<T>(
  apiCall: (formData: T) => Promise<any>,
  onSuccess?: () => void
) {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (formData: T) => {
    setStatus("loading");

    try {
      await apiCall(formData);
      setStatus("success");

      setTimeout(() => {
        onSuccess && onSuccess();
      }, 2000);
    } catch (error) {
      setStatus("error");
      return error;
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return { status, handleSubmit };
}
