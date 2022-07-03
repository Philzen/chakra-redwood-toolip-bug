# Test project to demonstrate [Chakra Tooltip](https://github.com/chakra-ui/chakra-ui/tree/main/packages/tooltip) error when used in a [RedwoodJS](https://github.com/redwoodjs/redwood) test setup (reported as https://github.com/chakra-ui/chakra-ui/issues/6270)

## Install

```
git clone git@github.com:Philzen/chakra-redwood-toolip-bug.git
cd chakra-redwood-toolip-bug
yarn install
```
### See the component live on the page

`yarn rw dev`

The page with the tooltip working fine will be opened under <http://localhost:8910/>.


## See the bug

`yarn rw test TestTooltip`

Takes a while, then throws:

```
   Error name:    "TypeError"
   Error message: "Cannot read properties of undefined (reading 'colors.red.600')"
```

Some other (potentially related root cause) that is being shown if you scroll up even further:

```
  console.error
    Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
        at AuthProvider (/home/phil/prog/testing/chakra-redwood-toolip-bug/node_modules/@redwoodjs/auth/dist/AuthProvider.js:61:5)
        at MockProviders (/home/phil/prog/testing/chakra-redwood-toolip-bug/node_modules/@redwoodjs/testing/dist/web/MockProviders.js:75:3)
        at wrapper
```

## Investigation results:

* It does not matter what color you try to set for `bg` (even `#rrggbb` produces the error)
* The problem only happens on `bg`, `bgColor`, `background`, and `backgroundColor` (all other properties such as `color` work fine)
* Interestingly, the offending properties are **exactly** the properties dealt with [in this line of code](https://github.com/chakra-ui/chakra-ui/blob/main/packages/tooltip/src/tooltip.tsx#L82)
* When commenting out [Line 82 – 92](https://github.com/chakra-ui/chakra-ui/blob/main/packages/tooltip/src/tooltip.tsx#L82-L91) in that file, the problem goes away – and the component still works as expected!
* You can try it out directly in this project by commenting out the following lines in [`./node_modules/@chakra-ui/tooltip/dist/chakra-ui-tooltip.cjs.dev.js`](./node_modules/@chakra-ui/tooltip/dist/chakra-ui-tooltip.cjs.dev.js)  
  ```js
    var userDefinedBg = (_ref = (_ref2 = background != null ? background : backgroundColor) != null ? _ref2 : bg) != null ? _ref : bgColor;

    if (userDefinedBg) {
      styles.bg = userDefinedBg;
      styles[popper.popperCSSVars.arrowBg["var"]] = utils.getCSSVar(theme, "colors", userDefinedBg);
    }
  ```
* Even with these lines commented out, the component (incl. whatever backgroundColor you set) still works as expected, check it out at <http://localhost:8910/> 🤔

> This happens using Redwood 2.0.0 and ChakraUI 1.8.8
