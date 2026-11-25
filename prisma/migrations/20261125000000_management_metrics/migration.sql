CREATE TABLE "CheckoutAttempt" (
    "attemptId" TEXT NOT NULL,
    "paymentId" TEXT,
    "merchantReference" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AOA',
    "status" TEXT NOT NULL DEFAULT 'CREATING',
    "errorCode" TEXT,
    "items" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CheckoutAttempt_pkey" PRIMARY KEY ("attemptId")
);

CREATE UNIQUE INDEX "CheckoutAttempt_paymentId_key" ON "CheckoutAttempt"("paymentId");
CREATE UNIQUE INDEX "CheckoutAttempt_merchantReference_key" ON "CheckoutAttempt"("merchantReference");
CREATE INDEX "CheckoutAttempt_status_createdAt_idx" ON "CheckoutAttempt"("status", "createdAt");

CREATE TABLE "ProductView" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER,
    "productName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductView_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProductView_productId_createdAt_idx" ON "ProductView"("productId", "createdAt");
CREATE INDEX "ProductView_createdAt_idx" ON "ProductView"("createdAt");
