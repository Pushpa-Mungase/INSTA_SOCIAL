// const apiUrls = {
//   createScheduledPost: `/post/scheduled-posts`,
//   getScheduledPosts: `/post/get-scheduled-posts`,
//   updateSchedulePostById:`/post/update-scheduled-post/${postId}`,
//   deleteScheduledPost: (id) => `/post/delete-scheduled-post/:postId`,
// };

// export default apiUrls;


const apiUrls = {
  createScheduledPost: `/post/scheduled-posts`,
  getScheduledPosts: `/post/get-scheduled-posts`,
  updateSchedulePostById: (postId) => `/post/update-scheduled-post/${postId}`,
  deleteScheduledPost: (postId) => `/post/delete-scheduled-post/${postId}`,
};

export default apiUrls;
