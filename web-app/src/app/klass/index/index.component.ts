import {Component, OnInit} from '@angular/core';
import {Klass} from '../../norm/entity/Klass';
import {KlassService} from '../../service/klass.service';
import {FormControl} from '@angular/forms';
import {EditComponent} from '../edit/edit.component';
import {AddComponent} from '../add/add.component';
import {MatDialog} from '@angular/material/dialog';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {CacheService} from '../../service/cache.service';
import {School} from '../../norm/entity/School';
import {SchoolService} from '../../service/school.service';
import {UserService} from "../../service/user.service";
import {User} from "../../norm/entity/User";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass']
})
export class IndexComponent implements OnInit {

  /* 分页数据 */
  pages: Array<number> | undefined;

  schools: School[] | undefined;

  /* 查询参数 */
  params = {
    page: 0,
    size: 2,
    name: new FormControl(),
    school_id: null,
  };

  /* 分页数据 */
  pageKlass = {
    totalPages: 0,
    content: new Array<Klass>()
  };

  currentPage: number | undefined;
  totalPages: number | undefined;

  me: User | undefined;

  constructor(private klassService: KlassService,
              private dialog: MatDialog,
              private sweetAlertService: SweetAlertService,
              private schoolService: SchoolService,
              private userService: UserService) {
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
   * @param klass 学校
   */
  onDelete(klass: Klass): void {
    this.sweetAlertService.showWarning('', '', "warning")
      .then(isConfirmed => {
        if (isConfirmed) {
          this.klassService.deleteById(klass.id)
            .subscribe((data) => {
              if (data.message === "该班级仍有用户未清空") {
                this.sweetAlertService.showError('删除失败', '该班级仍有用户未清空', 'error');
              } else {
                this.pageKlass.content.forEach((value, key) => {
                  if (value === klass) {
                    this.pageKlass.content.splice(key, 1);
                    this.sweetAlertService.showSuccess('删除成功', "success");
                    if (this.pageKlass.content.length === 0 && this.params.page > 0) {
                      this.params.page--;
                      this.loadData();
                    }
                    this.loadData();
                  }
                });
              }
            });
        }
      });
  }

  /**
   * 加载数据
   */
  loadData() {
    const queryParams = {
      name: this.params.name.value,
      schoolId: this.params.school_id,
      page: this.params.page,
      size: this.params.size,
    };
    console.log(this.params.school_id);
    console.log(queryParams);

    this.klassService.page(queryParams)
      .subscribe((response: { totalPages: number, content: Array<Klass> }) => {
        this.pageKlass = response;
        console.log(this.pageKlass);
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
      if (user.state === 2) {
        this.sweetAlertService.returnLogin();
      }
      if (user.role === 3) {
        window.history.back();
        this.sweetAlertService.showError('跳转失败', '无权限', 'error');
      }
      console.log(user);
    });
    this.schoolService.all().subscribe(schools => {
      this.schools = schools;
    });
    this.loadData();
  }

  /**
   * 点击分页按钮
   * @param page 要请求的页码
   */
  onPage(page: number) {
    if (page < 0 || page >= this.pageKlass.totalPages) {
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
      height: '370px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  openEditDialog(klass: Klass): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '900px',
      height: '350px',
      data: klass
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }
}
