import { Injectable, Inject } from '@angular/core';
import { RestClient } from './rest-client.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private csrfTokenData: string;

  private publicKeyData: string;

  constructor(private restClient: RestClient) { }

  /**
   * 设置csrfToken
   */
  public get csrfToken(): string {
    if (this.csrfTokenData === null) {
      this.refreshCsrfToken();
    }
    return this.csrfTokenData;
  }

  /**
   * 取csrfToken值
   */
  public set csrfToken(token: string) {
    this.csrfTokenData = token;
  }

  /**
   * 取用于加密的公钥
   */
  public get publicKey(): string {
    if (this.publicKeyData === null) {
      this.refreshPublicKey();
    }
    return this.publicKeyData;
  }

  /**
   * 设置publickey
   */
  public set publicKey(key: string) {
    this.publicKeyData = key;
  }

  /**
   * 刷新公钥信息
   */
  public async refreshPublicKey(): Promise<string> {
    const result = await this.restClient.requestCollection('fw.System', 'key');
    return result.result;
  }

  /**
   * 刷新csrfToken信息
   */
  public async refreshCsrfToken(): Promise<string> {
    const result = await this.restClient.requestCollection('fw.System', 'csrf');
    return result.result;
  }
}
