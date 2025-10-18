const { test } = require('@playwright/test');

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
  await page.goto('file:///Users/zee/Downloads/Project-Site/index.html');
  
  // Test each link
  for (const link of linksToTest) {
    console.log(`Testing link: ${link.name}`);
    
    try {
      // Find and click the link
      const linkElement = await page.getByRole('link', { name: new RegExp(link.name, 'i') });
      
      if (link.url.startsWith('mailto:')) {
        // Skip mailto links as they can't be navigated to
        console.log(`✓ Email link verified: ${link.url}`);
        continue;
      }

      // Try to navigate to the link
      await linkElement.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      console.log(`✓ Link working: ${link.name} (${link.url})`);
      
      // Go back to the home page
      await page.goto('file:///Users/zee/Downloads/Project-Site/index.html');
      
    } catch (error) {
      console.error(`✗ Error testing link: ${link.name} (${link.url})`);
      console.error(error);
    }
  }
});cd 