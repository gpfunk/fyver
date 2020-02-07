import * as fs from "fs";

export const loadPackageJson = () => {
  try {
    const file = fs.readFileSync("./package.json", "utf8");
    return JSON.parse(file);
  } catch (e) {
    return {};
  }
};
