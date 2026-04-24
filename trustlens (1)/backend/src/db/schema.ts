import { pgTable, uuid, varchar, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firebaseUid: varchar("firebase_uid").unique().notNull(),
  name: varchar("name"),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone"),
  avatarUrl: varchar("avatar_url"),
  language: varchar("language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const installedApps = pgTable("installed_apps", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  packageName: varchar("package_name").notNull(),
  appName: varchar("app_name").notNull(),
  category: varchar("category").notNull(),
  iconUrl: varchar("icon_url"),
  isActive: boolean("is_active").default(true),
  firstDetectedAt: timestamp("first_detected_at").defaultNow(),
  lastSeenAt: timestamp("last_seen_at").defaultNow()
});

export const trustScores = pgTable("trust_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  appId: uuid("app_id").references(() => installedApps.id).notNull(),
  userId: uuid("user_id").notNull(),
  overallScore: integer("overall_score").notNull(),
  dataCollectionScore: integer("data_collection_score"),
  permissionsScore: integer("permissions_score"),
  policyScore: integer("policy_score"),
  securityScore: integer("security_score"),
  complianceScore: integer("compliance_score"),
  sentimentScore: integer("sentiment_score"),
  aiConfidenceScore: integer("ai_confidence_score"),
  reputationScore: integer("reputation_score"),
  riskLevel: varchar("risk_level").notNull(),
  gapAnalysis: varchar("gap_analysis"),
  scannedAt: timestamp("scanned_at").defaultNow()
});

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  appId: uuid("app_id").references(() => installedApps.id).notNull(),
  permissionName: varchar("permission_name").notNull(),
  permissionGroup: varchar("permission_group"),
  isDangerous: boolean("is_dangerous").default(false),
  isMismatch: boolean("is_mismatch").default(false),
  explanation: text("explanation")
});

export const breaches = pgTable("breaches", {
  id: uuid("id").primaryKey().defaultRandom(),
  appName: varchar("app_name").notNull(),
  packageName: varchar("package_name"),
  breachYear: integer("breach_year").notNull(),
  severity: varchar("severity").notNull(),
  affectedUsers: varchar("affected_users"),
  summary: text("summary"),
  source: varchar("source"),
  verified: boolean("verified").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  appId: uuid("app_id"),
  type: varchar("type").notNull(),
  title: varchar("title").notNull(),
  body: text("body").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).unique().notNull(),
  pushNotifications: boolean("push_notifications").default(true),
  breachAlerts: boolean("breach_alerts").default(true),
  weeklyReport: boolean("weekly_report").default(true),
  installAlerts: boolean("install_alerts").default(true),
  fcmToken: varchar("fcm_token"),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const scanHistory = pgTable("scan_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  appId: uuid("app_id").notNull(),
  previousScore: integer("previous_score"),
  newScore: integer("new_score").notNull(),
  changeReason: text("change_reason"),
  scannedAt: timestamp("scanned_at").defaultNow()
});
