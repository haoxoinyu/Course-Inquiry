import {Component, OnInit} from '@angular/core';
import {School} from '../../norm/entity/School';
import {SchoolService} from '../../service/school.service';
import {FormControl} from '@angular/forms';
import {EditComponent} from '../edit/edit.component';
import {AddComponent} from '../add/add.component';
import {MatDialog} from '@angular/material';
import {SweetAlertService} from '../../service/sweet-alert.service';
import {CacheService} from '../../service/cache.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass']
})
export class IndexComponent implements OnInit {

  /* 分页数据 */
  pages: Array<number>;

  /* 查询参数 */
  params = {
    page: 0,
    size: 2,
    name: new FormControl()
  };

  /* 分页数据 */
  pageSchool = {
    totalPages: 0,
    content: new Array<School>()
  };

  currentPage: number;
  totalPages: number;

  constructor(private schoolService: SchoolService,
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
   * @param school 学校
   */
  onDelete(school: School): void {
    this.sweetAlertService.showWarning('', '', '')
      .then(isConfirmed => {
        if (isConfirmed) {
          this.schoolService.deleteById(school.id)
            .subscribe(() => {
              this.pageSchool.content.forEach((value, key) => {
                if (value === school) {
                  this.pageSchool.content.splice(key, 1);
                  this.sweetAlertService.showSuccess('删除成功', '');
                  if (this.pageSchool.content.length === 0 && this.params.page > 0) {
                    this.params.page--;
                    this.loadData();
                  }
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
      page: this.params.page,
      size: this.params.size,
      name: this.params.name.value,
    };

    this.schoolService.page(queryParams)
      .subscribe((response: { totalPages: number, content: Array<School> }) => {
        this.pageSchool = response;
        console.log(this.pageSchool);
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
    this.loadData();
  }

  /**
   * 点击分页按钮
   * @param page 要请求的页码
   */
  onPage(page: number) {
    if (page < 0 || page >= this.pageSchool.totalPages) {
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
      height: '300px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }

  openEditDialog(school: School): void {
    const dialogRef = this.dialog.open(EditComponent, {
      width: '900px',
      height: '300px',
      data: school
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadData();
    });
  }
}
