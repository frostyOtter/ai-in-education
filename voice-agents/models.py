from livekit.plugins.google.tts import TTS
from livekit.plugins.google.stt import STT
from livekit.plugins.google.llm import LLM

import os
import json
import base64
from settings import get_settings

setting = get_settings()

GOOGLE_CREDENTIALS_STR = setting.GOOGLE_CREDENTIALS_STR
cred = dict(json.loads(base64.b64decode(GOOGLE_CREDENTIALS_STR).decode('utf-8')))

def init_stt():
    return STT(
        languages="en-US",
        detect_language=False,
        punctuate=True,
        spoken_punctuation=True,
        use_streaming=True,
        credentials_info=cred
    )

def init_tts():
    return TTS(
        language="en-US",
        voice_name="en-US-Chirp-HD-F",
        credentials_info=cred
    )

def init_llm():
    return LLM(
        model="gemini-2.0-flash",
        api_key=setting.GEMINI_API_KEY
    )