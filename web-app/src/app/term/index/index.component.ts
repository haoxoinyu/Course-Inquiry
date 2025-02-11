import {Component, OnInit} from '@angular/core';
import {Klass} from '../../norm/entity/Klass';
import {FormControl} from '@angular/forms';
import {EditComponent} from '../edit/edit.component';
import {AddComponent} from '../add/add.component';
import {MatDialog} from '@angular/material/dialog';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {School} from '../../norm/entity/School';
import {SchoolService} from '../../service/school.service';
import {TermService} from "../../service/term.service";
import {Term} from "../../norm/entity/Term";
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
  pageTerm = {
    totalPages: 0,
    content: new Array<Term>()
  };

  currentPage: number | undefined;
  totalPages: number | undefined;

  me: User | undefined;

  constructor(private termService: TermService,
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

    this.termService.page(queryParams)
      .subscribe((response: { totalPages: number, content: Array<Term> }) => {
        this.pageTerm = response;
        console.log(this.pageTerm);
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
      if (user.state === 2) {
        this.sweetAlertService.returnLogin();
      }
      this.me = user;
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
   * 删除学期
   * @param term 学期
   */
  onDelete(term: Term): void {
    this.sweetAlertService.showWarning('', '', "warning")
      .then(isConfirmed => {
        if (isConfirmed) {
          this.termService.deleteById(term.id)
            .subscribe((data: any) => {
              if (data.message === "该学期仍有课程未清空") {
                this.sweetAlertService.showError('删除失败', '该学期仍有课程未清空', 'error');
              } else {
                this.pageTerm.content.forEach((value, key) => {
                  if (value === term) {
                    this.pageTerm.content.splice(key, 1);
                    this.sweetAlertService.showSuccess('删除成功', "success");
                    if (this.pageTerm.content.length === 0 && this.params.page > 0) {
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
   * 点击分页按钮
   * @param page 要请求的页码
   */
  onPage(page: number) {
    if (page < 0 || page >= this.pageTerm.totalPages) {
      return;
    }
    this.params.page = page;
    this.loadData();
  }

  /* 查询 */
  onQuery() {
    this.params.page = 0;
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

  openEditDialog(term: Term): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '900px',
      height: '350px',
      data: term
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }
}
