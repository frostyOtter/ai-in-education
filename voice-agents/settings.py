from pydantic_settings import BaseSettings

class Settings(BaseSettings):

    GEMINI_API_KEY: str
    GOOGLE_CREDENTIALS_STR: str

    BITHUMAN_MODEL_PATH: str
    BITHUMAN_API_SECRET: str    

    LIVEKIT_API_KEY: str
    LIVEKIT_API_SECRET: str
    LIVEKIT_HOST: str 

    class Config:
        env_file = ".env"
        extra = "ignore"

def get_settings() -> Settings:
    return Settings()