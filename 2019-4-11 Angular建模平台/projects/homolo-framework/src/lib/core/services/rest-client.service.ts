import { Injectable, Inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpParameterCodec
} from '@angular/common/http';

export enum RequestMethod {
  Get = 0,
  Post = 1,
  Put = 2,
  Delete = 3,
  Options = 4,
  Head = 5,
  Patch = 6
}

/**
 * 处理form表单提交时候的参数不能正确的编码，导致数据里有 ‘+’ 出现时会丢失，比如加密的密码传到后台就会报错
 */
export class CustomHttpParameterEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }
  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }
  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }
  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

@Injectable({
  providedIn: 'root'
})
export class RestClient {
  methodMapping = new Map<string, RequestMethod>([
    ['get', RequestMethod.Get],
    ['meta', RequestMethod.Get],
    ['*', RequestMethod.Post]
  ]);

  private csrfTokenData: string;

  private contextPathData: string;

  /**
   * 得到应用的 contextPath 用于前端请求后端地址的接口前缀, 这里处理了 path结尾的逻辑，不应该以 '/' 结尾.
   */
  getContextPath(): string {
    if (this.contextPathData) {
      return this.contextPathData;
    } else if (this.env.contextPath) {
      const path = this.env.contextPath;
      this.contextPathData = path.endsWith('/')
        ? path.substring(0, path.length - 1)
        : path;
    }
    return this.contextPathData;
  }

  /**
   * 得到rest service 的服务地址前缀 eg:'/ssp/service/rest'.
   */
  getRestServiceUrl(): string {
    return this.getContextPath() + '/service/rest';
  }

  /**
   * 得到最终请求的地址，这里主要是处理contextPath的逻辑，本地开发的时候会有contextPath,在前端的component里使用的时候不需要关心，
   * 只要使用相对服务的绝对地址就可以了比如 '/api/person/info'.
   *
   * @param path 请求路径
   * @returns 返回最终请求的地址,eg: '/ssp/api/person/info'
   */
  getRequestPath(path: string): string {
    return path.startsWith('/')
      ? this.getContextPath() + path
      : this.getContextPath() + '/' + path;
  }

  /**
   * 得到resource的最终请求地址.
   *
   * @param module module名称 eg:tk.Menu, us.User, tk.Category etc...
   * @param id 资源的id
   * @param action 请求的action eg:query, create, update etc...
   */
  getResourceURL(module: string, id: string, action: string): string {
    return this.getRestServiceUrl() + '/' + module + '/' + id + '/' + action;
  }

  /**
   * 得到集合资源的请求地址.
   *
   * @param module module名称 eg:tk.Menu, us.User, tk.Category etc...
   * @param action 请求的action eg:query, create, update etc...
   */
  getCollectionURL(module: string, action: string): string {
    return this.getResourceURL(module, 'collection', action);
  }

  /**
   * 根据请求action的名称猜测后台请求的 http method, GET, PUT, POST etc..
   *
   * @param action 请求action名称
   */
  getRequestMethod(action: string): RequestMethod {
    const method = this.methodMapping.get(action);
    if (method === undefined) {
      return this.methodMapping.get('*');
    } else {
      return method;
    }
  }

  /**
   * 以 `application/x-www-form-urlencoded` 表单形式提交数据.
   *
   * @param url 提交的地址
   * @param params 提交表单里的参数
   * @param headers 提交的header，可选参数
   */
  submitFormData(url: string, params: {}, headers?: HttpHeaders): Promise<any> {
    let postHeaders = new HttpHeaders()
      .set('X-CSRF-TOKEN', this.csrfToken)
      .set('Content-Type', 'application/x-www-form-urlencoded');
    if (headers) {
      headers.keys().forEach(key => {
        postHeaders = postHeaders.append(key, headers.get(key));
      });
    }
    let body = new HttpParams({ encoder: new CustomHttpParameterEncoder() });
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const value = params[key];
        body = body.append(key, value);
      }
    }
    return this.http
      .post(url, body.toString(), { headers: postHeaders })
      .toPromise()
      .catch(this.handleError);
  }

  get csrfToken(): string {
    return this.csrfTokenData;
  }

  set csrfToken(csrfToken: string) {
    this.csrfTokenData = csrfToken;
  }

  /**
   * 请求集合类的数据接口.
   *
   * @param module module名称 eg:tk.Menu, us.User, tk.Category etc...
   * @param action 请求的action eg:query, create, update etc...
   * @param params 请求的参数，可选参数
   */
  requestCollection(module: string, action: string, params?: {}): Promise<any> {
    return this.request(module, 'collection', action, params);
  }

  /**
   * 请求后台rest接口.
   *
   * @param module module名称 eg:tk.Menu, us.User, tk.Category etc...
   * @param id 资源的id
   * @param action 请求的action eg:query, create, update etc...
   * @param params 请求的参数，可选参数
   */
  request(
    module: string,
    id: string,
    action: string,
    params: {}
  ): Promise<any> {
    const requestMethod = this.getRequestMethod(action);
    if (RequestMethod.Post === requestMethod) {
      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('X-CSRF-TOKEN', this.csrfToken);

      return this.http
        .post(this.getResourceURL(module, id, action), params, { headers })
        .toPromise()
        .catch(this.handleError);
    }
    const getParams = new HttpParams();
    for (const p in params) {
      if (params.hasOwnProperty(p)) {
        getParams.set(p, params[p]);
      }
    }
    return this.http
      .get(this.getResourceURL(module, id, action), { params: getParams })
      .toPromise()
      .catch(this.handleError);
  }

  /**
   * post请求url地址.
   *
   * @param url 请求的url地址
   * @param params 请求的参数，为可选参数
   */
  post(url: string, params?: {}, addContextPath = true): Promise<any> {
    if (addContextPath === true && !url.startsWith('http')) {
      url = url.startsWith('/')
        ? this.getContextPath() + url
        : this.getContextPath() + '/' + url;
    }
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('X-CSRF-TOKEN', this.csrfToken);
    return this.http
      .post(url, params, { headers })
      .toPromise()
      .catch(this.handleError);
  }

  /**
   * get请求url地址.
   *
   * @param url 请求的url地址
   * @param params 请求的参数，为可选参数
   * @param addContextPath 是否自动添加contextPath,默认添加配置的 contextPath
   */
  get(url: string, params?: {}, addContextPath = true): Promise<any> {
    if (addContextPath === true && !url.startsWith('http')) {
      url = url.startsWith('/')
        ? this.getContextPath() + url
        : this.getContextPath() + '/' + url;
    }
    const getParams = new HttpParams();
    for (const p in params) {
      if (params.hasOwnProperty(p)) {
        getParams.set(p, params[p]);
      }
    }
    return this.http
      .get(url, { params: getParams })
      .toPromise()
      .catch(this.handleError);
  }

  handleError(error: any): Promise<any> {
    // console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  constructor(private http: HttpClient, @Inject('env') private env) {}
}
