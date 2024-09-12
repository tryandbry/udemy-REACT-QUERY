import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import type { Staff } from "@shared/types";

import { filterByTreatment } from "../utils";

import { axiosInstance } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { GiCrescentStaff } from "react-icons/gi";

async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}

export function useStaff() {
  const fallback: Staff[] = [];
  // for filtering staff by treatment
  const [filter, setFilter] = useState("all");

  const selectFn = useCallback((data: Staff[], filter: string) => {
    if (filter === "all") return data;

    return filterByTreatment(data, filter)
  }, []);

  const { data: staff = fallback } = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    select: (data) => selectFn(data, filter)
  })

  return { staff, filter, setFilter };
}
