from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 🔹 CHANGE THESE VALUES
DB_USER = "postgres"
DB_PASSWORD = "password"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "onboarding_ai"

DATABASE_URL = "postgresql://postgres:your_password_here@localhost:5432/adaptive_onboarding_ai"

# 🔹 Create engine
engine = create_engine(DATABASE_URL)

# 🔹 Session (used in API)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)