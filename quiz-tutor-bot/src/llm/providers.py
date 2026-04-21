"""
LLM provider implementations for different AI services.
"""
import os
from abc import ABC, abstractmethod
from typing import Dict, Any
from openai import OpenAI
from anthropic import Anthropic


class LLMProvider(ABC):
    """Abstract base class for LLM providers"""

    @abstractmethod
    def generate_response(self, prompt: str, **kwargs) -> str:
        """Generate a response from the LLM"""
        pass


class OpenAIProvider(LLMProvider):
    """OpenAI API provider"""

    def __init__(self, api_key: str = None, model: str = "gpt-4o-mini"):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = model
        self.client = OpenAI(api_key=self.api_key)

    def generate_response(
        self,
        prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 1500,
        **kwargs
    ) -> str:
        """Generate response using OpenAI API"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert educational tutor for non-profit organizations. "
                                 "You evaluate student answers with depth, provide constructive feedback, "
                                 "and help learners understand non-profit concepts thoroughly."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")


class AnthropicProvider(LLMProvider):
    """Anthropic (Claude) API provider"""

    def __init__(self, api_key: str = None, model: str = "claude-3-5-sonnet-20241022"):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.model = model
        self.client = Anthropic(api_key=self.api_key)

    def generate_response(
        self,
        prompt: str,
        temperature: float = 0.7,
        max_tokens: int = 1500,
        **kwargs
    ) -> str:
        """Generate response using Anthropic API"""
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                system="You are an expert educational tutor for non-profit organizations. "
                       "You evaluate student answers with depth, provide constructive feedback, "
                       "and help learners understand non-profit concepts thoroughly.",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            return response.content[0].text
        except Exception as e:
            raise Exception(f"Anthropic API error: {str(e)}")
