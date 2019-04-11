import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { RestClient } from '../../core/services/rest-client.service';
import { SecurityService } from '../../core/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserData: User;

  constructor(private restClient: RestClient, private securityService: SecurityService) {}

  get currentUser(): User {
    if (this.currentUserData == null) {
      this.refreshCurrentUser();
    }
    return this.currentUserData;
  }

  set currentUser(user: User) {
    this.currentUserData = user;
  }

  public async refreshCurrentUser(): Promise<object> {
    const response = await this.restClient.get('/api/user/info');
    this.currentUserData = response.result;
    return response.result;
  }

  /**
   * 调用登出接口返回登出后新的csrftoken信息
   */
  public async logout(): Promise<object> {
    const response = await this.restClient.get('/logout?responseType=json');
    const { csrfToken } = response;
    this.restClient.csrfToken = csrfToken;
    this.securityService.csrfToken = csrfToken;
    return response;
  }
}
