export interface Volume {
  id: string;
  name: string;
  coverImage: string | null;
  orderIndex: number;
  novelId: string;
}

export interface GetVolumesByNovelIdResponse {
  volumes: Volume[];
}
