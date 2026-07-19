export enum PersonalNotificationType {
  NEW_CHAPTER = "new_chapter",
  COMMENT_REPLY = "comment_reply",
  COMMENT_LIKE = "comment_like",
  REPLY_REPLY = "reply_reply",
  REPLY_LIKE = "reply_like",
  FOLLOW = "follow",
  MESSAGE = "message",
}

export interface NotificationActorUser {
  id: string;
  username: string;
  nickname: string | null;
  profileImageUrl: string | null;
}

export type PersonalNotificationData = {
  isTest?: boolean;
  novelId?: string | null;
  chapterId?: string | null;
  commentId?: number | string | null;
  parentReplyId?: number | string | null;
  replyId?: number | string | null;
  userId?: string;
  screen?: string;
  id?: string;
  createdBy?: string;
};

export type PersonalNotificationTargetType =
  | "novel"
  | "chapter"
  | "comment"
  | "reply"
  | "user"
  | "message";

export interface PersonalNotification {
  id: string;
  actorUserId?: string | null;
  actorUser?: NotificationActorUser | null;
  type: PersonalNotificationType;
  targetType?: PersonalNotificationTargetType | null;
  targetId?: string | null;
  targetUrl?: string | null;
  title?: string;
  body?: string;
  titleSnapshot?: string;
  bodySnapshot?: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  data?: PersonalNotificationData | null;
  deletedAt?: string | null;
}

export interface GlobalNotification {
  id: string;
  title: string;
  summary: string;
  content: string;
  priority: number;
  isPublished: boolean;
  publishedAt: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  isNew: boolean;
}

export interface GlobalNotificationListResponse {
  items: GlobalNotification[];
  total: number;
  currentPage: number;
  nextPage: number | null;
  lastPage: number;
}

export interface GlobalNotificationDetailResponse {
  item: GlobalNotification;
}

export const DUMMY_NOTIFICATIONS: PersonalNotification[] = [
  {
    id: "1",
    type: PersonalNotificationType.NEW_CHAPTER,
    title: "Shadow Slave",
    body: "92. Bölüm: 'Güneşin Doğuşu' yayında!",
    isRead: false,
    createdAt: "2026-04-22T14:10:00.000Z",
    data: { novelId: "ss-1", chapterId: "92" },
  },
  {
    id: "3",
    type: PersonalNotificationType.COMMENT_REPLY,
    title: "Yorumuna Yanıt Geldi",
    body: "Sunny_Fan: 'Bence bu teorin çok mantıklı, keşke olsa!'",
    isRead: false,
    createdAt: "2026-04-22T12:30:00.000Z",
    data: { commentId: "c-101" },
  },
  {
    id: "4",
    type: PersonalNotificationType.COMMENT_LIKE,
    title: "İncelemen Beğenildi",
    body: "Lord_of_Shadow ve 12 kişi incelemeni beğendi.",
    isRead: true,
    createdAt: "2026-04-22T10:15:00.000Z",
  },
  {
    id: "6",
    type: PersonalNotificationType.NEW_CHAPTER,
    title: "The Primal Hunter",
    body: "Yeni bölüm: 'The Trial Begins' şimdi yayında.",
    isRead: true,
    createdAt: "2026-04-21T18:30:00.000Z",
  },
  {
    id: "7",
    type: PersonalNotificationType.COMMENT_LIKE,
    title: "Yorumun Beğenildi",
    body: "Yorumun 5 yeni beğeni aldı.",
    isRead: true,
    createdAt: "2026-04-21T15:20:00.000Z",
  },
  {
    id: "9",
    type: PersonalNotificationType.REPLY_REPLY,
    title: "İncelemene Yanıt",
    body: "Yazar: 'Desteğin için teşekkürler, 100. bölümde sürpriz var!'",
    isRead: false,
    createdAt: "2026-04-20T21:10:00.000Z",
  },
  {
    id: "10",
    type: PersonalNotificationType.NEW_CHAPTER,
    title: "Lord of the Mysteries",
    body: "Cilt 2: 'The Fool's Gambit' tüm bölümleriyle açıldı.",
    isRead: true,
    createdAt: "2026-04-20T14:00:00.000Z",
  },
  {
    id: "11",
    type: PersonalNotificationType.COMMENT_REPLY,
    title: "Yeni Yanıt",
    body: "Mister_Error yorumunu yanıtladı: 'Katılmıyorum, bence katil uşak değil.'",
    isRead: true,
    createdAt: "2026-04-19T11:45:00.000Z",
  },
  {
    id: "13",
    type: PersonalNotificationType.COMMENT_LIKE,
    title: "Popüler İnceleme!",
    body: "İncelemen 50 beğeniye ulaştı ve trendlere girdi.",
    isRead: true,
    createdAt: "2026-04-17T16:30:00.000Z",
  },
  {
    id: "14",
    type: PersonalNotificationType.NEW_CHAPTER,
    title: "Cradle",
    body: "Final Bölümü: 'Waybound' şimdi AURO'da.",
    isRead: true,
    createdAt: "2026-04-15T12:00:00.000Z",
  },
  {
    id: "15",
    type: PersonalNotificationType.COMMENT_LIKE,
    title: "Yorumun Beğenildi",
    body: "10 kişi yorumunu faydalı buldu.",
    isRead: true,
    createdAt: "2026-04-14T08:20:00.000Z",
  },
];
