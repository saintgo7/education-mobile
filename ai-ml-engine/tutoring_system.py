import json
import numpy as np
from typing import List, Dict, Any, Tuple
from datetime import datetime
from enum import Enum
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DifficultyLevel(Enum):
    BEGINNER = 1
    INTERMEDIATE = 2
    ADVANCED = 3
    EXPERT = 4

class TutoringSystem:
    """
    AI-powered personalized tutoring system with adaptive learning paths
    """

    def __init__(self):
        self.user_profiles: Dict[str, Dict] = {}
        self.learning_sessions: Dict[str, List] = {}
        self.knowledge_graph: Dict[str, List[str]] = {}
        self.problem_bank: Dict[str, List[Dict]] = {}
        self.misconceptions: Dict[str, List[str]] = {}
        self.learning_strategies: Dict[str, str] = {}

    def initialize_user(self, user_id: str, initial_knowledge: Dict[str, float]) -> None:
        """Initialize user profile with knowledge assessment"""
        self.user_profiles[user_id] = {
            'id': user_id,
            'knowledge': initial_knowledge,  # skill -> proficiency level
            'learning_style': self._detect_learning_style(user_id),
            'learning_pace': 'normal',
            'motivation_level': 0.7,
            'session_count': 0,
            'total_study_time': 0,
            'topics_mastered': [],
            'weak_areas': [],
            'learning_history': [],
            'adaptive_parameters': {
                'difficulty_multiplier': 1.0,
                'hint_preference': 'moderate',
                'explanation_depth': 'standard'
            }
        }
        self.learning_sessions[user_id] = []
        logger.info(f"User {user_id} initialized with learning style: {self.user_profiles[user_id]['learning_style']}")

    def _detect_learning_style(self, user_id: str) -> str:
        """Detect user's learning style (Visual, Auditory, Kinesthetic, Reading/Writing)"""
        styles = ['visual', 'auditory', 'kinesthetic', 'reading_writing']
        # In a real system, this would be based on user interaction patterns
        return np.random.choice(styles)

    def adaptive_problem_selection(
        self,
        user_id: str,
        topic: str,
        difficulty: DifficultyLevel = None
    ) -> Dict[str, Any]:
        """
        Adaptively select next problem based on user performance
        """
        profile = self.user_profiles[user_id]

        if difficulty is None:
            # Determine difficulty based on user's current knowledge
            current_knowledge = profile['knowledge'].get(topic, 0.0)

            if current_knowledge < 0.3:
                difficulty = DifficultyLevel.BEGINNER
            elif current_knowledge < 0.6:
                difficulty = DifficultyLevel.INTERMEDIATE
            elif current_knowledge < 0.85:
                difficulty = DifficultyLevel.ADVANCED
            else:
                difficulty = DifficultyLevel.EXPERT

        # Get problem from bank
        problems = self.problem_bank.get(topic, [])
        if not problems:
            return self._generate_problem(topic, difficulty)

        # Filter by difficulty
        suitable_problems = [
            p for p in problems
            if p.get('difficulty', 1) == difficulty.value
        ]

        if not suitable_problems:
            suitable_problems = problems

        # Select problem with optimal spacing (spaced repetition)
        selected_problem = self._select_by_spaced_repetition(user_id, suitable_problems)

        # Customize problem based on learning style
        customized_problem = self._customize_for_learning_style(
            selected_problem,
            profile['learning_style']
        )

        return {
            'problem_id': customized_problem.get('id'),
            'topic': topic,
            'difficulty': difficulty.name,
            'question': customized_problem.get('question'),
            'context': customized_problem.get('context'),
            'hints': customized_problem.get('hints', []),
            'learning_objectives': customized_problem.get('objectives', [])
        }

    def evaluate_solution(
        self,
        user_id: str,
        problem_id: str,
        solution: str,
        topic: str
    ) -> Dict[str, Any]:
        """
        Evaluate user's solution and provide intelligent feedback
        """
        profile = self.user_profiles[user_id]

        # Check correctness
        is_correct = self._check_solution_correctness(problem_id, solution)

        # Analyze misconceptions
        misconceptions = []
        if not is_correct:
            misconceptions = self._detect_misconceptions(problem_id, solution, topic)

        # Generate adaptive feedback
        feedback = self._generate_adaptive_feedback(
            is_correct,
            misconceptions,
            profile['learning_style']
        )

        # Update user knowledge
        confidence_boost = 0.1 if is_correct else -0.05
        profile['knowledge'][topic] = min(1.0, max(0.0,
            profile['knowledge'].get(topic, 0.0) + confidence_boost
        ))

        # Update learning history
        learning_record = {
            'problem_id': problem_id,
            'topic': topic,
            'timestamp': datetime.now().isoformat(),
            'correct': is_correct,
            'misconceptions': misconceptions,
            'time_taken': 0
        }
        profile['learning_history'].append(learning_record)

        # Determine next action
        next_action = self._determine_next_action(
            user_id,
            topic,
            is_correct,
            misconceptions
        )

        return {
            'correct': is_correct,
            'feedback': feedback,
            'misconceptions': misconceptions,
            'knowledge_update': profile['knowledge'].get(topic, 0.0),
            'next_action': next_action,
            'motivation_boost': 10 if is_correct else 5
        }

    def _check_solution_correctness(self, problem_id: str, solution: str) -> bool:
        """Check if solution is correct (semantic matching)"""
        # In real system, would use NLP/ML model
        return len(solution) > 0 and 'correct' not in solution.lower()

    def _detect_misconceptions(self, problem_id: str, solution: str, topic: str) -> List[str]:
        """Detect specific misconceptions in user's solution"""
        detected = []

        # Common misconceptions database
        common_misconceptions = {
            'algebra': [
                'distribution_error',
                'negative_number_handling',
                'variable_isolation_error'
            ],
            'calculus': [
                'chain_rule_misunderstanding',
                'integration_constant_omission',
                'limit_definition_confusion'
            ],
            'programming': [
                'off_by_one_error',
                'null_pointer_exception',
                'loop_iteration_error'
            ]
        }

        # Check for known misconceptions
        for misconception in common_misconceptions.get(topic, []):
            if self._check_misconception_pattern(solution, misconception):
                detected.append(misconception)

        return detected

    def _check_misconception_pattern(self, solution: str, misconception: str) -> bool:
        """Check if solution exhibits a specific misconception pattern"""
        patterns = {
            'distribution_error': '+(-)' in solution or '-(+)' in solution,
            'negative_number_handling': 'negative' in solution.lower(),
            'chain_rule_misunderstanding': 'chain' in solution.lower()
        }
        return patterns.get(misconception, False)

    def _generate_adaptive_feedback(
        self,
        is_correct: bool,
        misconceptions: List[str],
        learning_style: str
    ) -> str:
        """Generate personalized feedback based on learning style"""
        if is_correct:
            return "Excellent! You've mastered this concept. Let's move to the next challenge."

        feedback = "Not quite. Let me help you understand this better:\n\n"

        if misconceptions:
            feedback += "I noticed:\n"
            for misconception in misconceptions:
                explanation = self._explain_misconception(misconception, learning_style)
                feedback += f"• {explanation}\n"

        if learning_style == 'visual':
            feedback += "\n[Visual aid would be displayed here]"
        elif learning_style == 'auditory':
            feedback += "\n[Audio explanation would play here]"
        elif learning_style == 'kinesthetic':
            feedback += "\n[Interactive simulation would load here]"

        return feedback

    def _explain_misconception(self, misconception: str, learning_style: str) -> str:
        """Explain a specific misconception"""
        explanations = {
            'distribution_error': 'When distributing, multiply each term inside parentheses',
            'chain_rule_misunderstanding': 'Chain rule: d/dx[f(g(x))] = f\'(g(x)) · g\'(x)',
            'off_by_one_error': 'Check your loop bounds carefully. Arrays are 0-indexed'
        }
        return explanations.get(misconception, 'Review the concept definition')

    def _determine_next_action(
        self,
        user_id: str,
        topic: str,
        is_correct: bool,
        misconceptions: List[str]
    ) -> Dict[str, Any]:
        """Determine optimal next learning action"""
        profile = self.user_profiles[user_id]

        if is_correct:
            knowledge_level = profile['knowledge'].get(topic, 0.0)

            if knowledge_level >= 0.9:
                return {
                    'action': 'advance',
                    'recommendation': 'You are ready for advanced concepts!',
                    'next_topic': self._get_next_topic(topic)
                }
            else:
                return {
                    'action': 'practice_more',
                    'recommendation': 'Practice similar problems to solidify knowledge',
                    'difficulty': 'similar'
                }
        else:
            if misconceptions:
                return {
                    'action': 'remedial_teaching',
                    'recommendation': 'Let me re-teach this concept with different approach',
                    'materials': self._get_remedial_materials(topic, misconceptions)
                }
            else:
                return {
                    'action': 'hint_and_retry',
                    'recommendation': 'Try again with a hint',
                    'hint_level': 'moderate'
                }

    def _get_next_topic(self, current_topic: str) -> str:
        """Get the next topic in learning sequence"""
        # Use knowledge graph for topic sequencing
        if current_topic in self.knowledge_graph:
            return self.knowledge_graph[current_topic][0]
        return 'review'

    def _get_remedial_materials(self, topic: str, misconceptions: List[str]) -> List[str]:
        """Get remedial learning materials"""
        return [
            f'video: {topic}_fundamentals',
            f'interactive: {topic}_drill',
            'quiz: {topic}_check_understanding'
        ]

    def _select_by_spaced_repetition(
        self,
        user_id: str,
        problems: List[Dict]
    ) -> Dict:
        """Select problem using spaced repetition algorithm"""
        # Implement Leitner system
        learning_history = self.user_profiles[user_id].get('learning_history', [])

        # Prioritize problems not seen recently
        problem_ids_seen = [h.get('problem_id') for h in learning_history[-10:]]
        unseen_problems = [p for p in problems if p.get('id') not in problem_ids_seen]

        return unseen_problems[0] if unseen_problems else problems[0]

    def _customize_for_learning_style(
        self,
        problem: Dict,
        learning_style: str
    ) -> Dict:
        """Customize problem presentation for learning style"""
        customized = problem.copy()

        if learning_style == 'visual':
            customized['presentation'] = 'diagram'
            customized['visuals'] = True
        elif learning_style == 'auditory':
            customized['presentation'] = 'verbal_description'
            customized['audio'] = True
        elif learning_style == 'kinesthetic':
            customized['presentation'] = 'interactive'
            customized['interactive'] = True
        elif learning_style == 'reading_writing':
            customized['presentation'] = 'text'
            customized['detailed_text'] = True

        return customized

    def _generate_problem(self, topic: str, difficulty: DifficultyLevel) -> Dict:
        """Generate a new problem dynamically"""
        return {
            'id': f'generated_{topic}_{difficulty.value}_{datetime.now().timestamp()}',
            'topic': topic,
            'difficulty': difficulty.value,
            'question': f'Solve a {difficulty.name.lower()} problem in {topic}',
            'context': 'Problem context here',
            'hints': ['Hint 1', 'Hint 2', 'Hint 3'],
            'objectives': [f'Understand {topic}', 'Apply concepts']
        }

    def create_personalized_learning_plan(
        self,
        user_id: str,
        goal: str,
        duration_weeks: int
    ) -> Dict[str, Any]:
        """Create adaptive learning plan based on user goals"""
        profile = self.user_profiles[user_id]
        weak_areas = [k for k, v in profile['knowledge'].items() if v < 0.5]

        plan = {
            'user_id': user_id,
            'goal': goal,
            'duration_weeks': duration_weeks,
            'created_at': datetime.now().isoformat(),
            'weekly_schedule': [],
            'estimated_completion_date': None,
            'learning_objectives': [],
            'recommended_resources': []
        }

        # Create weekly schedule
        topics_to_learn = 8  # Number of topics
        weeks_per_topic = duration_weeks / topics_to_learn

        for week in range(1, duration_weeks + 1):
            plan['weekly_schedule'].append({
                'week': week,
                'topics': [f'Topic {(week // weeks_per_topic) % topics_to_learn}'],
                'target_hours': 10,
                'assessment_type': 'quiz' if week % 4 == 0 else 'problems'
            })

        # Add weak area emphasis
        for weak_area in weak_areas[:2]:
            plan['learning_objectives'].append(f'Master {weak_area}')

        return plan

    def generate_progress_report(self, user_id: str) -> Dict[str, Any]:
        """Generate comprehensive learning progress report"""
        profile = self.user_profiles[user_id]
        history = profile.get('learning_history', [])

        correct_count = sum(1 for h in history if h.get('correct', False))
        total_count = len(history)
        accuracy = (correct_count / total_count * 100) if total_count > 0 else 0

        return {
            'user_id': user_id,
            'generated_at': datetime.now().isoformat(),
            'overall_progress': accuracy / 100,
            'accuracy': f'{accuracy:.1f}%',
            'problems_solved': total_count,
            'topics_learning': list(profile['knowledge'].keys()),
            'knowledge_by_topic': profile['knowledge'],
            'learning_velocity': len(history) / max(profile['session_count'], 1),
            'estimated_mastery_time': self._estimate_mastery_time(user_id),
            'recommendations': self._generate_recommendations(profile),
            'next_milestone': self._get_next_milestone(profile)
        }

    def _estimate_mastery_time(self, user_id: str) -> str:
        """Estimate time to mastery for weak areas"""
        profile = self.user_profiles[user_id]
        weak_areas = [k for k, v in profile['knowledge'].items() if v < 0.7]

        if not weak_areas:
            return "Ready for certification"

        hours_needed = len(weak_areas) * 20
        return f'~{hours_needed} hours'

    def _generate_recommendations(self, profile: Dict) -> List[str]:
        """Generate personalized learning recommendations"""
        recommendations = []

        motivation = profile.get('motivation_level', 0.5)
        if motivation < 0.5:
            recommendations.append('Consider taking a break and returning refreshed')

        weak_areas = [k for k, v in profile['knowledge'].items() if v < 0.5]
        if weak_areas:
            recommendations.append(f'Focus on strengthening: {", ".join(weak_areas[:2])}')

        if profile.get('session_count', 0) < 5:
            recommendations.append('Build consistency: aim for daily practice sessions')

        return recommendations

    def _get_next_milestone(self, profile: Dict) -> str:
        """Get next learning milestone"""
        avg_knowledge = np.mean(list(profile['knowledge'].values()))

        if avg_knowledge < 0.3:
            return 'Complete fundamentals'
        elif avg_knowledge < 0.6:
            return 'Reach intermediate level'
        elif avg_knowledge < 0.85:
            return 'Advanced proficiency'
        else:
            return 'Expert certification'
