# Working with your assets
As we're building each project as if it were its own entity, we do not create monolithic assets that cover all projects or an entire site. Instead each project will have those compiled assets within a `dist` directory. This includes both styles and scripts. Each entrypoint for a project becomes its own asset also. If we take the structure example from earlier, if we were to create a production build, we end up with...

```
/client-mu-plugins
  /my-plugin
    /dist
      /scripts
        /editor-h12h2.js
        /frontend-8sa8a.js
      /inc
        /asset-settings.php
      /src
        /entrypoints
          /editor.js
          /frontend.js
/plugins
  /another-cutom-plugin
    /dist
      /scripts
        /editor-kajsj.js
      /inc
        /asset-settings.php
      /src
        /entrypoints
          /editor.js
/themes
  /my-theme
    /dist
      /scripts
        /frontend-ha45a.js
      /inc
        /asset-settings.php
      /src
        /entrypoints
          /frontend.js
```

Notice the random hash/string after the generated assets? These are different for each production asset and are changed every time it is run to aid in cache busting when we have new assets. Understandably, you might be asked how you can retrieve that if it is randomly generated. This is where the `{project-path}/inc/asset-settings.php` file that has also been created comes in. This holds definitions that reference the filenames that have been generated so you are able to use them and use those without having to worry about updating your code each time assets are updated. Here's an example:

```php
define( 'MY_PLUGIN_EDITOR_JS', 'editor-h12h2.js' );
define( 'MY_PLUGIN_FRONTEND_JS', 'frontend-8sa8a.js' );
```

You should include these in your plugin;

```php
// my-plugin/my-plugin.php
/*
Plugin Name: My Plugin
Plugin URI: https://bigbite.net/
...etc
...etc
*/

define( 'MY_PLUGIN_DIR', rtrim( plugin_dir_path( __FILE__ ), '/' ) );

require_once MY_PLUGIN_DIR . 'src/asset-settings.php';

// Other includes, code, etc...
```

Which can then be used as such within your WordPress plugin or theme.

```php
wp_enqueue_script( 'my-plugin-editor', plugins_url( 'dist/scripts/' . MY_PLUGIN_EDITOR_JS, __FILE__ ), [], '1.0.1' );
```

These references are created by taking the `name` value from you `package.json` and combining that with the entry point and it's file type.