satis-**fy** **ver**-sion


### Install
`npm i -g fyver`

### What it does

Tool to check if your dependencies support a certain version of a package\
Will return the minimum version you would have to upgrade the dependency to

### Useage

*If checking against package dependencies, command must be run in the same directory as the `package.json`*

```
fyver <package-to-support> <version>

   Checks all dependencies in your package.json and outputs the minimum version that supports this version of the package
   
fyver <package-to-support> <version> <package>

   Checks a specific dependency in your package.json using the currently installed version as the minimum version to check

fyver <package-to-support> <version> <package> --ignore-dep / -i

   Check a specific package regardless of the version (ie. does not have to be a dependency)
```

### Examples

`fyver react-native 0.61.0`\
`fyver react-native 0.61.0 react-native-video`\
`fyver react-native 0.61.0 react-native-video -i`
