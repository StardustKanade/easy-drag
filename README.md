# EasyDrag.js

一个原生实现简单拖拽排序功能的 JavaScript 库

## 功能

- 支持现代浏览器和移动端设备
- 移动项目时拥有渐变动画
- 流畅的 css 动画
- 使用 typescript 编写
- 不需要其他第三方库

## 使用方法

引入 easyDrag.js

```html
<script src="./easyDrag.js"></script>
```

获取列表容器，创建类并传入参数

```html
<ul id="container">
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
</ul>
```

```js
const container = document.querySelector("#container");
easyDrag(container);
```

你也可以使用任何 Tag 元素，比如

```js
<div id="container">
  <div>item 1</div>
  <div>item 2</div>
  <div>item 3</div>
</div>
```

## Options 选项

```js
easyDrag(HTMLElement, {
  time: 200, // 动画渐变时长 ms
});
```

## 未来将会实现

- [ ] 自定义移动中元素的 css 样式
- [ ] 自定义移动中元素的动画效果
- [ ] 可设置禁止拖拽的元素
- [ ] 嵌套列表内的元素跨层级拖拽
- [ ] 不同列表元素相互拖拽
- [ ] 各个阶段的钩子函数

## License

EasyDrag is licensed under the [MIT license](github.com/Huucat/easy-drag/blob/main/LICENSE)
