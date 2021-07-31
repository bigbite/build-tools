# Big Bite Build Tools
The Big Bite Build Tools aim to cater for vary needs of the team when create new sites, plugins and themes. This means we need to have a build tooling structure that allows us to develop in isolation when building a plugin or theme along side a whole site project. This package contains everything the tooling needs as well as the relevant webpack configuration to meet these needs.

# Setup
Once we have the package on a package manager, you should be able to simply use NPM to install it using the below command:

```bash
npm i -D @bigbite/build-tools 
```

In the mean time, you may need to clone the package.

### Setup Webpack.
As the package contains a dependency of `webpack` and `webpack-cli` along with all the other features in the setup, you should not need to add those to your project. All you need to do is create your `webpack.config.js` file in the root of your project and add the following:

```js
module.exports = require('@bigbite/build-tools');
```

### Additional Setup.
Copy/merge the applicable contents of the below files to their respective files in your project.

| From | To | Description |
|:--|:--|:--|
| `package.build-tools.json` | `package.json` | Holds any package information that may be applicable to running the build tools. Items such as `scripts` and dependencies. |
| `.gitignore.build-tools` | `.gitignore` | Build Tools may generate some files that don't need to be committed to a repo. They're listed in here. |

# Structuring your project
The Build Tools work on an entrypoint system that not only allows you to define multiple for a single project, but also allows for building multiple projects at the same time. Each project you're attempting to build should have at least one entrypoint. Lets say we have 3 projects, 2 plugins and a theme, spread across a WordPress VIP site, we would have the following directory structure (assuming root is `wp-content`).

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
		/src
			/entrypoints
				/editor.js
				/frontend.js
/plugins
	/another-cutom-plugin
		/src
			/entrypoints
				/editor.js
/themes
  /my-theme
	  /src
		  /endpoints
			  /frontend.js
```

As you can see we do not work from a single entrypoint directory in the root of the site, but each project (plugin/theme) has their own directory with one or more entrypoint files inside. This allows us target specific projects for any build and to work on a single project (or multiple if you need to) in isolation, not having to worry or wait for all other plugins as part of the build. As you will find below, we build can build many, a few or even all from a single command.

# Build
## Commands
The commands used for the build tools are colon notated with different observables and environment targets. A combination of any can be used in this format;

```bash
npm {observable}:{environment} 
```

| **Observables** | |
|:--|:--|
| `build` | A one-off build of the target projects.|
| `watch` | Watch for file changes in the target projects. |

| **Environments** | |
|:--|:--|
| `dev` | Development environments to allow for debugging. |
| `prod` | Production environments to keep everything lean and remove all debugging. |

**Example**

```bash
npm watch:dev
# OR
npm build:prod
```

## ..for Sites
When building in the context of a full site with multiple plugins or themes that have their own entrypoints, you have a number of options at your disposal.

### Individual site project(s) build
You can define a project by using the `project` flag when using the build command.

```bash
npm build:dev --env "project=my-plugin"
```

The `project` flag can also take comma separated values if you need to build more than one project at a given time.

```bash
npm build:dev --env "project=my-plugin,my-theme"
```

Notice that each defined project is not a full path, nor an entry point. We use the director name as the project and the build tools then look for those as defined in the [Structuring Your Project guide above](#structuring-your-project), seeking through `client-mu-plugins`,`plugins` and `themes`.

### Site-wide
If you need to build an entire sites worth of projects, which will often be the case come deployment, you can build all applicable projects in an entire site with the `all-projects` flag.

```bash
npm build:dev --env "all-projects"
```

## Getting your Assets
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
		  /endpoints
			  /frontend.js
```

Notice the random hash/string after the generated assets? These are different for each production asset and are changed every time it is run to aid in cache busting when we have new assets. Understandably, you might be asked how you can retrieve that if it is randomly generated. This is where the `{project-path}/inc/asset-settings.php` file that has also been created comes in. This holds definitions that reference the filenames that have been generated so you are able to use them and use those without having to worry about updating your code each time assets are updated. Here's an example:

```php
define( 'MY_PLUGIN_EDITOR_JS', 'editor-h12h2.js' );
define( 'MY_PLUGIN_FRONTEND_JS', 'frontend-8sa8a.js' );
```

Which can then be used as such within your WordPress plugin or theme.

```php
wp_enqueue_script( 'my-plugin-editor', plugins_url( 'dist/scripts/' . MY_PLUGIN_EDITOR_JS, __FILE__ ), [], '1.0.1' );
```

# Contributing
I'd recommend working with [Yalc](https://github.com/wclr/yalc) for local package development. I will add more on this later and general contribution later.
