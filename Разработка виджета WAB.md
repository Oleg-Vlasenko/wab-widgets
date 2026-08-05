# Разработка виджетов ArcGIS Web AppBuilder

## Введение

Web AppBuilder (WAB) — это фреймворк для создания виджетов ArcGIS, построенный на:

- ArcGIS API for JavaScript 3.x;
- Dojo Toolkit;
- AMD-модулях;
- Dijit.

Каждый виджет представляет собой самостоятельный модуль JavaScript со своим интерфейсом, стилями и логикой.

---

# Структура виджета

Типичный виджет имеет следующую структуру:

```text
MyWidget/

    Widget.js
    Widget.html
    Widget.css
    manifest.json
    config.json
    nls/
    images/
    setting/
```

Назначение файлов:

| Файл | Назначение |
|------|------------|
| Widget.js | Основной код виджета |
| Widget.html | HTML-интерфейс |
| Widget.css | Стили |
| manifest.json | Описание виджета |
| config.json | Настройки по умолчанию |
| nls | Локализация |
| setting | Окно настройки виджета (необязательно) |

---

# AMD-модули

WAB использует AMD (Asynchronous Module Definition).

Каждая зависимость подключается через `define()`.

```javascript
define([

    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",

    "jimu/BaseWidget"

], function (

    declare,
    lang,
    on,

    BaseWidget

) {

});
```

Очень важно соблюдать одинаковый порядок:

```
define([...])

↓

function(...)
```

Иначе параметры будут указывать не на те библиотеки.

---

# BaseWidget

Практически любой виджет наследуется от `BaseWidget`.

```javascript
return declare([BaseWidget], {

});
```

После этого становятся доступны основные свойства:

```javascript
this.map
this.config
this.appConfig
this.domNode
```

---

# Жизненный цикл виджета

Наиболее часто используются следующие методы.

## constructor()

Создание объекта.

Используется редко.

---

## postCreate()

Вызывается после создания DOM.

Обычно здесь:

- создаются вспомогательные объекты;
- подписываются события;
- читается конфигурация.

```javascript
postCreate: function () {

    this.inherited(arguments);

}
```

---

## startup()

Вызывается после полной инициализации виджета.

Именно здесь рекомендуется выполнять работу с картой.

```javascript
startup: function () {

    this.inherited(arguments);

}
```

---

## destroy()

Освобождение ресурсов.

Используется для удаления обработчиков событий, таймеров и т.п.

---

# Объект this

Все методы являются методами экземпляра виджета.

Например

```javascript
this.map

this.config

this.domNode
```

доступны практически в любом методе.

---

# Потеря контекста

Самая распространённая ошибка.

Неправильно:

```javascript
this.drawToolbar.on(
    "draw-end",
    this.addGraphic
);
```

Внутри `addGraphic()` объект `this` уже не будет виджетом.

Правильно:

```javascript
this.drawToolbar.on(
    "draw-end",
    lang.hitch(this, this.addGraphic)
);
```

или

```javascript
var self = this;
```

но использование `lang.hitch()` считается предпочтительным.

---

# Работа с HTML

Элементы интерфейса описываются в `Widget.html`.

Получить к ним доступ можно несколькими способами.

Через attach-point:

```html
<div data-dojo-attach-point="myDiv"></div>
```

После этого

```javascript
this.myDiv
```

становится ссылкой на DOM-элемент.

---

# Работа с событиями

Подписка:

```javascript
on(button, "click", function(){

});
```

или

```javascript
on(this.myButton, "click",
    lang.hitch(this, this.onButtonClick));
```

---

# Работа с картой

Основной объект карты:

```javascript
this.map
```

Примеры:

```javascript
this.map.addLayer(layer);

this.map.removeLayer(layer);

this.map.graphics.add(graphic);

this.map.graphics.clear();
```

Практически вся работа производится через него.

---

# Draw Toolbar

Для рисования используется

```javascript
esri/toolbars/draw
```

Создание:

```javascript
this.drawToolbar = new Draw(this.map);
```

Подписка:

```javascript
this.drawToolbar.on(
    "draw-end",
    lang.hitch(this, this.onDrawEnd)
);
```

Запуск режима рисования:

```javascript
this.drawToolbar.activate(
    Draw.POLYGON
);
```

---

# Graphics

Добавление объекта:

```javascript
var graphic = new Graphic(
    geometry,
    symbol
);

this.map.graphics.add(graphic);
```

Удаление:

```javascript
this.map.graphics.clear();
```

---

# AJAX

В WAB обычно используются средства Dojo.

Например

```javascript
xhr(url, {

    method: "GET",

    handleAs: "json"

}).then(function(result){

});
```

или

```javascript
esriRequest(...)
```

в зависимости от задачи.

---

# Конфигурация

По умолчанию настройки виджета доступны через

```javascript
this.config
```

Если используется собственная система конфигурации, её обычно загружают в `postCreate()` и сохраняют в собственном свойстве объекта.

Например:

```javascript
this.myConfig
```

---

# Отладка

Основные инструменты:

- Console
- Network
- Sources

Полезные проверки:

```javascript
console.log(this);

console.log(this.map);

console.log(this.config);
```

---

# Рекомендуемый порядок разработки

При создании новой функции удобно придерживаться следующей последовательности:

1. Добавить элементы интерфейса в `Widget.html`.
2. Добавить стили в `Widget.css`.
3. Создать обработчики событий.
4. Реализовать взаимодействие с картой.
5. Реализовать работу с сервером (при необходимости).
6. Проверить работу через DevTools.

---

# Полезные рекомендации

- Не использовать глобальные переменные.
- Всегда использовать `lang.hitch()` при передаче методов в обработчики событий.
- Минимизировать количество логики в HTML.
- Разделять код интерфейса и бизнес-логику.
- Не изменять напрямую внутренние объекты карты без необходимости.
- После разработки удалять временные `console.log()`.
- При добавлении новых зависимостей всегда проверять соответствие списков `define()` и `function()`.

---

# Спросить

1. Что такое Asynchronous Module Definition?

2. Что за объект lang и как его используют?

3. Чем отличается разработка виджета ArcGIS Experience Builder от виджета WAB?

