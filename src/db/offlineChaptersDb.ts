import * as SQLite from "expo-sqlite";
import {
  DownloadedChapterRow,
  DownloadedNovelSummary,
  DownloadedNovelRow,
  OfflineChapterPayload,
  OfflineNovelManifestNovel,
} from "@/types/offline";

const DB_NAME = "auro_offline_reading.db";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const getDb = async () => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }

  const db = await dbPromise;
  await initOfflineDb(db);
  return db;
};

const initOfflineDb = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS downloaded_novels (
      id TEXT PRIMARY KEY NOT NULL,
      ownerUserId TEXT,
      name TEXT NOT NULL,
      slug TEXT,
      coverImage TEXT,
      synopsis TEXT,
      status TEXT,
      chapterCount INTEGER NOT NULL DEFAULT 0,
      lastChapterDate TEXT,
      updatedAt TEXT,
      generatedAt TEXT,
      downloadedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS downloaded_chapters (
      id TEXT PRIMARY KEY NOT NULL,
      ownerUserId TEXT,
      novelId TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      chapterOrder INTEGER NOT NULL,
      volumeId TEXT,
      volumeName TEXT,
      volumeOrder INTEGER,
      publishedAt TEXT,
      updatedAt TEXT,
      wordCount INTEGER,
      downloadedAt TEXT NOT NULL,
      FOREIGN KEY (novelId) REFERENCES downloaded_novels(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_downloaded_chapters_novel_order
      ON downloaded_chapters(novelId, volumeOrder, chapterOrder);

    CREATE TABLE IF NOT EXISTS offline_download_retry_queue (
      chapterId TEXT PRIMARY KEY NOT NULL,
      ownerUserId TEXT,
      novelId TEXT NOT NULL,
      error TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

  `);

  await addColumnIfMissing(db, "downloaded_novels", "ownerUserId TEXT");
  await addColumnIfMissing(db, "downloaded_chapters", "ownerUserId TEXT");
  await addColumnIfMissing(
    db,
    "offline_download_retry_queue",
    "ownerUserId TEXT",
  );

  await db.runAsync("DELETE FROM downloaded_chapters WHERE ownerUserId IS NULL");
  await db.runAsync("DELETE FROM downloaded_novels WHERE ownerUserId IS NULL");
  await db.runAsync(
    "DELETE FROM offline_download_retry_queue WHERE ownerUserId IS NULL",
  );
};

const addColumnIfMissing = async (
  db: SQLite.SQLiteDatabase,
  tableName: string,
  columnDefinition: string,
) => {
  const columnName = columnDefinition.split(" ")[0];
  const columns = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${tableName})`,
  );

  if (columns.some((column) => column.name === columnName)) return;

  await db.runAsync(`ALTER TABLE ${tableName} ADD COLUMN ${columnDefinition}`);
};

export const ensureOfflineDbReady = async () => {
  await getDb();
};

export const upsertDownloadedNovel = async (
  ownerUserId: string,
  novel: OfflineNovelManifestNovel,
  generatedAt?: string | null,
) => {
  const db = await getDb();
  const downloadedAt = new Date().toISOString();

  await db.runAsync(
    `
      INSERT INTO downloaded_novels (
        id, ownerUserId, name, slug, coverImage, synopsis, status, chapterCount,
        lastChapterDate, updatedAt, generatedAt, downloadedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        ownerUserId = excluded.ownerUserId,
        name = excluded.name,
        slug = excluded.slug,
        coverImage = excluded.coverImage,
        synopsis = excluded.synopsis,
        status = excluded.status,
        chapterCount = excluded.chapterCount,
        lastChapterDate = excluded.lastChapterDate,
        updatedAt = excluded.updatedAt,
        generatedAt = excluded.generatedAt
    `,
    novel.id,
    ownerUserId,
    novel.name,
    novel.slug,
    novel.coverImage,
    novel.synopsis,
    novel.status,
    novel.chapterCount,
    novel.lastChapterDate,
    novel.updatedAt,
    generatedAt ?? null,
    downloadedAt,
  );
};

export const upsertDownloadedChapters = async (
  ownerUserId: string,
  chapters: OfflineChapterPayload[],
) => {
  if (!chapters.length) return;

  const db = await getDb();
  const downloadedAt = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    for (const chapter of chapters) {
      await db.runAsync(
        `
          INSERT INTO downloaded_chapters (
            id, ownerUserId, novelId, title, content, chapterOrder, volumeId, volumeName,
            volumeOrder, publishedAt, updatedAt, wordCount, downloadedAt
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            ownerUserId = excluded.ownerUserId,
            novelId = excluded.novelId,
            title = excluded.title,
            content = excluded.content,
            chapterOrder = excluded.chapterOrder,
            volumeId = excluded.volumeId,
            volumeName = excluded.volumeName,
            volumeOrder = excluded.volumeOrder,
            publishedAt = excluded.publishedAt,
            updatedAt = excluded.updatedAt,
            wordCount = excluded.wordCount,
            downloadedAt = excluded.downloadedAt
        `,
        chapter.id,
        ownerUserId,
        chapter.novelId,
        chapter.title,
        chapter.content,
        chapter.chapterOrder,
        chapter.volumeId,
        chapter.volumeName,
        chapter.volumeOrder,
        chapter.publishedAt,
        chapter.updatedAt,
        chapter.wordCount,
        downloadedAt,
      );

      await db.runAsync(
        "DELETE FROM offline_download_retry_queue WHERE ownerUserId = ? AND chapterId = ?",
        ownerUserId,
        chapter.id,
      );
    }
  });
};

export const getDownloadedChapterIdsByNovel = async (
  ownerUserId: string,
  novelId: string,
) => {
  const db = await getDb();
  const rows = await db.getAllAsync<{ id: string }>(
    "SELECT id FROM downloaded_chapters WHERE ownerUserId = ? AND novelId = ?",
    ownerUserId,
    novelId,
  );
  return rows.map((row) => row.id);
};

export const getDownloadedChaptersByNovel = async (
  ownerUserId: string,
  novelId: string,
): Promise<DownloadedChapterRow[]> => {
  const db = await getDb();
  return db.getAllAsync<DownloadedChapterRow>(
    `
      SELECT * FROM downloaded_chapters
      WHERE ownerUserId = ? AND novelId = ?
      ORDER BY volumeOrder ASC, chapterOrder ASC
    `,
    ownerUserId,
    novelId,
  );
};

export const getDownloadedNovels = async (
  ownerUserId: string,
): Promise<DownloadedNovelRow[]> => {
  const db = await getDb();
  return db.getAllAsync<DownloadedNovelRow>(
    "SELECT * FROM downloaded_novels WHERE ownerUserId = ? ORDER BY downloadedAt DESC",
    ownerUserId,
  );
};

export const getDownloadedNovelSummaries = async (
  ownerUserId: string,
): Promise<
  DownloadedNovelSummary[]
> => {
  const db = await getDb();
  return db.getAllAsync<DownloadedNovelSummary>(
    `
      SELECT
        novels.id AS novelId,
        novels.name,
        novels.slug,
        novels.synopsis,
        novels.coverImage,
        novels.status,
        COUNT(chapters.id) AS downloadedChapterCount,
        novels.chapterCount AS totalPublishedChapters,
        MAX(chapters.downloadedAt) AS lastDownloadedAt,
        novels.updatedAt
      FROM downloaded_novels novels
      INNER JOIN downloaded_chapters chapters
        ON chapters.novelId = novels.id
        AND chapters.ownerUserId = novels.ownerUserId
      WHERE novels.ownerUserId = ?
      GROUP BY novels.id
      ORDER BY lastDownloadedAt DESC
    `,
    ownerUserId,
  );
};

export const getDownloadedNovelSummary = async (
  ownerUserId: string,
  novelId: string,
): Promise<DownloadedNovelSummary | null> => {
  const db = await getDb();
  const rows = await db.getAllAsync<DownloadedNovelSummary>(
    `
      SELECT
        novels.id AS novelId,
        novels.name,
        novels.slug,
        novels.synopsis,
        novels.coverImage,
        novels.status,
        COUNT(chapters.id) AS downloadedChapterCount,
        novels.chapterCount AS totalPublishedChapters,
        MAX(chapters.downloadedAt) AS lastDownloadedAt,
        novels.updatedAt
      FROM downloaded_novels novels
      LEFT JOIN downloaded_chapters chapters
        ON chapters.novelId = novels.id
        AND chapters.ownerUserId = novels.ownerUserId
      WHERE novels.ownerUserId = ? AND novels.id = ?
      GROUP BY novels.id
    `,
    ownerUserId,
    novelId,
  );

  return rows[0] ?? null;
};

export const getDownloadedChapterById = async (
  ownerUserId: string,
  chapterId: string,
): Promise<DownloadedChapterRow | null> => {
  const db = await getDb();
  const rows = await db.getAllAsync<DownloadedChapterRow>(
    "SELECT * FROM downloaded_chapters WHERE ownerUserId = ? AND id = ?",
    ownerUserId,
    chapterId,
  );
  return rows[0] ?? null;
};

export const getAdjacentDownloadedChapterIds = async (
  ownerUserId: string,
  chapterId: string,
): Promise<{
  previousChapterId: string | null;
  nextChapterId: string | null;
}> => {
  const chapter = await getDownloadedChapterById(ownerUserId, chapterId);
  if (!chapter) {
    return { previousChapterId: null, nextChapterId: null };
  }

  const chapters = await getDownloadedChaptersByNovel(
    ownerUserId,
    chapter.novelId,
  );
  const index = chapters.findIndex((item) => item.id === chapterId);

  return {
    previousChapterId: index > 0 ? chapters[index - 1].id : null,
    nextChapterId:
      index >= 0 && index < chapters.length - 1
        ? chapters[index + 1].id
        : null,
  };
};

export const deleteDownloadedChapters = async (
  ownerUserId: string,
  novelId: string,
  chapterIds: string[],
) => {
  if (!chapterIds.length) return;

  const db = await getDb();
  const placeholders = chapterIds.map(() => "?").join(",");

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `DELETE FROM downloaded_chapters WHERE ownerUserId = ? AND novelId = ? AND id IN (${placeholders})`,
      ownerUserId,
      novelId,
      ...chapterIds,
    );

    const remaining = await db.getAllAsync<{ count: number }>(
      "SELECT COUNT(*) AS count FROM downloaded_chapters WHERE ownerUserId = ? AND novelId = ?",
      ownerUserId,
      novelId,
    );

    if ((remaining[0]?.count ?? 0) === 0) {
      await db.runAsync(
        "DELETE FROM downloaded_novels WHERE ownerUserId = ? AND id = ?",
        ownerUserId,
        novelId,
      );
    }
  });
};

export const addOfflineDownloadRetry = async (
  ownerUserId: string,
  novelId: string,
  chapterId: string,
  error: string,
) => {
  const db = await getDb();
  const now = new Date().toISOString();

  await db.runAsync(
    `
      INSERT INTO offline_download_retry_queue (
        chapterId, ownerUserId, novelId, error, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(chapterId) DO UPDATE SET
        ownerUserId = excluded.ownerUserId,
        novelId = excluded.novelId,
        error = excluded.error,
        updatedAt = excluded.updatedAt
    `,
    chapterId,
    ownerUserId,
    novelId,
    error,
    now,
    now,
  );
};

export const deleteDownloadedDataForUser = async (ownerUserId: string) => {
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      "DELETE FROM downloaded_chapters WHERE ownerUserId = ?",
      ownerUserId,
    );
    await db.runAsync(
      "DELETE FROM downloaded_novels WHERE ownerUserId = ?",
      ownerUserId,
    );
    await db.runAsync(
      "DELETE FROM offline_download_retry_queue WHERE ownerUserId = ?",
      ownerUserId,
    );
  });
};

export const deleteAllDownloadedData = async () => {
  const db = await getDb();

  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM downloaded_chapters");
    await db.runAsync("DELETE FROM downloaded_novels");
    await db.runAsync("DELETE FROM offline_download_retry_queue");
  });
};
