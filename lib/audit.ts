import { db } from "@/lib/db";
export const audit = (actorId: string | undefined, action: string, entityType: string, entityId: string, metadata?: object) => db.auditEvent.create({ data: { actorId, action, entityType, entityId, metadata } });
