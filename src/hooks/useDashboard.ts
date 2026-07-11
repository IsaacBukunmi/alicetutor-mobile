import { getDashboardData } from "@/api/dashboard"
import { DashboardResponse } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const useDashboard = () => {
    return useQuery<DashboardResponse>({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const {data} = await getDashboardData()
            return data
        },
        staleTime: 1000 * 60 * 5,
    })
}