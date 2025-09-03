/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.NEXT_PUBLIC_DRIZZLE_DB_URL || 'postgresql://neondb_owner:npg_OWRVPmoHt47e@ep-sparkling-unit-a57ox2pj-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
    },
    out: "./components/drizzle",
    verbose: true,
    strict: true,
};