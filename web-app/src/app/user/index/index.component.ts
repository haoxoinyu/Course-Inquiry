import {Component, OnInit} from '@angular/core';
import {User} from '../../norm/entity/User';
import {UserService} from '../../service/user.service';
import {FormControl} from '@angular/forms';
import {EditComponent} from '../edit/edit.component';
import {AddComponent} from '../add/add.component';
import {MatDialog} from '@angular/material/dialog';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {Klass} from "../../norm/entity/Klass";
import {KlassService} from "../../service/klass.service";
import {School} from "../../norm/entity/School";
import {SchoolService} from "../../service/school.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass']
})
export class IndexComponent implements OnInit {

  /* 分页数据 */
  pages: Array<number> | undefined;

  /* 查询参数 */
  params = {
    page: 0,
    size: 2,
    username: "",
    role: new FormControl(),
    state: new FormControl(),
    school: null as unknown as number,
    klass_id: null as unknown as number
  };

  /* 分页数据 */
  pageUser = {
    totalPages: 0,
    content: new Array<User>()
  };

  currentPage: number | undefined;
  totalPages: number | undefined;
  me?: User;
  klasses: Klass[] | undefined;
  schools: School[] | undefined;
  schoolKlassesMap: { [key: number]: Klass[] } = {};

  constructor(private userService: UserService,
              private klassService: KlassService,
              private schoolService: SchoolService,
              private dialog: MatDialog,
              private sweetAlertService: SweetAlertService) {
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
   * 删除学校
   * @param user 学校
   */
  onDelete(user: User): void {
    this.sweetAlertService.showWarning('', '', "warning")
      .then(isConfirmed => {
        if (isConfirmed) {
          this.userService.deleteById(user.id)
            .subscribe(() => {
              this.pageUser.content.forEach((value, key) => {
                if (value === user) {
                  this.pageUser.content.splice(key, 1);
                  this.sweetAlertService.showSuccess('删除成功', "success");
                  if (this.pageUser.content.length === 0 && this.params.page > 0) {
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

  /**
   * 加载数据
   */
  loadData() {
    const queryParams = {
      username: this.params.username,
      klass_id: this.params.klass_id,
      role: Number(this.params.role),
      state: Number(this.params.state),
      page: this.params.page,
      size: this.params.size
    };
    console.log(queryParams);
    this.userService.page(queryParams)
      .subscribe((response: { totalPages: number, content: Array<User> }) => {
        this.pageUser = response;
        console.log(this.pageUser);
        this.pages = this.makePagesByTotalPages(this.params.page, response.totalPages);
      });
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

  ngOnInit() {
    console.log('ngOnInit');
    this.userService.me().subscribe((user) => {
      this.me = user;
      console.log(user);
    });
    this.schoolService.all().subscribe((school) => {
      console.log(school);
      this.schools = school;
      this.groupKlassesBySchool();
    });
    this.klassService.all().subscribe((klass) => {
      console.log(klass);
      this.klasses = klass;
      this.groupKlassesBySchool();
    });
    this.loadData();
  }

  groupKlassesBySchool() {
    // 清空之前的分类数据
    this.schoolKlassesMap = {};

    // 按学校分类班级
    this.klasses?.forEach((klass) => {
      if (!this.schoolKlassesMap[klass.school!.id]) {
        this.schoolKlassesMap[klass.school!.id] = [];
      }
      this.schoolKlassesMap[klass.school!.id].push(klass);
    });
  }

  /**
   * 点击分页按钮
   * @param page 要请求的页码
   */
  onPage(page: number) {
    if (page < 0 || page >= this.pageUser.totalPages) {
      return;
    }
    this.params.page = page;
    this.loadData();
  }

  /* 查询 */
  onQuery() {
    this.loadData();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '900px',
      height: '700px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '900px',
      height: '700px',
      data: user
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  getKlassBySchoolId(schoolId: number) {
      this.klassService.getKlassBySchoolId(schoolId)
        .subscribe((klasses: Klass[] | undefined) => {
          this.klasses = klasses;
        }, (error: any) => {
          console.error('获取班级失败', error);
        });
  }

  onSchoolChange(school: School) {
    this.params.school = school.id;
    console.log(this.params.school);
    this.getKlassBySchoolId(this.params.school);
  }
}
