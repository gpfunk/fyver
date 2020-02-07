import axios from "axios";
import * as semver from "semver";
import chalk from "chalk";
import { exec } from "child_process";

/**
 * Pulls in all the available versions for the package
 *
 * @param {*} pkg - the name of the package to check
 * @param {*} minVersion - the minimum version to return (optional)
 */
const fetchPackageVersions = (pkg: string, minVersion?: string | null): Promise<string[]> => {
  return new Promise((res, rej) => {
    exec(`npm view ${pkg} versions --json`, (err, output)  => {
      if (err) {
        return rej(`Failed to load versions`);
      }

      try {
        const parsed = JSON.parse(output);
        if (!minVersion) {
          return res(parsed);
        }

        const filtered = parsed.filter((version: string) => semver.gt(version, minVersion));
        return res([minVersion, ...filtered]);
      } catch (e) {
        rej(e);
      }
    });
  });
};

/**
 * Fetch in the package.json file for the version of the package
 *
 * @param {*} pkg - name of the package
 * @param {*} version - the version to fetch
 */
const fetchPackageJson = async (pkg: string, version: string) => {
  try {
    return await axios.get(`https://unpkg.com/${pkg}@${version}/package.json`);
  } catch (e) {
    return null;
  }
};

/**
 * Returns the version of the package to check if its found in the package.json
 *
 * @param {} packageToCheck - package we're looking for
 * @param {} pkg - package
 * @param {*} version - version of the package
 */
const getSupportedVersions = async (packageToCheck: string, pkg: string, version: string) => {
  const packageJson = await fetchPackageJson(pkg, version);
  if (!packageJson) {
    console.log(chalk.yellow(`Could not load package.json for ${pkg}: ${version}`));
    return;
  }

  const { devDependencies, peerDependencies } = packageJson.data;
  const peerDep = peerDependencies && peerDependencies[packageToCheck];
  const devDep = devDependencies && devDependencies[packageToCheck];
  return peerDep || devDep || null;
};

/**
 * Checks whether this version of the package supports the version of the package to check
 *
 * @param {} packageToCheck - package we're looking for
 * @param {} pkg - package
 * @param {*} version - version of the package
 */
const checkPackageVersion = async (packageToCheck: string, versionToCheck: string, pkg: string, version: string) => {
  const supportedVersions = await getSupportedVersions(packageToCheck, pkg, version);
  if (!supportedVersions) {
    return null;
  }

  return semver.satisfies(versionToCheck, supportedVersions);
};

/**
 * Returns the minimum version of the package that supports this version
 * 
 * Returns the version if it can find one (or null)
 * or false if it isn't related to that package (doesn't specify it in the package.json)
 *
 * @param {*} packageToCheck - package we're looking for
 * @param {*} versionToCheck - the version of the package we're checking support for
 * @param {*} pkg - the package
 * @param {*} versions - all the versions of the package to check
 * 
 */
const findSupportedVersion = async (packageToCheck: string, versionToCheck: string, pkg: string, versions: string[]): Promise<string | false | null> => {
  if (!versions || !versions.length) {
    return null;
  }

  const index = Math.floor(versions.length / 2);
  const version = versions[index];

  const satisfies = await checkPackageVersion(packageToCheck, versionToCheck, pkg, version);
  if (!satisfies) {
    const res = findSupportedVersion(packageToCheck, versionToCheck, pkg, versions.slice(index + 1));
    return res || (satisfies === null ? false : null);
  } else {
    const earilerSatisfied = await findSupportedVersion(packageToCheck, versionToCheck, pkg, versions.slice(0, index));
    return earilerSatisfied || version;
  }
};

/**
 * Finds the minimum version of the package that supports the react-native version
 *
 * @param {*} pkg - the package to check
 * @param {*} rawVersion - the raw semver version in the package.json file
 */
const findSupportedPackageVersion = async (packageToCheck: string, versionToCheck: string, pkg: string, minVersion?: string | null) => {
  // fetch in the versions of the package
  const versions = await fetchPackageVersions(pkg, minVersion);

  return findSupportedVersion(packageToCheck, versionToCheck, pkg, versions);
};

// return the cleaned version
const cleanVersion = (version?: string): string | undefined | null => {
  try {
    return version && semver.minVersion(version)?.version;
  } catch (e) {
    return null;
  }
};

/**
 * Attempts to find the version of the package that supports the version of the package to check
 *
 * @param {*} packageToCheck - package we're checking support of
 * @param {*} versionToCheck - version of the package we're checking for
 * @param {*} pkg - package we're checking if supports the packageToCheck
 * @param {*} minVersion - lower end of the version to check against
 */
export const checkPackage = async (packageToCheck: string, versionToCheck: string, pkg: string, minVersion?: string) => {
  const cleanedVersion = cleanVersion(minVersion);

  const version = await findSupportedPackageVersion(packageToCheck, versionToCheck, pkg, cleanedVersion);
  if (version === false) {
    console.log(chalk.grey(pkg));
    return;
  }

  if (!version) {
    console.log(chalk.red(pkg));
    return;
  }
  
  const str = minVersion
    ? [pkg, ":", minVersion, "~>", version].join(" ")
    : [pkg, ":", version].join(" ");

  console.log(chalk.green(str));
};
