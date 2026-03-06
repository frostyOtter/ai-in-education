"use client";

import { useEffect, useState } from "react";
import { ErrorHelper } from "@/lib/error-helper";
import { ConnectionDetails } from "@/types";

export default function useConnectionDetails() {
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchConnectionDetails = () => {
    setLoading(true);
    fetch("/api/connection-details")
      .then((res) => res.json())
      .then((data) => {
        setConnectionDetails(data);
      })
      .catch((error) => {
        ErrorHelper("Error fetching connection details:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchConnectionDetails();
  }, []);

  return { connectionDetails, loading };
}
