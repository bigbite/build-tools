# Development & Contribution
We recommend working with [Yalc](https://github.com/wclr/yalc) for local package development. This package allows for local package development in a similar way that `npm/yarn link` works, but [aims to correct a number of issues and pitfalls](https://github.com/yarnpkg/yarn/issues/1761#issuecomment-259706202) that those bring. Here is a basic step-by-step guide for using Yalc for local package development.

1. Install Yalc globally so it can be accessed from anywhere.
```
npm i yalc -g
```

2. Clone the build-tools repo and publish the package with Yalc (don't worry, this doesn't go anywhere near npm publish)
```
git clone git@github.com:bigbite/build-tools.git
cd build-tools
yalc publish
```

3. In your test project, add the build-tools package via Yalc - this acts as a replacement for `npm i` or `yarn add`.
```
yalc add @bigbite/build-tools
```

4. Once you have made a change to build tools locally you will need to publish them. You can do this with:
```
yalc push
```
`push` is a shorthand of `yalc publish --push`, which allows you to publish and push your changes to the local store in a single command.

5. Switch to your test project and run an `update`
```
yalc update
```
This will update your test project to use the latest version from build-tools.