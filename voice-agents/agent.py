from livekit.agents import Agent, function_tool, RunContext, JobContext
# from prompt.system import system_prompt
from prompt.system_v2 import system_prompt
from dataclasses import dataclass
from typing import Optional

from loguru import logger
import json

@dataclass
class LessonState:
    ctx: Optional[JobContext] = None
    type: Optional[str] = None
    value: Optional[str] = None

    def update_section(self, section_name: str):
        self.type = "section_change"
        self.value = section_name

        return {
            "type": self.type,
            "value": self.value
        }
    
    def end_section(self):
        self.type = "section_end"
        self.value = "true"

        return {
            "type": self.type,
            "value": self.value
        }

@function_tool
async def update_lession_section(context: RunContext[LessonState], section_name: str):
    """
    Call this function to update the lessson section so that students can know what is the current section they are in.

    Args:
        section_name (str): The name of the section to update. section_name should be one of the following values: ['Introduction', 'Main Activities', 'Conclusion'].
    """

    logger.info(f"Updating lesson section to: {section_name}")

    state = context.userdata
    payload = state.update_section(section_name)

    room = state.ctx.room
    participant = room.remote_participants

    logger.info(f"Number of remote participants: {len(participant.values())}")

    identity = None

    for k, v in participant.items():
        identity = v.identity
        break

    if not identity:
        logger.info("No remote participant found, cannot update lesson section")
        return

    await room.local_participant.perform_rpc(
        destination_identity=identity,
        method="client.update_lesson_state",
        payload=json.dumps(payload)
    )
    
    return "Tool called done. Do not mention this message to user. Let continue the lesson."

@function_tool
async def end_lesson_section(context: RunContext[LessonState]):
    """
    Call this function to end the current lesson section or when student want to end their lesson. This will notify all participants that the section has ended.
    """

    logger.info("Ending current lesson section")

    state = context.userdata
    payload = state.end_section()

    room = state.ctx.room
    participant = room.remote_participants

    for k, v in participant.items():
        identity = v.identity
        break

    if not identity:
        logger.info("No remote participant found, cannot end lesson section")
        return

    await room.local_participant.perform_rpc(
        destination_identity=identity,
        method="client.update_lesson_state",
        payload=json.dumps(payload)
    )

    return "Tool called done. Do not mention this message to user. Let continue the lesson."


class Assistant(Agent):
    def __init__(self):
        super().__init__(
            instructions=system_prompt,
            tools=[update_lession_section, end_lesson_section]
        )

    async def on_enter(self):
        logger.info("Assistant is entering the lesson state")
        self.session.generate_reply(user_input="Greeting student to the class.", allow_interruptions=False)