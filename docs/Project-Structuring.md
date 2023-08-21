# Project Structuring
The Build Tools work on an entrypoint system that not only allows you to define multiple for a single project, but also allows for building multiple projects at the same time. Each project you're attempting to build should have at least one entrypoint and a `package.json` with at least a name and version set. Lets say we have 3 projects, 2 plugins and a theme, spread across a WordPress VIP site, we would have the following directory structure (assuming root is `wp-content`).

```
/client-mu-plugins
  /my-plugin
/plugins
  /another-cutom-plugin
/themes
  /my-theme
```

That would be very familiar for many. However, when taking entrypoints into account we would have this.

```
/client-mu-plugins
  /my-plugin
    /package.json
    /src
      /entrypoints
        /editor.js
        /frontend.js
/plugins
  /another-cutom-plugin
    /package.json
    /src
      /entrypoints
        /editor.js
/themes
  /my-theme
    /package.json
    /src
      /entrypoints
        /frontend.js
```

As you can see we do not work from a single entrypoint directory in the root of the site, but each project (plugin/theme) has their own directory with one or more entrypoint files inside. This allows us target specific projects for any build and to work on a single project (or multiple if you need to) in isolation, not having to worry or wait for all other plugins as part of the build. As you will find below, we build can build many, a few or even all from a single command.