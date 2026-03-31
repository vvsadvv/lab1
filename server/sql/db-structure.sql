-- PostgreSQL logical schema for Aroma Lane
-- Database: aroma_lane

CREATE TYPE enum_users_role AS ENUM ('admin', 'editor', 'pending');
CREATE TYPE enum_pages_page_type AS ENUM ('home', 'contacts', 'gallery', 'feedback', 'custom');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  "passwordHash" VARCHAR(255) NOT NULL,
  role enum_users_role NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  summary VARCHAR(255) NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  "pageType" enum_pages_page_type NOT NULL DEFAULT 'custom',
  "menuLabel" VARCHAR(255) NOT NULL DEFAULT '',
  "menuOrder" INTEGER NOT NULL DEFAULT 0,
  "showInMenu" BOOLEAN NOT NULL DEFAULT TRUE,
  "isPublished" BOOLEAN NOT NULL DEFAULT TRUE,
  "isSystem" BOOLEAN NOT NULL DEFAULT FALSE,
  "extraData" TEXT NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
