<template>
  <view class="courses-container">
    <!-- Search Bar -->
    <view class="search-section">
      <text-input
        v-model="searchQuery"
        placeholder="Search courses..."
        class="search-input"
      />
    </view>

    <!-- Category Filter -->
    <scroll-view horizontal class="category-scroll">
      <view class="category-list">
        <view
          v-for="category in categories"
          :key="category"
          class="category-chip"
          :class="{ active: selectedCategory === category }"
          @press="selectedCategory = category"
        >
          <text class="category-text">{{ category }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- Enrolled Courses Section -->
    <view class="section">
      <text class="section-title">My Courses</text>
      <view v-if="enrolledCoursesList.length === 0" class="empty-state">
        <text class="empty-text">No courses enrolled yet</text>
        <text class="empty-subtext">Browse and enroll in courses below</text>
      </view>
      <view v-else class="courses-list">
        <view
          v-for="course in enrolledCoursesList"
          :key="course.id"
          class="course-card"
          @press="openCourse(course.id)"
        >
          <image :src="course.thumbnail" class="course-image" />
          <view class="course-info">
            <text class="course-title">{{ course.title }}</text>
            <text class="course-instructor">{{ course.instructor }}</text>
            <view class="progress-container">
              <view class="progress-bar">
                <view class="progress-fill" :style="{ width: course.progress + '%' }" />
              </view>
              <text class="progress-text">{{ course.progress }}%</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Browse Courses Section -->
    <view class="section">
      <text class="section-title">Explore Courses</text>
      <view class="courses-list">
        <view
          v-for="course in filteredCourses"
          :key="course.id"
          class="course-card browse-card"
          @press="showCourseDetails(course)"
        >
          <image :src="course.thumbnail" class="course-image" />
          <view class="course-info">
            <text class="course-title">{{ course.title }}</text>
            <text class="course-description">{{ course.description }}</text>
            <view class="course-meta">
              <text class="meta-item">{{ course.lessons }} lessons</text>
              <text class="meta-item">{{ course.instructor }}</text>
            </view>
          </view>
          <button
            class="enroll-btn"
            @press="enrollCourse(course.id)"
          >
            <text class="enroll-text">Enroll</text>
          </button>
        </view>
      </view>
    </view>

    <!-- Course Detail Modal -->
    <modal v-if="selectedCourse" transparent @dismiss="selectedCourse = null">
      <view class="modal-container">
        <view class="modal-content">
          <text class="modal-title">{{ selectedCourse.title }}</text>
          <text class="modal-description">{{ selectedCourse.description }}</text>
          <view class="modal-meta">
            <text>Instructor: {{ selectedCourse.instructor }}</text>
            <text>Lessons: {{ selectedCourse.lessons }}</text>
          </view>
          <button
            class="modal-btn primary"
            @press="confirmEnroll"
          >
            <text class="btn-text">Enroll Now</text>
          </button>
          <button
            class="modal-btn secondary"
            @press="selectedCourse = null"
          >
            <text class="btn-text">Cancel</text>
          </button>
        </view>
      </view>
    </modal>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default defineComponent({
  name: 'CoursesView',
  data() {
    return {
      searchQuery: '',
      selectedCategory: 'All',
      selectedCourse: null,
      categories: ['All', 'Programming', 'Design', 'Business', 'Science']
    }
  },
  computed: {
    ...mapGetters(['enrolledCoursesList']),
    filteredCourses() {
      return this.$store.state.courses.filter((course: any) => {
        const matchesSearch = course.title
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
          course.description
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())

        const matchesCategory = this.selectedCategory === 'All' ||
          course.category === this.selectedCategory

        return matchesSearch && matchesCategory
      })
    }
  },
  methods: {
    ...mapActions(['enrollCourse']),
    openCourse(courseId: string) {
      this.$router?.push(`/course/${courseId}`)
    },
    showCourseDetails(course: any) {
      this.selectedCourse = course
    },
    confirmEnroll() {
      if (this.selectedCourse) {
        this.enrollCourse(this.selectedCourse.id)
        this.selectedCourse = null
      }
    }
  }
})
</script>

<style scoped>
.courses-container {
  flex: 1;
  background-color: #f5f5f5;
}

.search-section {
  padding: 16px;
  background-color: white;
}

.search-input {
  background-color: #f0f0f0;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
}

.category-scroll {
  background-color: white;
  padding: 12px 16px;
  margin-bottom: 8px;
}

.category-list {
  flex-direction: row;
}

.category-chip {
  background-color: #f0f0f0;
  padding: 8px 16px;
  border-radius: 20px;
  margin-right: 8px;
  border-width: 1px;
  border-color: transparent;
}

.category-chip.active {
  background-color: #6200ea;
  border-color: #6200ea;
}

.category-text {
  font-size: 14px;
  color: #666;
}

.category-chip.active .category-text {
  color: white;
}

.section {
  padding: 16px;
  background-color: white;
  margin-bottom: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.courses-list {
  flex-direction: column;
}

.course-card {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: #e0e0e0;
}

.course-image {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  margin-bottom: 12px;
  background-color: #e0e0e0;
}

.course-info {
  flex: 1;
}

.course-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.course-instructor {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.course-description {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.progress-container {
  flex-direction: row;
  align-items: center;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: #e0e0e0;
  border-radius: 3px;
  margin-right: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #6200ea;
}

.progress-text {
  font-size: 12px;
  color: #666;
  width: 40px;
}

.course-meta {
  flex-direction: row;
  margin-top: 8px;
}

.meta-item {
  font-size: 12px;
  color: #999;
  margin-right: 12px;
}

.enroll-btn {
  background-color: #6200ea;
  padding: 10px 16px;
  border-radius: 6px;
  margin-top: 8px;
  align-items: center;
}

.enroll-text {
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.empty-state {
  align-items: center;
  padding: 32px 16px;
}

.empty-text {
  font-size: 16px;
  color: #999;
  margin-bottom: 4px;
}

.empty-subtext {
  font-size: 13px;
  color: #ccc;
}

.modal-container {
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
}

.modal-content {
  background-color: white;
  padding: 24px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.modal-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
  line-height: 1.5;
}

.modal-meta {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.modal-meta text {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.modal-btn {
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.modal-btn.primary {
  background-color: #6200ea;
}

.modal-btn.secondary {
  background-color: #f0f0f0;
}

.btn-text {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.modal-btn.secondary .btn-text {
  color: #333;
}
</style>
