import db from '../../../db';
import { eq } from 'drizzle-orm';
import { NewSession, sessions } from '../../../db/schema/session';

export class SessionRepository {
  getSessionBySessionId = async (sessionId: string) =>
    db.select().from(sessions).where(eq(sessions.sessionId, sessionId));

  createSession = async (data: NewSession) =>
    db
      .insert(sessions)
      .values(data)
      .returning({
        sessionId: sessions.sessionId,
        userId: sessions.userId,
      })
      .returning({ sessionId: sessions.sessionId });
}
