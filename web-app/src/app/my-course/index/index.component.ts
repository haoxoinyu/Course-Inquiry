import {Component, EventEmitter, OnInit} from '@angular/core';
import {Term} from "../../norm/entity/Term";
import {AddComponent} from "../add/add.component";
import {CreateComponent} from "../create/create.component";
import {HttpClient} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {SweetAlertService} from "../../service/sweet-alert.service";
import {TermService} from "../../service/term.service";
import {User} from "../../norm/entity/User";
import {MyCourseService} from "../../service/my-course.service";
import {UserService} from "../../service/user.service";
import {Course} from "../../norm/entity/Course";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass']
})
export class IndexComponent implements OnInit {
  constructor(private httpClient: HttpClient,
              private dialog: MatDialog,
              private sweetAlertService: SweetAlertService,
              private userService: UserService,
              private myCourseService: MyCourseService,
              private termService: TermService) {
  }

  pages: Array<number> | undefined;

  /* 查询参数 */
  params = {
    page: 0,
    size: 5,
    name: "" as unknown as string,
    term_id: null as unknown as number,
    sory: null as unknown as number,
    user_id: null as unknown as number,
  };

  /* 分页数据 */
  pageMyCourse = {
    totalPages: 0,
    content: new Array<Course>()
  };
  currentPage: number | undefined;
  totalPages: number | undefined;

  me: User | undefined;
  termsBySchool = new Array<Term>();

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

  protected readonly Object = Object;

  ngOnInit() {
    this.userService.me().subscribe((user) => {
      if (user.state === 2) {
        this.sweetAlertService.returnLogin();
      }
      this.me = user;
      this.params.user_id = user.id;
      console.log(user);
      this.getTermsBySchoolId();
      this.loadData();
    });
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

  /**
   * 加载数据
   */
  loadData() {
    const queryParams = {
      term_id: this.params.term_id,
      userId: this.params.user_id,
      name: this.params.name,
      sory: this.params.sory,
      page: this.params.page,
      size: this.params.size,
    };
    console.log(queryParams);

    this.myCourseService.page(queryParams)
      .subscribe((response: { totalPages: number, content: Array<Course> }) => {
        this.pageMyCourse = response;
        console.log(this.pageMyCourse);
        this.pages = this.makePagesByTotalPages(this.params.page, response.totalPages);
      });
  }

  /**
   * 删除
   * @param
   */
  onDelete(course: Course): void {
    this.sweetAlertService.showWarning('', '', "warning")
      .then(isConfirmed => {
        if (isConfirmed) {
          this.myCourseService.delete(Number(course.id), Number(this.me?.id))
            .subscribe(() => {
              this.pageMyCourse.content.forEach((value, key) => {
                if (value === course) {
                  this.pageMyCourse.content.splice(key, 1);
                  this.sweetAlertService.showSuccess('删除成功', "success");
                  if (this.pageMyCourse.content.length === 0 && this.params.page > 0) {
                    this.params.page--;
                    this.loadData();
                  }
                  this.loadData();
                }
              });
            });
        }
      });
  }

  /* 查询 */
  onQuery() {
    this.loadData();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '900px',
      height: '370px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '900px',
      height: '570px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  getTermsBySchoolId() {
    this.termService.getTermsBySchoolId(Number(this.me?.klass?.school?.id))
      .subscribe((data) => {
        this.termsBySchool = data.content;
      }, (error: any) => {
        console.error('获取学期失败', error);
      });
  }

  /**
   * 生成分页数据
   * @param currentPage 当前页
   * @param totalPages 总页数
   */
  makePagesByTotalPages(currentPage: number, totalPages: number): Array<number> {
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    if (totalPages > 0) {
      /* 总页数小于5 */
      if (totalPages <= 5) {
        return this.makePages(0, totalPages - 1);
      }

      /* 首2页 */
      if (currentPage < 2) {
        return this.makePages(0, 4);
      }

      /* 尾2页 */
      if (currentPage > totalPages - 3) {
        return this.makePages(totalPages - 5, totalPages - 1);
      }

      /* 总页数大于5，且为中间页码*/
      return this.makePages(currentPage - 2, currentPage + 2);
    }

    return new Array();
  }

  /**
   * 生成页码
   * @param begin 开始页码
   * @param end 结束页码
   */
  makePages(begin: number, end: number): Array<number> {
    const result = new Array<number>();
    for (; begin <= end; begin++) {
      result.push(begin);
    }
    return result;
  }

  /**
   * 点击分页按钮
   * @param page 要请求的页码
   */
  onPage(page: number) {
    if (page < 0 || page >= this.pageMyCourse.totalPages) {
      return;
    }
    this.params.page = page;
    this.loadData();
  }
}
