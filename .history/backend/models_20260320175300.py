from sqlalchemy import Column, Integer, JSON
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    resume_skills = Column(JSON)
    jd_skills = Column(JSON)
    missing_skills = Column(JSON)
    learning_path = Column(JSON)