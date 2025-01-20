/**
 * course_user实体
 */
export class CourseUser {
  courseId: number;
  userId: number;

  /**
   * 构造函数
   * @param courseId 课程
   * @param userId 用户
   */
  constructor(courseId: number, userId: number) {
    this.courseId = courseId;
    this.userId = userId;
  }
}
