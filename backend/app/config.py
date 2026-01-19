from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    mongodb_url: str
    secret_key: str
    chef_username: str
    chef_password: str
    esp8266_ip: str
    port: int = 8000
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 360  # 6 hours (360 minutes)
    token_inactive_expire_minutes: int = 360  # Auto logout after 6 hours of inactivity

    model_config = SettingsConfigDict(env_file=".env")

@lru_cache()
def get_settings():
    return Settings()