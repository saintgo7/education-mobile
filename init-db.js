// MongoDB 초기화 스크립트
// Docker MongoDB 시작 시 자동으로 실행됩니다

db = db.getSiblingDB('admin');

// 초기 사용자 생성
db.createUser({
  user: 'root',
  pwd: 'password123',
  roles: ['root']
});

// 각 서비스용 데이터베이스 생성
const databases = [
  'auth_db',
  'course_db',
  'payment_db',
  'video_db',
  'analytics_db',
  'collaboration_db',
  'email_db',
  'recommendation_db',
  'education_db'
];

databases.forEach(dbName => {
  const newDb = db.getSiblingDB(dbName);
  newDb.createCollection('init', { capped: true, size: 1 });

  // 각 데이터베이스에 사용자 생성
  newDb.createUser({
    user: 'app_user',
    pwd: 'app_password',
    roles: ['readWrite']
  });
});

print('MongoDB initialization completed');

// 기본 컬렉션 및 인덱스 생성
const educationDb = db.getSiblingDB('education_db');

// Users 컬렉션
educationDb.users.createIndex({ email: 1 }, { unique: true });
educationDb.users.createIndex({ createdAt: 1 });

// Courses 컬렉션
educationDb.courses.createIndex({ title: 1 });
educationDb.courses.createIndex({ category: 1 });
educationDb.courses.createIndex({ createdAt: -1 });

// Enrollments 컬렉션
educationDb.enrollments.createIndex({ userId: 1, courseId: 1 }, { unique: true });
educationDb.enrollments.createIndex({ enrolledAt: -1 });

// Payments 컬렉션
educationDb.payments.createIndex({ userId: 1 });
educationDb.payments.createIndex({ status: 1 });
educationDb.payments.createIndex({ createdAt: -1 });

// Videos 컬렉션
educationDb.videos.createIndex({ courseId: 1 });
educationDb.videos.createIndex({ uploadedAt: -1 });

// Analytics 컬렉션
educationDb.analytics.createIndex({ userId: 1, courseId: 1 });
educationDb.analytics.createIndex({ timestamp: -1 });

print('Indexes created successfully');

// 샘플 데이터 삽입 (선택적)
educationDb.courses.insertMany([
  {
    _id: 'course_001',
    title: 'React 기초부터 고급까지',
    description: '완벽한 React 마스터코스',
    instructor: 'John Doe',
    price: 99.99,
    level: 'beginner',
    category: 'Frontend',
    duration: 40,
    students: 1500,
    rating: 4.8,
    createdAt: new Date()
  },
  {
    _id: 'course_002',
    title: 'Node.js 마이크로서비스 아키텍처',
    description: '프로덕션 준비 마이크로서비스 구축',
    instructor: 'Jane Smith',
    price: 129.99,
    level: 'advanced',
    category: 'Backend',
    duration: 60,
    students: 800,
    rating: 4.9,
    createdAt: new Date()
  },
  {
    _id: 'course_003',
    title: 'MongoDB 데이터베이스 설계',
    description: '확장 가능한 데이터베이스 설계 패턴',
    instructor: 'Bob Johnson',
    price: 79.99,
    level: 'intermediate',
    category: 'Database',
    duration: 30,
    students: 600,
    rating: 4.7,
    createdAt: new Date()
  }
]);

print('Sample courses inserted');
