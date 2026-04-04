import { getVolumes } from "@/services/VolumeService";
import { useQuery } from "@tanstack/react-query";

export const useVolumeQuery = (novelId: string) => {
  return useQuery({
    queryKey: ["volumes", novelId],
    queryFn: () => getVolumes(novelId),
    select: (data) => data.volumes,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
