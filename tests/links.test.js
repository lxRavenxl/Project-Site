// Playwright link checker
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function isExternal(href) {
    return /^https?:\/\//i.test(href);
}

function isMailto(href) {
    return /^mailto:/i.test(href);
}

function isJs(href) {
    return /^javascript:/i.test(href);
}

test('check all <a> links from index.html', async ({ page, request }) => {
    const indexPath = path.resolve(__dirname, '..', 'index.html');
    await page.goto('file://' + indexPath);

    const anchors = await page.$$eval('a[href]', els => els.map(e => ({ href: e.getAttribute('href'), text: (e.textContent||'').trim() })) );

    if (!anchors.length) {
        test.info().annotations.push({ type: 'note', description: 'No links found on page' });
    }

    const failures = [];

    for (const a of anchors) {
        const href = a.href;
        const text = a.text || href;

        if (!href || href.startsWith('#') || isMailto(href) || isJs(href)) {
            // skip anchors, mailto, javascript
            continue;
        }

        if (isExternal(href)) {
            // external link: use Playwright request to check status
            try {
                const resp = await request.get(href, { timeout: 15000 });
                const status = resp.status();
                if (status >= 400) {
                    failures.push({ href, text, reason: `status ${status}` });
                }
            } catch (err) {
                failures.push({ href, text, reason: err.message });
            }
        } else {
            // local relative link: resolve to disk path and check existence
            // handle root-leading paths ("/form.html") by treating them relative to repo root
            const repoRoot = path.resolve(__dirname, '..');
            const cleaned = href.replace(/^\//, '');
            const target = path.join(repoRoot, cleaned);
            if (!fs.existsSync(target)) {
                failures.push({ href, text, reason: 'file not found: ' + target });
            }
        }
    }

    if (failures.length) {
        console.error('Broken links found:');
        for (const f of failures) console.error(` - ${f.href} (${f.text}): ${f.reason}`);
    }

    expect(failures.length, 'No broken links').toBe(0);
});