# Introduction

AppBlocks is a tiny, fast and lightweight javascript library for building micro apps. It is designed to be used primarily as a script tag to enhance web pages with self-contained micro applications.

The goal of AppBlocks is to be a small library that provides all the necessary ingredients to develop micro apps in websites while being ridiculously easy to integrate in any project, practical and small.

Read about the [AppBlocks use case](https://agtgreg.github.io/AppBlocks/#/whyappblocks).


**[Documentation](https://agtgreg.github.io/AppBlocks/#/)**


## AppBlocks at a glance

Here is a complete example of a "Hello world" app.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My first app</title>
  </head>
  <body>

	  <!-- This is the container where our app will be rendered. -->
    <div id="app"></div>

    <!-- This is where we put the contents of our app. -->
    <template id="appTemplate">
      <p title="{data.message}">{data.message}</p>
    </template>

    <!-- Load AppBlocks. -->
    <script src="https://cdn.jsdelivr.net/npm/appblocks@2.0.3/dist/appblocks.min.js"></script>
    <!-- Initialize our app. -->
    <script>
      var app = new AppBlock({
        el: document.getElementById('app'),
        template: document.getElementById('appTemplate'),
        data: {
          message: "Hello world!"
        }
      });
    </script>

  </body>
</html>
```



## There's much more
Head over to the [Documentation](https://agtgreg.github.io/AppBlocks/#/).