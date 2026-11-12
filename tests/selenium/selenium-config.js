const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function findFirefox() {
    const candidates = [
        process.env.SE_FIREFOX_PATH,
        'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
        'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe'
    ];

    for (const candidate of candidates) {
        if (candidate && fs.existsSync(candidate)) {
            return candidate;
        }
    }

    // Detectar Firefox instalado desde Microsoft Store.
    if (process.platform === 'win32') {
        try {
            const script = [
                '$package = Get-AppxPackage -Name Mozilla.Firefox',
                'if ($package) {',
                '    Join-Path -Path $package.InstallLocation -ChildPath "VFS\\ProgramFiles\\Firefox Package Root\\firefox.exe"',
                '}'
            ].join('; ');

            const executable = execFileSync(
                'powershell.exe',
                [
                    '-NoProfile',
                    '-NonInteractive',
                    '-Command',
                    script
                ],
                {
                    encoding: 'utf8',
                    timeout: 10000,
                    windowsHide: true
                }
            ).trim();

            if (executable && fs.existsSync(executable)) {
                return executable;
            }
        } catch {
            // Continuar con la detección habitual de Selenium.
        }
    }

    return null;
}

function createDriver(browser = process.env.TEST_BROWSER || 'chrome') {
    const builder = new Builder().forBrowser(browser);

    if (browser.toLowerCase() === 'firefox') {
        const firefoxPath = findFirefox();

        if (firefoxPath) {
            builder.setFirefoxOptions(
                new firefox.Options().setBinary(firefoxPath)
            );
        }
    }

    return builder.build();
}

module.exports = { createDriver };
