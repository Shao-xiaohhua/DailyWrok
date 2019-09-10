#### 在项目中怎么运用HttpClient发送ajax
一、引入模块 @angular/common/http中的  HttpHeaders,HttpClient, HttpRequest,

```javascript
import {
  HttpHeaders,
  HttpClient,
  HttpRequest,
  HttpParams
} from '@angular/common/http';
```
> <https://angular.cn/api/common/http/HttpRequest#description> 里面有HttpRequest模块的api，用法：
> <https://angular.cn/api/common/http/HttpHeaders#set> HttpHeader模块的api
```javascript
const headers = new HttpHeaders().set( // 设置给定名称的标头值。如果标头名称已存在，则其值将替换为给定值。
      'X-CSRF-TOKEN', //标题名称
      MetaLoader.CSRF_TOKEN, //标头值，如果标头值也存在，新的标头值会覆盖原来的值，该值是 MetaLoader.CSRF_TOKEN 自定义的变量
    );
const formData = new FormData();
formData.append('file', file);
const req = new HttpRequest({
       'POST',
      environment.restServiceUrl + 'tk.File/collection/upload', // url environment.restServiceUrl 自定义的变量
      formData,
      {
        reportProgress: true,
        headers: headers,
      }
   });
  this.httpClient.request(req).subscribe(data => {
     console.log(data); //后端返回的值
   });
```
> 另一种用法和原先我们用的方法类似