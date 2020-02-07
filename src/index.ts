import yargs from "yargs";
import { checkDependencies } from "./check-dependencies";
import { checkDependency } from "./check-dependency";
import { checkPackage } from "./check-package";
import * as semver from "semver";
import chalk from "chalk";

const argv = yargs.argv;

// the package to check for (react-native, react etc.)
const packageToCheck = argv._[0];
// the version of the package to check support for
const rawPackageVersion = argv._[1];
// the package to check if it supports the packageToCheck
const pkg = argv._[2];
// coerce the version passed in to be useable in this script 0.6 -> 0.6.0
const packageVersion = semver.coerce(rawPackageVersion)?.version;

if (!packageVersion) {
  console.log("");
  console.log(chalk.yellow(`A valid version must be passed in`));
  process.exit();
}

const runCheck = async () => {
  if (argv.dep && pkg) {
    return checkDependency(packageToCheck, packageVersion, pkg);
  }
  
  if (pkg) {
    return checkPackage(packageToCheck, packageVersion, pkg);
  }

  return checkDependencies(packageToCheck, packageVersion);
};

export const check = async () => {
  await runCheck();

  console.log("");
  console.log(chalk.yellow(`All finished up!`));
  process.exit();
};
