import { Injectable, Inject } from '@angular/core';
import { RestClient } from './rest-client.service';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { SecurityService } from './security.service';
import { Category } from '../../toolkit/models/category';
import { CategoryService } from '../../toolkit/services/category.service';
import { MenuService } from '../../toolkit/services/menu.service';
import { User } from '../../usersystem/models/user';
import { Role } from '../../usersystem/models/role';
import { UserService } from '../../usersystem/services/user.service';
import { throwError } from 'rxjs';
import { Menu } from '../../toolkit/models/menu';

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  constructor(
    private restClient: RestClient,
    private securityService: SecurityService,
    private categoryService: CategoryService,
    private menuService: MenuService,
    private userService: UserService,
    private http: HttpClient,
    @Inject('env') private environment
  ) {}

  load() {
    const jsonData = {};
    const arrayUrl = [
      this.restClient.getCollectionURL('fw.System', 'key'),
      this.restClient.getCollectionURL('fw.System', 'csrf'),
      this.restClient.getCollectionURL('tk.Category', 'asynctree'),
      this.restClient.getResourceURL('tk.Menu', this.environment.menuName, 'access'),
      this.restClient.getContextPath() + '/api/user/info'
    ];
    return Promise.all(
      arrayUrl.map((url, i) => {
        return new Promise((resolve, reject) => {
          const time = new Date().getTime();
          this.http
            .get(url)
            .pipe(map(res => res))
            .pipe(
              catchError(
                (error: any): any => {
                  resolve(true);
                  return throwError(error || 'Server error');
                }
              )
            )
            .subscribe(response => {
              jsonData['data' + i] = response;
              resolve(true);
            });
        });
      })
    ).then(response => {
      if (jsonData['data' + 0] && 1 === jsonData['data' + 0].code) {
        this.securityService.publicKey = jsonData['data' + 0].result;
      }
      if (jsonData['data' + 1] && 1 === jsonData['data' + 1].code) {
        this.securityService.csrfToken = jsonData['data' + 1].result;
        this.restClient.csrfToken = jsonData['data' + 1].result;
      }
      if (jsonData['data' + 2]) {
        jsonData['data' + 2].forEach((categoryData: any) => {
          this.categoryService.addRootCategory(new Category(categoryData));
        });
      }
      if (jsonData['data' + 3]) {
        this.menuService.setMenu(new Menu(jsonData['data' + 3]));
        this.menuService.getMenu().reloadRequired = false;
      }
      if (jsonData['data' + 4]) {
        const u = jsonData['data' + 4];
        const roles = new Array<Role>();
        if (u.roles) {
          u.roles.forEach(r => {
            roles.push(new Role(r.id, r.name));
          });
        }
        this.userService.currentUser = new User(
          u.userId,
          u.personId,
          u.userName,
          u.nickName,
          u.email,
          u.avatar,
          u.mobile,
          u.anonymous,
          roles
        );
      }
    });
  }
}
