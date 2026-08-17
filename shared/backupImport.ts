import { BACKUP_PACKAGE_TYPE, BACKUP_SCHEMA_VERSION, type PortableBackupPackage } from "./backup";

export type BackupImportDiffSection = {
  incoming: number;
  insert: number;
  update: number;
  duplicate: number;
  invalid: number;
};

export type BackupImportDiff = {
  testimonials: BackupImportDiffSection;
  collaborations: BackupImportDiffSection;
  analytics: BackupImportDiffSection;
};

export type BackupImportPreview = {
  schemaVersion: string;
  exportedAt: string;
  projectTitle: string;
  usersSkipped: number;
  testimonials: number;
  collaborations: number;
  analytics: number;
  staticLanguages: number;
  includesSecrets: false;
  restoreMode: "merge-by-id";
  diff?: BackupImportDiff;
};

export function parsePortableBackupPackage(input: unknown): PortableBackupPackage {
  if (!input || typeof input !== "object") {
    throw new Error("Файл backup должен содержать JSON-объект");
  }

  const value = input as Partial<PortableBackupPackage>;
  if (value.packageType !== BACKUP_PACKAGE_TYPE) {
    throw new Error("Это не portable backup Isaac Hakobian Media Kit");
  }
  if (value.schemaVersion !== BACKUP_SCHEMA_VERSION) {
    throw new Error(`Неподдерживаемая версия backup: ${String(value.schemaVersion ?? "не указана")}`);
  }
  if (!value.database || typeof value.database !== "object") {
    throw new Error("В backup отсутствует database snapshot");
  }
  if (!value.staticContent || typeof value.staticContent !== "object") {
    throw new Error("В backup отсутствует static content");
  }

  const database = value.database as PortableBackupPackage["database"];
  const staticContent = value.staticContent as PortableBackupPackage["staticContent"];
  for (const [key, rows] of Object.entries(database)) {
    if (!Array.isArray(rows)) throw new Error(`Раздел database.${key} повреждён`);
  }
  if (!Array.isArray(staticContent.siteConfig?.languages)) {
    throw new Error("В backup отсутствует корректная конфигурация языков");
  }

  return value as PortableBackupPackage;
}

export function createBackupImportPreview(backup: PortableBackupPackage): BackupImportPreview {
  return {
    schemaVersion: backup.schemaVersion,
    exportedAt: backup.exportedAt,
    projectTitle: backup.project.title,
    usersSkipped: backup.database.users.length,
    testimonials: backup.database.testimonials.length,
    collaborations: backup.database.collaborations.length,
    analytics: backup.database.analytics.length,
    staticLanguages: backup.staticContent.siteConfig.languages.length,
    includesSecrets: false,
    restoreMode: "merge-by-id",
  };
}

export function getBackupRecordIds(rows: unknown[]) {
  return rows.map((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) return 0;
    const id = (row as Record<string, unknown>).id;
    return typeof id === "number" && Number.isInteger(id) && id > 0 ? id : 0;
  });
}

export function buildBackupImportDiff(incomingIds: number[], existingIds: number[]): BackupImportDiffSection {
  const existing = new Set(existingIds);
  const validIds = incomingIds.filter((id) => id > 0);
  const update = validIds.filter((id) => existing.has(id)).length;
  return {
    incoming: incomingIds.length,
    insert: incomingIds.length - update,
    update,
    duplicate: update,
    invalid: incomingIds.filter((id) => id <= 0).length,
  };
}

export function toImportRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Строка backup должна быть JSON-объектом");
  }
  return value as Record<string, unknown>;
}

export function toOptionalPositiveInt(value: unknown): number | undefined {
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : undefined;
}

export function toNullableDateString(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || Number.isNaN(new Date(value).getTime())) {
    throw new Error("В backup обнаружена некорректная дата");
  }
  return value;
}
