import os
import json
from loguru import logger

from livekit import agents
from livekit.agents import (
    AgentSession,
    JobProcess,
    Worker,
    metrics,
    MetricsCollectedEvent,
)
from livekit.agents.voice import room_io
from livekit.agents.voice.agent_session import SessionConnectOptions, APIConnectOptions
from livekit.plugins.silero import VAD
from livekit.plugins import bithuman
from livekit import rtc
from bithuman import AsyncBithuman

from agent import Assistant
from models import init_llm, init_stt, init_tts
from settings import get_settings

from agent import LessonState

setting = get_settings()

async def entrypoint(ctx: agents.JobContext):
    await ctx.connect(auto_subscribe=agents.AutoSubscribe.AUDIO_ONLY)

    metadata = json.loads(ctx.job.metadata) if ctx.job.metadata else {}
    logger.info(f"Room metadata: {metadata}")

    lesson_state = LessonState(ctx=ctx)
    session = AgentSession[LessonState](
        userdata=lesson_state,
        turn_detection='manual',
        min_interruption_duration=0.8,
        min_endpointing_delay=1.2,
        max_endpointing_delay=3.0,
        stt=init_stt(),
        llm=init_llm(),
        tts=init_tts(),
        vad=VAD.load(activation_threshold=0.65),
        allow_interruptions=True,
        conn_options=SessionConnectOptions(
            tts_conn_options=APIConnectOptions(
                timeout=180.0
            )
        )
    )

    if True:
        try:
            runtime = AsyncBithuman(
                model_path=setting.BITHUMAN_MODEL_PATH, 
                api_secret=setting.BITHUMAN_API_SECRET, 
                load_model=True
            )
            bithuman_avatar = bithuman.AvatarSession(
                model_path=setting.BITHUMAN_MODEL_PATH,
                api_secret=setting.BITHUMAN_API_SECRET,
                runtime=runtime,
            )
            await bithuman_avatar.start(session, room=ctx.room)
        except Exception as e:
            logger.error(f"Failed to start Bithuman avatar: {e}")

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)

    # RoomInputOptions - enable video, sync transcription, noise cancellation as needed
    input_options = room_io.RoomInputOptions(
        video_enabled=False,
        audio_num_channels=1,
    )

    # RoomOutputOptions - configure as needed
    output_options = room_io.RoomOutputOptions(
        sync_transcription=True
    )

    await session.start(
        room=ctx.room,
        agent=Assistant(),
        room_input_options=input_options,
        room_output_options=output_options,
    )

    session.input.set_audio_enabled(False)

    @ctx.room.local_participant.register_rpc_method("start_turn")
    async def start_turn(data: rtc.RpcInvocationData):
        session.interrupt()
        session.clear_user_turn()

        # listen to the caller if multi-user
        session.input.set_audio_enabled(True)

    @ctx.room.local_participant.register_rpc_method("end_turn")
    async def end_turn(data: rtc.RpcInvocationData):
        session.input.set_audio_enabled(False)
        session.commit_user_turn(
            # the timeout for the final transcript to be received after committing the user turn
            # increase this value if the STT is slow to respond
            transcript_timeout=10.0,
        )

    @ctx.room.local_participant.register_rpc_method("cancel_turn")
    async def cancel_turn(data: rtc.RpcInvocationData):
        session.input.set_audio_enabled(False)
        session.clear_user_turn()
        logger.info("cancel turn")

def compute_load(worker: Worker) -> float:
    return min(len(worker.active_jobs) / 100, 1.0)

def run():
    agents.cli.run_app(agents.WorkerOptions(
        entrypoint_fnc=entrypoint, 
        load_fnc=compute_load,
        load_threshold=0.25,
        shutdown_process_timeout=1,
        api_key=setting.LIVEKIT_API_KEY,
        api_secret=setting.LIVEKIT_API_SECRET,
        ws_url=setting.LIVEKIT_HOST
    ))

if __name__ == "__main__":
    run()