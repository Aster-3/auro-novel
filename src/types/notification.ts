export enum PersonalNotificationType {
  NEW_CHAPTER = "new_chapter",
  REVIEW_REPLY = "review_reply",
  REVIEW_LIKE = "review_like",
  COMMENT_LIKE = "comment_like",
  COMMENT_REPLY = "comment_reply",
  PAYMENT_REQUEST = "payment_request",
  PAYMENT_SUCCESS = "payment_success",
  PAYMENT_FAILURE = "payment_failure",
}

export interface PersonalNotification {
  id: string;
  type: PersonalNotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export interface GlobalNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  isNew: boolean;
  data?: any;
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
    id: "2",
    type: PersonalNotificationType.PAYMENT_SUCCESS,
    title: "Ödeme Başarılı",
    body: "500 Gece Parçası hesabınıza tanımlandı. Keyifli okumalar!",
    isRead: false,
    createdAt: "2026-04-22T13:45:00.000Z",
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
    type: PersonalNotificationType.REVIEW_LIKE,
    title: "İncelemen Beğenildi",
    body: "Lord_of_Shadow ve 12 kişi incelemeni beğendi.",
    isRead: true,
    createdAt: "2026-04-22T10:15:00.000Z",
  },
  {
    id: "5",
    type: PersonalNotificationType.PAYMENT_FAILURE,
    title: "Ödeme Başarısız",
    body: "Abonelik yenileme işleminiz banka reddi nedeniyle gerçekleşmedi.",
    isRead: false,
    createdAt: "2026-04-21T22:00:00.000Z",
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
    id: "8",
    type: PersonalNotificationType.PAYMENT_REQUEST,
    title: "Ödeme Talebi Alındı",
    body: "Yazarlık kazancınız için para çekme talebi oluşturuldu.",
    isRead: true,
    createdAt: "2026-04-21T09:00:00.000Z",
  },
  {
    id: "9",
    type: PersonalNotificationType.REVIEW_REPLY,
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
    id: "12",
    type: PersonalNotificationType.PAYMENT_SUCCESS,
    title: "Abonelik Yenilendi",
    body: "Premium üyeliğiniz 1 ay süreyle uzatıldı.",
    isRead: true,
    createdAt: "2026-04-18T00:01:00.000Z",
  },
  {
    id: "13",
    type: PersonalNotificationType.REVIEW_LIKE,
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
