import { checkPackage } from "./check-package";
import { loadPackageJson } from "./load-package-dependencies";

/**
 * Check all dependencies
 */
export const checkDependencies = async (packageToCheck: string, versionToCheck: string) => {
  const { dependencies } = loadPackageJson();
  const deps = Object.keys(dependencies);
  const promises = deps.map((key) => {
    return checkPackage(packageToCheck, versionToCheck, key, dependencies[key]);
  });
  await Promise.all(promises);
};
