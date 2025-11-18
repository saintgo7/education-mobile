import json
import numpy as np
from typing import List, Dict, Any
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RecommendationEngine:
    """
    AI-powered learning path recommendation engine using collaborative filtering
    and content-based recommendation algorithms
    """

    def __init__(self):
        self.user_profiles: Dict[str, Dict] = {}
        self.course_data: Dict[str, Dict] = {}
        self.user_course_ratings: Dict[str, Dict] = {}  # userId -> {courseId: rating}
        self.learning_patterns: Dict[str, List] = {}  # userId -> learning history
        self.course_difficulty_map: Dict[str, float] = {}

    def register_user(self, user_id: str, user_data: Dict) -> None:
        """Register a new user in the system"""
        self.user_profiles[user_id] = {
            **user_data,
            'learning_style': 'unknown',
            'skill_level': 'beginner',
            'preferences': [],
            'created_at': datetime.now().isoformat()
        }
        self.user_course_ratings[user_id] = {}
        self.learning_patterns[user_id] = []
        logger.info(f"User {user_id} registered")

    def add_course(self, course_id: str, course_data: Dict) -> None:
        """Add course to the system"""
        self.course_data[course_id] = course_data
        self.course_difficulty_map[course_id] = self._calculate_difficulty(
            course_data
        )
        logger.info(f"Course {course_id} added")

    def _calculate_difficulty(self, course_data: Dict) -> float:
        """Calculate course difficulty score (0-1)"""
        difficulty_factors = {
            'beginner': 0.2,
            'intermediate': 0.6,
            'advanced': 0.9
        }
        level = course_data.get('level', 'beginner')
        return difficulty_factors.get(level, 0.5)

    def record_interaction(
        self,
        user_id: str,
        course_id: str,
        interaction_type: str,
        duration: int = 0
    ) -> None:
        """Record user interaction with a course"""
        if user_id not in self.learning_patterns:
            self.learning_patterns[user_id] = []

        self.learning_patterns[user_id].append({
            'course_id': course_id,
            'type': interaction_type,
            'duration': duration,
            'timestamp': datetime.now().isoformat()
        })
        logger.info(
            f"Interaction recorded: user={user_id}, course={course_id}, type={interaction_type}"
        )

    def rate_course(self, user_id: str, course_id: str, rating: float) -> None:
        """Record course rating from user"""
        if user_id not in self.user_course_ratings:
            self.user_course_ratings[user_id] = {}

        self.user_course_ratings[user_id][course_id] = rating
        logger.info(f"Course {course_id} rated {rating}/5 by user {user_id}")

    def collaborative_filtering(
        self,
        user_id: str,
        top_n: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Collaborative filtering: find similar users and recommend their favorite courses
        """
        if user_id not in self.user_course_ratings:
            return []

        user_ratings = self.user_course_ratings[user_id]
        similar_users = self._find_similar_users(user_id)

        recommendations = {}
        for similar_user in similar_users:
            for course_id, rating in self.user_course_ratings.get(similar_user, {}).items():
                if course_id not in user_ratings:
                    if course_id not in recommendations:
                        recommendations[course_id] = []
                    recommendations[course_id].append(rating)

        # Calculate average score for each recommended course
        scored_recommendations = [
            {
                'course_id': course_id,
                'score': np.mean(ratings),
                'course_data': self.course_data.get(course_id, {})
            }
            for course_id, ratings in recommendations.items()
        ]

        return sorted(scored_recommendations, key=lambda x: x['score'], reverse=True)[
            :top_n
        ]

    def _find_similar_users(self, user_id: str, similarity_threshold: float = 0.5) -> List[str]:
        """Find users with similar learning preferences"""
        if user_id not in self.user_course_ratings:
            return []

        user_ratings = self.user_course_ratings[user_id]
        similar_users = []

        for other_user_id, other_ratings in self.user_course_ratings.items():
            if other_user_id == user_id:
                continue

            # Find common rated courses
            common_courses = set(user_ratings.keys()) & set(other_ratings.keys())
            if len(common_courses) < 2:
                continue

            # Calculate Pearson correlation
            user_vector = [user_ratings[c] for c in common_courses]
            other_vector = [other_ratings[c] for c in common_courses]

            if len(user_vector) > 0:
                correlation = np.corrcoef(user_vector, other_vector)[0, 1]
                if not np.isnan(correlation) and correlation >= similarity_threshold:
                    similar_users.append(other_user_id)

        return similar_users

    def content_based_recommendation(
        self,
        user_id: str,
        top_n: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Content-based recommendation: recommend courses similar to liked courses
        """
        if user_id not in self.user_course_ratings:
            return self._get_popular_courses(top_n)

        user_ratings = self.user_course_ratings[user_id]
        liked_courses = [
            course_id
            for course_id, rating in user_ratings.items()
            if rating >= 4.0
        ]

        if not liked_courses:
            return self._get_popular_courses(top_n)

        # Extract features from liked courses
        liked_features = self._extract_features(liked_courses)

        # Find similar courses
        recommendations = {}
        for course_id, course_data in self.course_data.items():
            if course_id in user_ratings:
                continue

            course_features = self._extract_features([course_id])[course_id]
            similarity = self._calculate_feature_similarity(
                liked_features, course_features
            )

            if similarity > 0:
                recommendations[course_id] = {
                    'score': similarity,
                    'course_data': course_data
                }

        return sorted(
            [
                {
                    'course_id': course_id,
                    **rec
                }
                for course_id, rec in recommendations.items()
            ],
            key=lambda x: x['score'],
            reverse=True
        )[:top_n]

    def _extract_features(self, course_ids: List[str]) -> Dict[str, List[float]]:
        """Extract feature vector for courses"""
        features = {}
        for course_id in course_ids:
            if course_id not in self.course_data:
                continue

            course = self.course_data[course_id]
            features[course_id] = [
                self.course_difficulty_map.get(course_id, 0.5),
                len(course.get('lessons', [])) / 100,  # Normalized
                course.get('rating', 0) / 5,
                len(course.get('category', '')) / 50  # Simple category encoding
            ]

        return features

    def _calculate_feature_similarity(self, features1: List, features2: List) -> float:
        """Calculate cosine similarity between feature vectors"""
        if not features1 or not features2:
            return 0.0

        # Find common features
        all_features = list(zip(features1, features2))
        dot_product = sum(f1 * f2 for f1, f2 in all_features)
        norm1 = np.sqrt(sum(f1 ** 2 for f1, _ in all_features))
        norm2 = np.sqrt(sum(f2 ** 2 for _, f2 in all_features))

        if norm1 == 0 or norm2 == 0:
            return 0.0

        return dot_product / (norm1 * norm2)

    def _get_popular_courses(self, top_n: int) -> List[Dict[str, Any]]:
        """Get most popular courses"""
        return sorted(
            [
                {
                    'course_id': course_id,
                    'score': course_data.get('rating', 0),
                    'course_data': course_data
                }
                for course_id, course_data in self.course_data.items()
            ],
            key=lambda x: x['score'],
            reverse=True
        )[:top_n]

    def personalized_learning_path(
        self,
        user_id: str,
        num_courses: int = 10
    ) -> Dict[str, Any]:
        """Generate personalized learning path for user"""
        if user_id not in self.user_profiles:
            return {'error': 'User not found'}

        # Combine collaborative and content-based recommendations
        collab_recs = self.collaborative_filtering(user_id, num_courses // 2)
        content_recs = self.content_based_recommendation(user_id, num_courses // 2)

        # Merge and deduplicate
        all_recs = {rec['course_id']: rec for rec in collab_recs + content_recs}
        final_recs = sorted(
            all_recs.values(),
            key=lambda x: x['score'],
            reverse=True
        )[:num_courses]

        return {
            'user_id': user_id,
            'generated_at': datetime.now().isoformat(),
            'recommended_courses': final_recs,
            'user_profile': self.user_profiles.get(user_id, {})
        }

    def analyze_learning_patterns(self, user_id: str) -> Dict[str, Any]:
        """Analyze user's learning patterns"""
        if user_id not in self.learning_patterns:
            return {'error': 'No learning data found'}

        patterns = self.learning_patterns[user_id]
        if not patterns:
            return {'error': 'No learning history'}

        # Calculate statistics
        total_interactions = len(patterns)
        interaction_types = {}
        total_duration = 0

        for pattern in patterns:
            itype = pattern['type']
            interaction_types[itype] = interaction_types.get(itype, 0) + 1
            total_duration += pattern.get('duration', 0)

        return {
            'user_id': user_id,
            'total_interactions': total_interactions,
            'interaction_breakdown': interaction_types,
            'total_learning_time_minutes': total_duration,
            'most_active_time': self._get_most_active_time(patterns),
            'learning_velocity': self._calculate_learning_velocity(patterns)
        }

    def _get_most_active_time(self, patterns: List[Dict]) -> str:
        """Determine when user is most active"""
        if not patterns:
            return 'unknown'

        hours = [
            int(p['timestamp'].split('T')[1].split(':')[0])
            for p in patterns
        ]

        if not hours:
            return 'unknown'

        hour_counts = {}
        for hour in hours:
            hour_counts[hour] = hour_counts.get(hour, 0) + 1

        most_active_hour = max(hour_counts, key=hour_counts.get)
        return f"{most_active_hour:02d}:00-{most_active_hour + 1:02d}:00"

    def _calculate_learning_velocity(self, patterns: List[Dict]) -> float:
        """Calculate learning velocity (interactions per day)"""
        if len(patterns) < 2:
            return 0.0

        first_time = datetime.fromisoformat(patterns[0]['timestamp'])
        last_time = datetime.fromisoformat(patterns[-1]['timestamp'])
        days = max((last_time - first_time).days, 1)

        return len(patterns) / days

    def get_insights(self, user_id: str) -> Dict[str, Any]:
        """Get AI-powered learning insights for user"""
        insights = {
            'user_id': user_id,
            'generated_at': datetime.now().isoformat(),
            'learning_path': self.personalized_learning_path(user_id),
            'patterns': self.analyze_learning_patterns(user_id)
        }

        return insights
