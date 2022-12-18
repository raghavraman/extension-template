import webpack from "webpack";
import path from "path";
import formatWebpackMessages from "react-dev-utils/formatWebpackMessages";
import printBuildError from "react-dev-utils/printBuildError";
import { mkdirSync, readdirSync, unlinkSync } from "fs";
import config from "./webpack.config";
import { createZip } from "./util/createZip";
import { getBuildContext } from "./util/getBuildContext";
import { checkTypes } from "./util/checkTypes";
import getBuildOutputDirectory from "./util/getBuildOutputDirectory";

(async () => {
  console.info(pinkLog(`Beginning ${process.env.NODE_ENV} build...`));
  if (!process.env.IS_SANDBOX_RELEASE && process.env.NODE_ENV !== "test") checkTypes();

  const { manifestVersion, releaseChannel, semanticVersion, browser, extension } = await getBuildContext();
  console.info(`${browser} bex-v3 @ (${semanticVersion}) ${releaseChannel.toUpperCase()} ${extension} build... \n`);

  const BUILD_DIR = getBuildOutputDirectory(process.env.NODE_ENV, extension);
  const ARTIFACTS_DIR = path.join(BUILD_DIR, "artifacts");

  webpack(config(semanticVersion, manifestVersion, releaseChannel, extension, browser), async (error) => {
    if (error) {
      if (!error.message) {
        return printErrors(error);
      }
      const messages = formatWebpackMessages({ errors: [error.message], warnings: [] });
      if (messages.errors.length > 1) {
        // Only keep the first error. Others are often indicative of the same problem,
        messages.errors.length = 1;
      }
      printErrors(new Error(messages.errors.join("\n\n")));
      return;
    }

    console.log(successLog("Build complete!"));

    // build was a success, lets create the artifacts
    if (process.env.NODE_ENV !== "test") {
      mkdirSync(ARTIFACTS_DIR, { recursive: true });

      if (process.env.NODE_ENV === "production") {
        console.log("removing map files in production build...");
        // for production builds, we want to delete the map files from the eventual zip file
        // but we want to keep them up until now so bugsnag can upload them
        const jsFiles = path.join(BUILD_DIR, "static", "js");
        const mapFiles = readdirSync(jsFiles).filter((file) => file.endsWith(".js.map"));
        mapFiles.forEach((file) => unlinkSync(path.join(jsFiles, file)));
      }

      console.log("creating zip file...");
      const zipFileName = `${ARTIFACTS_DIR}/${extension}_${browser}_${releaseChannel}_${manifestVersion}.zip`;
      await createZip(zipFileName, BUILD_DIR, {
        ignore: ["*.zip", "artifacts"],
      });
      console.log(successLog(`${zipFileName} file created!`));
      process.exit(0);
    }
  });
})();

/**
 * Print Errors that we got back from webpack
 * @param error the error provided by webpacxk
 */
function printErrors(error: Error) {
  if (process.env.TSC_COMPILE_ON_ERROR === "true") {
    printBuildError(error);
  } else {
    console.log(errorLog("Failed to compile.\n"));
    printBuildError(error);
    process.exit(1);
  }
}
