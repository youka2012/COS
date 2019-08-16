# COS
A framework for Node.js servers ,with expressive middleware and ES2017 async/await syntax.

::
架构扩展:
中间件
请求处理:
@Hander
class X{
  @ResponseBody
  @('./api/v1/profile',GET)
  getPtofileById(@Param id){
    return {}
  }
}
统一管理所有hander(单例/工厂)
利用注解管理返回值
