satis*fy* *ver*sion

### What it does

Tool to check if your dependencies support a certain version of a package
Will return the minimum version you would have to upgrade the dependency to

### Useage

Check all the depencies in your package.json
`fyver react-native 0.61.0`

Check a specific dependency in your package.json using the currently installed version as the minimum version to check
`fyver react-native 0.61.0 react-native-video --dep`

Check a specific package regardless of the version (does not have to be a dependency)
`fyver react-native 0.61.0 react-native-video`


