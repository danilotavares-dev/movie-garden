-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_messages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ratings_mediaId_mediaType_idx" ON "ratings"("mediaId", "mediaType");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_userId_mediaId_mediaType_key" ON "ratings"("userId", "mediaId", "mediaType");

-- CreateIndex
CREATE INDEX "media_messages_mediaId_mediaType_createdAt_idx" ON "media_messages"("mediaId", "mediaType", "createdAt");

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_messages" ADD CONSTRAINT "media_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
