"""
LLM-based answer evaluator with deep contextual analysis.
"""
import json
import os
from typing import Dict, Any, List
from ..models.schemas import Question, EvaluationResult
from .providers import OpenAIProvider, AnthropicProvider, LLMProvider


class LLMEvaluator:
    """
    AI-powered answer evaluator that provides:
    - Accurate scoring
    - Detailed explanations
    - Identification of knowledge gaps
    - Personalized learning recommendations
    """

    def __init__(self, provider: str = "openai"):
        """Initialize the evaluator with specified LLM provider"""
        self.provider_name = provider

        if provider == "openai":
            self.llm: LLMProvider = OpenAIProvider()
        elif provider == "anthropic":
            self.llm: LLMProvider = AnthropicProvider()
        else:
            raise ValueError(f"Unsupported provider: {provider}")

    def evaluate_answer(
        self,
        question: Question,
        user_answer: str,
        context: str = ""
    ) -> EvaluationResult:
        """
        Evaluate a user's answer using LLM.

        Args:
            question: The question object
            user_answer: User's submitted answer
            context: Additional context from donor emails

        Returns:
            EvaluationResult with detailed feedback
        """
        # Build the evaluation prompt
        prompt = self._build_evaluation_prompt(question, user_answer, context)

        # Get LLM response
        llm_response = self.llm.generate_response(prompt, temperature=0.3)

        # Parse the structured response
        evaluation_data = self._parse_llm_response(llm_response)

        # Create evaluation result
        result = EvaluationResult(
            question_id=question.id or "",
            user_answer=user_answer,
            is_correct=evaluation_data.get("is_correct", False),
            score=evaluation_data.get("score", 0.0),
            max_score=float(question.points),
            feedback=evaluation_data.get("feedback", ""),
            detailed_explanation=evaluation_data.get("detailed_explanation", ""),
            key_concepts_missed=evaluation_data.get("key_concepts_missed", []),
            strengths=evaluation_data.get("strengths", []),
            improvement_areas=evaluation_data.get("improvement_areas", [])
        )

        return result

    def _build_evaluation_prompt(
        self,
        question: Question,
        user_answer: str,
        context: str
    ) -> str:
        """Build a comprehensive evaluation prompt for the LLM"""

        prompt = f"""
You are evaluating a student's answer in a non-profit education quiz. Provide a thorough, educational evaluation.

**Question:**
{question.text}

**Question Type:** {question.question_type}
**Difficulty:** {question.difficulty}
**Topic:** {question.topic}
**Maximum Points:** {question.points}

"""
        if question.options:
            prompt += f"**Options:**\n"
            for i, option in enumerate(question.options, 1):
                prompt += f"{i}. {option}\n"
            prompt += "\n"

        if context:
            prompt += f"""**Context from Donor Communication:**
{context}

"""

        prompt += f"""**Student's Answer:**
{user_answer}

**Reference Answer (for your evaluation only):**
{question.correct_answer or "Not provided"}

---

Please evaluate this answer and provide a response in the following JSON format:

{{
    "is_correct": true/false,
    "score": <number between 0 and {question.points}>,
    "feedback": "<brief summary feedback>",
    "detailed_explanation": "<comprehensive explanation of the correct answer and why the student's answer was right/wrong>",
    "key_concepts_missed": ["<concept1>", "<concept2>"],
    "strengths": ["<strength1>", "<strength2>"],
    "improvement_areas": ["<area1>", "<area2>"]
}}

**Evaluation Criteria:**
1. **Accuracy**: Is the answer factually correct?
2. **Completeness**: Does it cover all key points?
3. **Understanding**: Does the student demonstrate deep comprehension?
4. **Context**: Is the answer relevant to non-profit sector scenarios?

**Important:**
- For partially correct answers, give proportional credit
- Identify specific concepts the student missed
- Highlight what the student did well (strengths)
- Provide actionable improvement suggestions
- Use clear, encouraging language
- Make explanations educational, not just corrective

Provide ONLY the JSON response, no additional text.
"""
        return prompt

    def _parse_llm_response(self, response: str) -> Dict[str, Any]:
        """Parse the LLM's JSON response"""
        try:
            # Try to extract JSON from the response
            response = response.strip()

            # Handle markdown code blocks
            if response.startswith("```json"):
                response = response[7:]
            if response.startswith("```"):
                response = response[3:]
            if response.endswith("```"):
                response = response[:-3]

            response = response.strip()

            # Parse JSON
            data = json.loads(response)

            # Validate required fields
            required_fields = ["is_correct", "score", "feedback", "detailed_explanation"]
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Missing required field: {field}")

            # Ensure lists exist
            if "key_concepts_missed" not in data:
                data["key_concepts_missed"] = []
            if "strengths" not in data:
                data["strengths"] = []
            if "improvement_areas" not in data:
                data["improvement_areas"] = []

            return data

        except json.JSONDecodeError as e:
            # Fallback response if parsing fails
            return {
                "is_correct": False,
                "score": 0.0,
                "feedback": "Error evaluating answer. Please try again.",
                "detailed_explanation": f"System error: Unable to parse evaluation. {str(e)}",
                "key_concepts_missed": [],
                "strengths": [],
                "improvement_areas": []
            }

    def identify_weak_areas(
        self,
        evaluations: List[EvaluationResult]
    ) -> Dict[str, Any]:
        """
        Analyze multiple evaluations to identify patterns and weak areas.

        Args:
            evaluations: List of evaluation results

        Returns:
            Dictionary with analysis of weak areas and recommendations
        """
        if not evaluations:
            return {
                "weak_topics": [],
                "missed_concepts": [],
                "recommendations": []
            }

        # Collect all missed concepts
        all_missed_concepts = []
        all_improvement_areas = []

        for eval_result in evaluations:
            all_missed_concepts.extend(eval_result.key_concepts_missed)
            all_improvement_areas.extend(eval_result.improvement_areas)

        # Count frequency
        from collections import Counter
        concept_frequency = Counter(all_missed_concepts)
        improvement_frequency = Counter(all_improvement_areas)

        # Identify most common weaknesses
        weak_concepts = [
            concept for concept, count in concept_frequency.most_common(5)
        ]

        weak_areas = [
            area for area, count in improvement_frequency.most_common(5)
        ]

        # Generate recommendations using LLM
        recommendations = self._generate_recommendations(
            weak_concepts,
            weak_areas,
            evaluations
        )

        return {
            "weak_topics": weak_areas,
            "missed_concepts": weak_concepts,
            "recommendations": recommendations,
            "average_score": sum(e.score for e in evaluations) / len(evaluations)
        }

    def _generate_recommendations(
        self,
        weak_concepts: List[str],
        weak_areas: List[str],
        evaluations: List[EvaluationResult]
    ) -> List[str]:
        """Generate personalized study recommendations"""

        if not weak_concepts and not weak_areas:
            return [
                "Great job! Continue practicing to maintain your performance.",
                "Try more challenging questions to deepen your understanding.",
                "Review recent non-profit sector trends and case studies."
            ]

        prompt = f"""
Based on a student's quiz performance in non-profit education, generate 5 specific, actionable study recommendations.

**Weak Concepts Identified:**
{', '.join(weak_concepts) if weak_concepts else 'None'}

**Areas for Improvement:**
{', '.join(weak_areas) if weak_areas else 'None'}

**Performance Summary:**
- Total questions evaluated: {len(evaluations)}
- Average score: {sum(e.score for e in evaluations) / len(evaluations):.1f}%

Generate exactly 5 specific, actionable recommendations as a JSON array:
["recommendation 1", "recommendation 2", "recommendation 3", "recommendation 4", "recommendation 5"]

Make recommendations:
1. Specific to non-profit sector education
2. Actionable with clear next steps
3. Encouraging and constructive
4. Varied (study techniques, resources, practice areas)
5. Tailored to identified weaknesses

Provide ONLY the JSON array, no additional text.
"""

        try:
            response = self.llm.generate_response(prompt, temperature=0.7)
            response = response.strip()

            # Handle markdown code blocks
            if response.startswith("```json"):
                response = response[7:]
            if response.startswith("```"):
                response = response[3:]
            if response.endswith("```"):
                response = response[:-3]

            recommendations = json.loads(response.strip())

            if isinstance(recommendations, list):
                return recommendations[:5]
            else:
                return []

        except Exception:
            # Fallback recommendations
            return [
                f"Review the concepts: {', '.join(weak_concepts[:3])}" if weak_concepts else "Continue practicing core concepts",
                "Study real non-profit case studies to understand practical applications",
                "Practice explaining concepts in your own words",
                "Create summary notes for topics you found challenging",
                "Revisit donor communication examples to strengthen contextual understanding"
            ]
