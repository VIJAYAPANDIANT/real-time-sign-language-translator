import asyncio
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.models.session import TranslationSession
from app.models.event import TranslationEvent
from app.core.security import get_password_hash

async def seed_db():
    async with AsyncSessionLocal() as session:
        # Check if demo user exists
        from sqlalchemy.future import select
        result = await session.execute(select(User).filter(User.email == "demo@example.com"))
        user = result.scalars().first()

        if not user:
            print("Creating demo user...")
            user = User(
                email="demo@example.com",
                display_name="Demo User",
                hashed_password=get_password_hash("password")
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
        else:
            print("Demo user already exists.")

        # Check for sessions
        result = await session.execute(select(TranslationSession).filter(TranslationSession.user_id == user.id))
        sessions = result.scalars().all()

        if not sessions:
            print("Creating sample translation sessions...")
            ts1 = TranslationSession(
                user_id=user.id,
                full_transcript="HELLO HOW ARE YOU",
                audio_played=True,
                device_info="Chrome on Windows"
            )
            session.add(ts1)
            await session.commit()
            await session.refresh(ts1)

            # Add some events for ts1
            events = [
                TranslationEvent(session_id=ts1.id, sequence_index=0, predicted_text="HELLO", gloss="HELLO", confidence=0.95),
                TranslationEvent(session_id=ts1.id, sequence_index=1, predicted_text="HOW", gloss="HOW", confidence=0.88),
                TranslationEvent(session_id=ts1.id, sequence_index=2, predicted_text="ARE", gloss="ARE", confidence=0.91),
                TranslationEvent(session_id=ts1.id, sequence_index=3, predicted_text="YOU", gloss="YOU", confidence=0.99),
            ]
            session.add_all(events)
            
            ts2 = TranslationSession(
                user_id=user.id,
                full_transcript="THANK YOU",
                audio_played=False,
                device_info="Safari on macOS"
            )
            session.add(ts2)
            await session.commit()
            await session.refresh(ts2)
            
            events2 = [
                TranslationEvent(session_id=ts2.id, sequence_index=0, predicted_text="THANK", gloss="THANK", confidence=0.92),
                TranslationEvent(session_id=ts2.id, sequence_index=1, predicted_text="YOU", gloss="YOU", confidence=0.97),
            ]
            session.add_all(events2)
            
            await session.commit()
            print("Sample data inserted successfully.")
        else:
            print("Sample data already exists.")

if __name__ == "__main__":
    asyncio.run(seed_db())
