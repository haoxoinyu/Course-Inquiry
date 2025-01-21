import {Component, EventEmitter, OnInit} from '@angular/core';
import {Page} from '../../norm/entity/page';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Course} from '../../norm/entity/Course';
import {MatDialog} from '@angular/material/dialog';
import {AddComponent} from '../add/add.component';
import {EditComponent} from '../edit/edit.component';
import {ShareService} from '../../service/share.service';
import {NgForm} from '@angular/forms';
import {CourseService} from '../../service/course.service';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {User} from '../../norm/entity/User';
import {UserService} from '../../service/user.service';
import {Term} from '../../norm/entity/Term';
import {Klass} from '../../norm/entity/Klass';
import { School } from 'src/app/norm/entity/School';
import { KlassService } from 'src/app/service/klass.service';
import { TermService } from 'src/app/service/term.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass']
})
export class IndexComponent implements OnInit {
   // 默认显示第一条数据
   page = 0;
   // 每页默认五条
   size = 5;
   // 初始化一个有0条数据的

   searchParameters = {
     schoolId: 0,
     klassId: 0,
     termId: 0,
     userId: 0,
     name: '',
     page: this.page,
     size: this.size
   };

   courses: Course[] = [
    new Course({
      id: '1',
      name: '高数',
      term: new Term(
        1,
        '2024秋',
        new School(1, '河北工业大学'),
        new Date(2024, 9, 9),
        new Date(2025, 0, 23)
      ),
      klass: new Klass(1, '计科234', new School(1, '河北工业大学')),
      week: [1,2,3],
      day: [1],
      period: [1],
      sory: 1,
    })]
   pageData = new Page<Course>({
     content: this.courses,
     number: this.page,
     size: this.size,
     numberOfElements: 0
   });

   me : User = new User(1,'zhangsan', '张三', 3, 'yunzhi', true, 1, new Klass(1,'计234', new School(1, '河北工业大学')));
   beLogout = new EventEmitter<void>();

   terms = new Array<Term>();
   term : Term = new Term(
    1,
    '2024秋',
    new School(1, '河北工业大学'),
    new Date(2024, 9, 9),
    new Date(2025, 0, 23));
   clazzes = new Array<Klass>();

   days = [
     {name: '周一', value: 1},
     {name: '周二', value: 2},
     {name: '周三', value: 3},
     {name: '周四', value: 4},
     {name: '周五', value: 5},
     {name: '周六', value: 6},
     {name: '周日', value: 7},
   ];
   periods = [
     {name: '第一大节', value: 1},
     {name: '第二大节', value: 2},
     {name: '第三大节', value: 3},
     {name: '第四大节', value: 4},
     {name: '第五大节', value: 5}
   ];
   protected role: number | undefined;

   constructor(private httpClient: HttpClient,
               private dialog: MatDialog,
               private shareService: ShareService,
               private sweetAlertService: SweetAlertService,
               private courseService: CourseService,
               private userService: UserService,
               private klassService: KlassService,
               private termService: TermService) {
   }

   ngOnInit() {
     const sessionRole = window.sessionStorage.getItem('role');
     if (sessionRole !== 'true') {
       this.role = 3;
     }
     console.log('课程组件调用ngOnInit()');
     // 使用默认值 page = 0 调用loadByPage()方法
     this.loadByPage();
   }

   onPage(page: number): void {
     this.loadByPage(page);
   }

   // 方法来获取天的名称
   getDayName(value: number): string {
     const day = this.days.find(d => d.value === value);
     return day ? day.name : '';
   }

   // 方法来获取时间段的名称
   getPeriodName(value: number): string {
     const period = this.periods.find(p => p.value === value);
     return period ? period.name : '';
   }

   loadByPage(page = 1): void {
     this.courseService.page(this.searchParameters)
      .subscribe(pageData => {
        // 在请求数据之后设置当前页
        this.page = page;
        console.log('课表组件接收到返回数据，重新设置pageData');
        this.pageData = pageData;
        this.pageData.content.forEach(course => {
          course.klass = course.users[0].klass as Klass;
        });
      },
      error => {
        console.error('请求数据失败', error);
      });

   }

   onDelete(index: number, id: number): void {
     this.sweetAlertService.showWarning('', '', 'warning')
       .then(isConfirmed => {
         if (isConfirmed) {
           this.httpClient.delete(`/api/course/delete/${id}`)
             .subscribe(() => {
                 console.log('删除成功');
                 this.sweetAlertService.showSuccess('删除成功', 'success');
                 this.pageData.content.splice(index, 1);
                 // 检查当前页是否还有记录
                 if (this.pageData.content.length === 0 && this.page > 1) {
                   this.page--; // 如果当前页没有其他记录，跳转到上一页
                 }
                 this.loadByPage(this.page); // 重新加载当前页数据
               },
               error => {
                   this.sweetAlertService.showError('删除失败', '检查数据是否清除干净，请稍后再试。', 'error');
                   console.log('删除失败', error);
               });
         }
       });
   }

   openAddDialog(): void {
     const dialogRef = this.dialog.open(AddComponent, {
       width: '900px',
       height: '700px',
     });

     dialogRef.afterClosed().subscribe(() => {
       this.loadByPage(this.page);
     });
   }

   openEditDialog(id: String): void {
     console.log('edit dialog');
     console.log(id);
     const dialogRef = this.dialog.open(EditComponent, {
       width: '900px',
       height: '700px',
       data:{id: id}
     });

     dialogRef.afterClosed().subscribe(() => {
       this.loadByPage(this.page);
     });
   }

  //  addLesson(courseId: number): void {
  //    console.log('addLesson');
  //    const userId = this.me?.id;
  //    this.courseService.addLesson(courseId, userId).subscribe(
  //      response => {
  //        console.log('Lesson added successfully', response);
  //        this.sweetAlertService.showSuccess('添加成功', 'success');
  //      },
  //      error => {
  //        console.log(error.error.error);
  //        if (error.error.error === '课程已存在') {
  //          this.sweetAlertService.showError('添加失败', '课程已存在', '');
  //        } else if (error.error.error === '用户和课程必须属于同一所学校') {
  //          this.sweetAlertService.showError('添加失败', '用户和课程必须属于同一所学校', '');
  //        } else {
  //          console.error('Failed to add lesson', error);
  //          this.sweetAlertService.showError('添加失败', '', '');
  //        }
  //      }
  //    );
  //  }

   onSubmit(form: NgForm, page = 1) {
     console.log('调用了search');
     if (form.valid) {
       this.searchParameters.klassId = form.value.klassId;
       this.searchParameters.termId = form.value.term_id;
       this.searchParameters.name = form.value.name;
       console.log('提交的查询参数:', this.searchParameters);
      this.loadByPage()
     }
   }

   private handleInvalidToken(): void {
     this.sweetAlertService.showLogoutWarning('登录失效', 'warning');
     setTimeout(() => {
       window.sessionStorage.removeItem('login');
       this.httpClient.post('/api/Login/logout', {}).subscribe(
         () => {
           console.log('logout');
           this.beLogout.emit();
           window.location.href = 'http://127.0.0.1:8088/';
         },
         error => {
           console.error('退出失败', error);
         }
       );
     }, 1500);
   }

   getClazzBySchoolId(schoolId: number) {
    this.klassService.getClazzBySchoolId(schoolId)
      .subscribe(data => {
        this.clazzes = data.content;
      }, error => {
        console.error('获取班级失败', error);
      });
  }

  getTermsBySchoolId(schoolId: number) {
    this.termService.getTermsBySchoolId(schoolId)
      .subscribe(data => {
        this.terms = data.content;
      }, error => {
        console.error('获取学期失败', error);
      });
  }

  onSchoolChange(school: School) {
    this.searchParameters.schoolId = school.id;
    this.searchParameters.klassId = 0;
    this.searchParameters.termId = 0;
    this.searchParameters.name = '';
    this.getClazzBySchoolId(school.id);
    this.getTermsBySchoolId(school.id);
  }
}
