<template>
  <view class="container">
    <!-- Navigation Header -->
    <view class="header">
      <text class="header-title">{{ appTitle }}</text>
      <view class="user-info" @press="goToProfile">
        <text class="user-name">{{ currentUser.name }}</text>
      </view>
    </view>

    <!-- Main Navigation Tabs -->
    <view class="nav-tabs">
      <view
        v-for="tab in navigationTabs"
        :key="tab.id"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        @press="activeTab = tab.id"
      >
        <text class="tab-label">{{ tab.label }}</text>
      </view>
    </view>

    <!-- Tab Content -->
    <scroll-view class="content">
      <component :is="currentComponent" />
    </scroll-view>

    <!-- Bottom Navigation -->
    <view class="bottom-nav">
      <view class="nav-item" @press="activeTab = 'courses'">
        <text class="nav-icon">📚</text>
        <text class="nav-label">Courses</text>
      </view>
      <view class="nav-item" @press="activeTab = 'progress'">
        <text class="nav-icon">📊</text>
        <text class="nav-label">Progress</text>
      </view>
      <view class="nav-item" @press="activeTab = 'messages'">
        <text class="nav-icon">💬</text>
        <text class="nav-label">Messages</text>
      </view>
      <view class="nav-item" @press="activeTab = 'profile'">
        <text class="nav-icon">👤</text>
        <text class="nav-label">Profile</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import CoursesView from './views/CoursesView.vue'
import ProgressView from './views/ProgressView.vue'
import MessagesView from './views/MessagesView.vue'
import ProfileView from './views/ProfileView.vue'

export default defineComponent({
  name: 'App',
  components: {
    CoursesView,
    ProgressView,
    MessagesView,
    ProfileView
  },
  setup() {
    const store = useStore()

    return {
      appTitle: 'Education Platform',
      activeTab: 'courses',
      currentUser: {
        name: 'John Doe',
        id: '1'
      },
      navigationTabs: [
        { id: 'courses', label: 'Courses' },
        { id: 'progress', label: 'Progress' },
        { id: 'messages', label: 'Messages' },
        { id: 'profile', label: 'Profile' }
      ]
    }
  },
  computed: {
    currentComponent(): string {
      const componentMap: Record<string, string> = {
        courses: 'CoursesView',
        progress: 'ProgressView',
        messages: 'MessagesView',
        profile: 'ProfileView'
      }
      return componentMap[this.activeTab] || 'CoursesView'
    }
  },
  methods: {
    goToProfile() {
      this.activeTab = 'profile'
    }
  },
  mounted() {
    this.$store.dispatch('loadUserData')
    this.$store.dispatch('loadCourses')
  }
})
</script>

<style scoped>
.container {
  flex: 1;
  background-color: #f5f5f5;
}

.header {
  background-color: #6200ea;
  padding: 16px;
  padding-top: 24px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.user-info {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 8px;
}

.user-name {
  color: white;
  font-size: 14px;
}

.nav-tabs {
  flex-direction: row;
  background-color: white;
  border-bottom-color: #e0e0e0;
  border-bottom-width: 1px;
}

.tab {
  flex: 1;
  padding: 12px;
  border-bottom-width: 3px;
  border-bottom-color: transparent;
  align-items: center;
}

.tab.active {
  border-bottom-color: #6200ea;
}

.tab-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.tab.active .tab-label {
  color: #6200ea;
}

.content {
  flex: 1;
  padding: 16px;
}

.bottom-nav {
  flex-direction: row;
  background-color: white;
  border-top-color: #e0e0e0;
  border-top-width: 1px;
  padding-bottom: 16px;
}

.nav-item {
  flex: 1;
  align-items: center;
  padding: 8px;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.nav-label {
  font-size: 12px;
  color: #666;
}
</style>
