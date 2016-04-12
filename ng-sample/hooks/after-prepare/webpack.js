var path = require("path");
var shelljs = require("shelljs");

module.exports = function (logger, platformsData, projectData, hookArgs) {
    var platformData = platformsData.getPlatformData(hookArgs.platform.toLowerCase());
    var outDir = platformData.appDestinationDirectoryPath;
    process.env.PROJECT_DIR = outDir;

    var gradleScript = path.join(outDir, "../../../", "build.gradle");
    var hasGradle = shelljs.test("-e", gradleScript);

    if (hasGradle) {
        //clean up any previous settings
        shelljs.sed("-i", /aaptOptions.*\{[^\}]+\}/, "", gradleScript);
    }

    if (!process.env.WEBPACK_BUILD) {
        console.log('Not webpacking...');
        return;
    }

    return new Promise(function (resolve, reject) {
        return shelljs.exec("webpack", function(code, output) {
            if (code === 0) {
                //shelljs.rm("-rf", path.join(outDir, "app", "*"))
                shelljs.rm("-rf", path.join(outDir, "app", "main-page*"));
                shelljs.mv("-f", "bundle.js", path.join(projectData.projectDir, "app", "snapshot.js"));

                var packageJson = path.join(outDir, "app", "starter.js");
                shelljs.sed("-i", /require.*app\.js.*;/, "require('./index.js');", packageJson);

                if (hasGradle) {
                    shelljs.sed("-i", /^android\s+\{/m, 'android {\n\taaptOptions { ignoreAssetsPattern "<dir>tns_modules" }', gradleScript);
                }

                resolve();
            } else {
                console.log('webpack failed.');
                reject();
            }
        });
    });
};
