const { test, expect } = require('@playwright/test');

// Sites that block automated checks
const SKIP_VALIDATION_DOMAINS = [
  'facebook.com'
];

function shouldSkipValidation(url) {
  try {
    const hostname = new URL(url).hostname;
    return SKIP_VALIDATION_DOMAINS.some(domain => hostname.includes(domain));
  } catch (e) {
    return false;
  }
}

test('Check all links', async ({ page }) => {
  // Array of links to test
  const linksToTest = [
    { url: 'https://vvv-cricket.nl', name: 'Home' },
    { url: 'history.html', name: 'History' },
    { url: 'form.html', name: 'Registration Form' },
    { url: 'privacy-policy.html', name: 'Privacy Policy' },
    { url: 'https://www.instagram.com/vvvcricket/', name: 'Instagram' },
    { url: 'https://www.facebook.com/profile.php?id=100063537399644', name: 'Facebook' },
    { url: 'https://x.com/vvvCricket', name: 'Twitter' },
    { url: 'https://matchcentre.kncb.nl/matches/?entity=134453&grade=71375&season=19&team=134475', name: 'Match Center' },
    { url: 'https://www.google.com/maps/dir/?api=1&destination=VVV+Cricket+Club,+Oostzanerwerf+3,+1035+EW+Amsterdam', name: 'Oostzanerwerf Location' },
    { url: 'https://www.google.com/maps/dir/?api=1&destination=Volendammerweg+314,+1027+EA+Amsterdam,+Netherlands', name: 'Volendammerweg Location' },
    { url: 'mailto:bestuur@vvv-cricket.nl', name: 'Email Link' }
  ];

  // Start from the home page
  console.log('Starting link checks...');
  await page.goto('file:///Users/zee/Downloads/Project-Site/index.html');
  
  let checkedCount = 0;
  let successCount = 0;
  let failureCount = 0;
  const failures = [];

  // Test each link
  for (const link of linksToTest) {
    console.log(`\nTesting link ${++checkedCount}/${linksToTest.length}: ${link.name}`);
    
    try {
      if (link.url.startsWith('mailto:')) {
        console.log(`✓ Skipping email link: ${link.url}`);
        successCount++;
        continue;
      }

      if (shouldSkipValidation(link.url)) {
        console.log(`✓ Skipping validation for social media link: ${link.name} (${link.url})`);
        successCount++;
        continue;
      }

      if (link.url.startsWith('http')) {
        // For external links, try to fetch them
        const response = await page.request.get(link.url, {
          timeout: 30000,
          failOnStatusCode: true
        }).catch(e => null);

        if (response && response.ok()) {
          console.log(`✓ External link working: ${link.name} (${link.url})`);
          successCount++;
        } else {
          console.log(`✗ External link failed: ${link.name} (${link.url})`);
          failures.push({ name: link.name, url: link.url });
          failureCount++;
        }
      } else {
        // For local files, try to navigate to them
        const fullPath = new URL(link.url, 'file:///Users/zee/Downloads/Project-Site/').href;
        await page.goto(fullPath);
        await page.waitForLoadState('domcontentloaded');
        
        console.log(`✓ Local file exists: ${link.name} (${link.url})`);
        successCount++;
      }

      // Go back to the home page
      await page.goto('file:///Users/zee/Downloads/Project-Site/index.html');
      
    } catch (error) {
      console.log(`✗ Error testing link: ${link.name} (${link.url})`);
      console.log(`  Error details: ${error.message}`);
      failures.push({ name: link.name, url: link.url, error: error.message });
      failureCount++;
    }
  }

  // Final report
  console.log('\n--- Link Check Summary ---');
  console.log(`Total links checked: ${checkedCount}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failureCount}`);
  
  if (failures.length > 0) {
    console.log('\nFailed Links:');
    failures.forEach(f => {
      console.log(`- ${f.name} (${f.url})`);
      if (f.error) console.log(`  Error: ${f.error}`);
    });
  }

  // Make the test fail if any links failed
  expect(failureCount, 'Some links are broken').toBe(0);
});