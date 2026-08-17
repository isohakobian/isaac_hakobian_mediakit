export const BACKUP_SCHEMA_VERSION = "1.0.0";
export const BACKUP_PACKAGE_TYPE = "isaac-hakobian-media-kit-portable-backup";

export type BackupDatabaseSnapshot = {
  users: unknown[];
  testimonials: unknown[];
  collaborations: unknown[];
  analytics: unknown[];
};

export type BackupStaticContent = {
  translations: Record<string, unknown>;
  socialLinks: Record<string, string>;
  siteConfig: {
    languages: string[];
    defaultLanguage: string;
    designSystem: string;
    analyticsEvents: string[];
    adminFeatures: string[];
  };
  visualAssets: {
    heroImageUrl: string;
    sourceFiles: string[];
  };
  instagramAudience: Record<string, unknown>;
};

export type PortableBackupPackage = {
  schemaVersion: string;
  packageType: string;
  exportedAt: string;
  project: {
    name: string;
    title: string;
    routes: string[];
    stack: string[];
    sourceRepository: string;
  };
  staticContent: BackupStaticContent;
  database: BackupDatabaseSnapshot;
  migration: {
    purpose: string;
    activationPrompt: string;
    restoreOrder: string[];
    excludedSecrets: string[];
    redactedFields: string[];
    importantNote: string;
  };
};

export function createPortableBackupPackage({
  database,
  staticContent,
  exportedAt = new Date().toISOString(),
}: {
  database: BackupDatabaseSnapshot;
  staticContent: BackupStaticContent;
  exportedAt?: string;
}): PortableBackupPackage {
  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    packageType: BACKUP_PACKAGE_TYPE,
    exportedAt,
    project: {
      name: "isaac_hakobian_mediakit",
      title: "Isaac Hakobian - Quiet Luxury Media Kit",
      routes: ["/", "/analytics", "/collaborations", "/backup"],
      stack: ["React 19", "TypeScript", "Tailwind CSS 4", "tRPC", "Drizzle ORM", "MySQL", "Manus OAuth"],
      sourceRepository: "https://github.com/isohakobian/isaac_hakobian_mediakit",
    },
    staticContent,
    database,
    migration: {
      purpose: "Portable content and database handoff for restoring this media kit in another AI or development environment.",
      activationPrompt: "Import this JSON as the source of truth. Recreate the public site, preserve all five languages, restore collaborations/testimonials/analytics, keep newest-first collaboration ordering, and ask for fresh deployment credentials instead of inventing secrets.",
      restoreOrder: [
        "Clone or upload the source repository.",
        "Read this JSON backup and restore staticContent first.",
        "Restore database tables in dependency order: users, testimonials, collaborations, analytics.",
        "Configure fresh OAuth, database, storage, and deployment credentials.",
        "Run tests, build, and verify /, /analytics, /collaborations, and /backup.",
      ],
      excludedSecrets: [
        "DATABASE_URL",
        "JWT_SECRET",
        "OAuth session cookies and openId identifiers",
        "Manus Forge/API tokens",
        "third-party connector credentials",
        "storage signing credentials",
      ],
      redactedFields: ["users.openId", "analytics.ipHash", "analytics.sessionId"],
      importantNote: "This package is a portable application-data backup, not a credential export. The source repository and fresh environment secrets are still required to activate the site elsewhere.",
    },
  };
}
