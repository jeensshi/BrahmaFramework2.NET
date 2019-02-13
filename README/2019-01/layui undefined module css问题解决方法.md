# layui undefined module css问题解决方法

```javascript
//将原代码
return layui.link(o.dir + "css/" + e, t, n)

//修改为
return layui.link((o.dir ? o.dir : r) + "css/" + e, t, n)
```

