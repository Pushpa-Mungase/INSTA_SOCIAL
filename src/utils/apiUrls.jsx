

const apiUrls = {
  createScheduledPost: `/post/scheduled-posts`,
  getScheduledPosts: `/post/get-scheduled-posts`,
  updateSchedulePostById: (postId) => `/post/update-scheduled-post/${postId}`,
  deleteScheduledPost: (postId) => `/post/delete-scheduled-post/${postId}`,
  getPlatforms: `/platform/get-user-platforms`,
  signUpUser: `/user/create`,
  loginUser: `/auth/login`,
  requestPasswordReset: "/auth/request-reset",
  resetPassword: "/auth/reset-password",
  getUserById: () => `/user/byId`,
};

export default apiUrls;
