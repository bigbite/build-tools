# Working with your assets

Each project will produce compiled style and script assets within a `dist` directory. Each entrypoint for a project will generate it's own set of assets. If we take the structure example from earlier, if we were to create a production build, we end up with...

```
/client-mu-plugins
  /my-plugin
    /dist
      /blocks
        /my-block
        /my-other-block
      /editor-rtl.css
      /editor.asset.php
      /editor.css
      /editor.css.map
      /editor.js
      /editor.js.map
      /frontend-rtl.css
      /frontend.asset.php
      /frontend.css
      /frontend.css.map
      /frontend.js
      /frontend.js.map
    /src
      /entrypoints
        /editor.js
        /frontend.js
/plugins
  /another-cutom-plugin
    /dist
      /editor-rtl.css
      /editor.asset.php
      /editor.css
      /editor.css.map
      /editor.js
      /editor.js.map
    /src
      /entrypoints
        /editor.js
/themes
  /my-theme
    /dist
      /frontend-rtl.css
      /frontend.asset.php
      /frontend.css
      /frontend.css.map
      /frontend.js
      /frontend.js.map
    /src
      /entrypoints
        /frontend.js
```

You can learn more about the generated asset files in [getting started with wp-scripts](https://developer.wordpress.org/block-editor/getting-started/devenv/get-started-with-wp-scripts/).
