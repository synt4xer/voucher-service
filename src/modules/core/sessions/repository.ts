import db from '../../../db';
import { DateTime } from 'luxon';
import { eq } from 'drizzle-orm';
import { NewSession, sessions } from '../../../db/schema/session';

export class SessionRepository {
  getSessionBySessionId = async (sessionId: string) =>
    db.select().from(sessions).where(eq(sessions.sessionId, sessionId));

  upsertSession = async (session: NewSession) => {
    const data = JSON.stringify(session);

    const newSession = {
      ...session,
      data,
    };
    if (!session?.sessionId) {
      return db.insert(sessions).values(newSession).returning({ sessionId: sessions.sessionId });
    }

    return db
      .update(sessions)
      .set({
        state: session.state,
        userId: session.userId,
        data,
        updatedAt: DateTime.now().toString(),
      })
      .where(eq(sessions.sessionId, session.sessionId))
      .returning({ sessionId: sessions.sessionId });
  };
}
