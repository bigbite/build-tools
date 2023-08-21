# Custom Webpack Config
_⚠️ Make sure you know what you're doing here. You may break the entire build process._

Sometimes the build-tools cannot provide all the tooling required for your project. To enable you to not require complex work arounds it is possible to extend or even replace the entire config. While the latter is not recommend and should be given even more caution than the former, it is possible.

This is done by creating a `webpack.config.js` in the root of your project and including any of the necessary changes within that.

## Extending the Config
The default behaviour of the custom config will be an extension of the default config within build-tools. This means the build-tools will provide the base and anything you add here will either be in addition or replacement of. For example, if we wanted to change the `externals` that your plugin/theme were excluding and opt for only `jQuery`, removing both `React` and `ReactDOM`, we could add the `externals` with a sole value of `jQuery`. This is a replacement when extending.

```js
// filename: /webpack.config.js
module.exports = {
  externals: 'jQuery',
};
```

## Replacing the Config
However, if you want a completely custom config without using the build-tools as the base to build on top of, you can add the `extends` flag with a value of `false` to the config as below. This will ensure you're starting from a blank config.

```js
// filename: /webpack.config.js
module.exports = {
  extends: false,
  // ...
};
```

## Entrypoint Specific Externals
In some cases you might want to have specific externals for certain entrypoints if you have multiple within your project. You can do this by providing a callback function within your `externals` and utilising that to check against what external should be allowed to load in.

```js
// filename: /webpack.config.js
module.exports = {
    externals: [
        ({ context, request, contextInfo, getResolve }, callback) => {
            if(!/editor\/.*\.js/.test(request.issuer)) {
                return callback();
            }
​
            let external = null;
​
            switch(contextInfo) {
                case 'react':
                    external = 'React';
                    break;
                case 'react-dom':
                    external = 'ReactDOM';
                    break;
            }
​
            return callback(null, external)
        }
    ]
}
```