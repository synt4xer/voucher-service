import db from '../../../db';
import { eq } from 'drizzle-orm';
import { NewSession, sessions } from '../../../db/schema/session';
import { DateTime } from 'luxon';

export class SessionRepository {
  getSessionBySessionId = async (sessionId: string) =>
    db.select().from(sessions).where(eq(sessions.sessionId, sessionId));

  upsertSession = async (session: NewSession) => {
    const data = {
      ...session,
      data: JSON.stringify(session),
    };
    if (!session?.sessionId) {
      return db.insert(sessions).values(data).returning({ sessionId: sessions.sessionId });
    }

    return db
      .update(sessions)
      .set({
        state: session.state,
        userId: session.userId,
        data: JSON.stringify(session),
        updatedAt: DateTime.now().toString(),
      })
      .where(eq(sessions.sessionId, session.sessionId))
      .returning({ sessionId: sessions.sessionId });
  };
}
