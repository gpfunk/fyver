import { checkPackage } from "./check-package";
import { loadPackageJson } from "./load-package-dependencies";

/**
 * Check a specific dependency
 */
export const checkDependency = async (packageToCheck: string, versionToCheck: string, pkg: string) => {
  const { dependencies } = loadPackageJson();
  return checkPackage(packageToCheck, versionToCheck, pkg, dependencies[pkg]);
};
