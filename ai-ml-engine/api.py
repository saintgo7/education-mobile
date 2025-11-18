from flask import Flask, request, jsonify
from flask_cors import CORS
from recommendation_engine import RecommendationEngine
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize recommendation engine
recommendation_engine = RecommendationEngine()

# Example data initialization
def init_sample_data():
    """Initialize with sample data for demonstration"""
    # Add sample users
    recommendation_engine.register_user('user1', {
        'name': 'John Doe',
        'email': 'john@example.com'
    })
    recommendation_engine.register_user('user2', {
        'name': 'Jane Smith',
        'email': 'jane@example.com'
    })

    # Add sample courses
    courses = [
        {
            'id': 'react-advanced',
            'title': 'React Advanced Patterns',
            'category': 'Programming',
            'level': 'advanced',
            'rating': 4.8,
            'lessons': [f'lesson-{i}' for i in range(1, 11)],
            'description': 'Master advanced React patterns'
        },
        {
            'id': 'typescript-master',
            'title': 'TypeScript Mastery',
            'category': 'Programming',
            'level': 'intermediate',
            'rating': 4.9,
            'lessons': [f'lesson-{i}' for i in range(1, 8)],
            'description': 'Complete TypeScript course'
        },
        {
            'id': 'web-design',
            'title': 'Web Design Fundamentals',
            'category': 'Design',
            'level': 'beginner',
            'rating': 4.7,
            'lessons': [f'lesson-{i}' for i in range(1, 6)],
            'description': 'Learn modern web design'
        },
        {
            'id': 'python-ml',
            'title': 'Python for Machine Learning',
            'category': 'AI/ML',
            'level': 'advanced',
            'rating': 4.6,
            'lessons': [f'lesson-{i}' for i in range(1, 12)],
            'description': 'ML fundamentals with Python'
        },
        {
            'id': 'docker-kubernetes',
            'title': 'Docker & Kubernetes',
            'category': 'DevOps',
            'level': 'intermediate',
            'rating': 4.5,
            'lessons': [f'lesson-{i}' for i in range(1, 9)],
            'description': 'Container orchestration'
        }
    ]

    for course in courses:
        recommendation_engine.add_course(course['id'], course)

    # Add sample interactions
    recommendation_engine.record_interaction('user1', 'react-advanced', 'view', 120)
    recommendation_engine.record_interaction('user1', 'typescript-master', 'complete_lesson', 45)
    recommendation_engine.record_interaction('user1', 'react-advanced', 'complete_lesson', 60)

    # Add sample ratings
    recommendation_engine.rate_course('user1', 'react-advanced', 5.0)
    recommendation_engine.rate_course('user1', 'typescript-master', 4.5)
    recommendation_engine.rate_course('user2', 'react-advanced', 4.8)
    recommendation_engine.rate_course('user2', 'web-design', 4.6)

# Health check
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'service': 'AI Recommendation Engine'})

# Get personalized recommendations
@app.route('/api/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    try:
        num_courses = request.args.get('num_courses', 5, type=int)
        recommendations = recommendation_engine.personalized_learning_path(user_id, num_courses)
        return jsonify(recommendations)
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Get collaborative filtering recommendations
@app.route('/api/recommendations/<user_id>/collaborative', methods=['GET'])
def get_collaborative_recommendations(user_id):
    try:
        top_n = request.args.get('top_n', 5, type=int)
        recommendations = recommendation_engine.collaborative_filtering(user_id, top_n)
        return jsonify({
            'user_id': user_id,
            'method': 'collaborative_filtering',
            'recommendations': recommendations
        })
    except Exception as e:
        logger.error(f"Error getting collaborative recommendations: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Get content-based recommendations
@app.route('/api/recommendations/<user_id>/content-based', methods=['GET'])
def get_content_based_recommendations(user_id):
    try:
        top_n = request.args.get('top_n', 5, type=int)
        recommendations = recommendation_engine.content_based_recommendation(user_id, top_n)
        return jsonify({
            'user_id': user_id,
            'method': 'content_based',
            'recommendations': recommendations
        })
    except Exception as e:
        logger.error(f"Error getting content-based recommendations: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Record user interaction
@app.route('/api/interactions/<user_id>', methods=['POST'])
def record_interaction(user_id):
    try:
        data = request.json
        course_id = data.get('course_id')
        interaction_type = data.get('type')
        duration = data.get('duration', 0)

        recommendation_engine.record_interaction(user_id, course_id, interaction_type, duration)

        return jsonify({'message': 'Interaction recorded successfully'})
    except Exception as e:
        logger.error(f"Error recording interaction: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Rate a course
@app.route('/api/ratings/<user_id>/<course_id>', methods=['POST'])
def rate_course(user_id, course_id):
    try:
        data = request.json
        rating = data.get('rating')

        if not rating or rating < 0 or rating > 5:
            return jsonify({'error': 'Invalid rating (0-5)'}), 400

        recommendation_engine.rate_course(user_id, course_id, rating)

        return jsonify({'message': 'Course rated successfully'})
    except Exception as e:
        logger.error(f"Error rating course: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Get user learning insights
@app.route('/api/insights/<user_id>', methods=['GET'])
def get_insights(user_id):
    try:
        insights = recommendation_engine.get_insights(user_id)
        return jsonify(insights)
    except Exception as e:
        logger.error(f"Error getting insights: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Get learning patterns analysis
@app.route('/api/patterns/<user_id>', methods=['GET'])
def get_patterns(user_id):
    try:
        patterns = recommendation_engine.analyze_learning_patterns(user_id)
        return jsonify(patterns)
    except Exception as e:
        logger.error(f"Error analyzing patterns: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Register new user
@app.route('/api/users', methods=['POST'])
def register_user():
    try:
        data = request.json
        user_id = data.get('id')
        user_data = {
            'name': data.get('name'),
            'email': data.get('email')
        }

        recommendation_engine.register_user(user_id, user_data)

        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Add course
@app.route('/api/courses', methods=['POST'])
def add_course():
    try:
        data = request.json
        course_id = data.get('id')
        course_data = {
            'title': data.get('title'),
            'category': data.get('category'),
            'level': data.get('level'),
            'rating': data.get('rating', 0),
            'lessons': data.get('lessons', []),
            'description': data.get('description')
        }

        recommendation_engine.add_course(course_id, course_data)

        return jsonify({'message': 'Course added successfully'}), 201
    except Exception as e:
        logger.error(f"Error adding course: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_sample_data()
    app.run(debug=True, port=5000)
