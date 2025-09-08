import { test, expect } from '@playwright/test'

test.describe('BIP39 Mnemonic Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Mnemonic Code Converter' })).toBeVisible()
  })

  test('should show security warnings', async ({ page }) => {
    await expect(page.getByText('SECURITY WARNING')).toBeVisible()
    await expect(page.getByText('OFFLINE USE RECOMMENDED')).toBeVisible()
  })

  test('should generate a mnemonic when clicked', async ({ page }) => {
    // Click the generate button
    await page.getByRole('button', { name: /generate/i }).click()
    
    // Wait for mnemonic to appear
    await expect(page.getByText('Generated Mnemonic')).toBeVisible({ timeout: 10000 })
    
    // Check that wallet information appears
    await expect(page.getByText('Wallet Information')).toBeVisible()
    await expect(page.getByText('Derivation Path')).toBeVisible()
  })

  test('should import a valid mnemonic', async ({ page }) => {
    const validMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
    
    // Find the import textarea and enter mnemonic
    await page.getByPlaceholder('Enter your 12, 15, 18, 21, or 24 word mnemonic phrase').fill(validMnemonic)
    
    // Click import button
    await page.getByRole('button', { name: 'Import Mnemonic' }).click()
    
    // Verify wallet information appears
    await expect(page.getByText('Wallet Information')).toBeVisible({ timeout: 10000 })
  })

  test('should reject invalid mnemonic', async ({ page }) => {
    const invalidMnemonic = 'invalid mnemonic phrase that will not work'
    
    // Enter invalid mnemonic
    await page.getByPlaceholder('Enter your 12, 15, 18, 21, or 24 word mnemonic phrase').fill(invalidMnemonic)
    
    // Click import button
    await page.getByRole('button', { name: 'Import Mnemonic' }).click()
    
    // Should show error
    await expect(page.getByText(/invalid mnemonic/i)).toBeVisible({ timeout: 5000 })
  })

  test('should switch between derivation standards', async ({ page }) => {
    // First generate a mnemonic
    await page.getByRole('button', { name: /generate/i }).click()
    await expect(page.getByText('Derivation Path')).toBeVisible({ timeout: 10000 })
    
    // Check BIP32 tab
    await page.getByRole('tab', { name: 'BIP32' }).click()
    await expect(page.getByText('BIP32 allows for custom derivation paths')).toBeVisible()
    
    // Check BIP84 tab
    await page.getByRole('tab', { name: 'BIP84' }).click()
    await expect(page.getByText('BIP84 defines derivation scheme')).toBeVisible()
  })

  test('should generate and display addresses', async ({ page }) => {
    // Generate mnemonic
    await page.getByRole('button', { name: /generate/i }).click()
    await expect(page.getByText('Derived Addresses')).toBeVisible({ timeout: 10000 })
    
    // Should show address table
    await expect(page.getByRole('table')).toBeVisible()
    
    // Should have at least one address row
    const rows = await page.getByRole('row').count()
    expect(rows).toBeGreaterThan(1) // Header + at least one address
  })

  test('should copy addresses to clipboard', async ({ page }) => {
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-write', 'clipboard-read'])
    
    // Generate mnemonic and wait for addresses
    await page.getByRole('button', { name: /generate/i }).click()
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 })
    
    // Find and click a copy button
    const copyButton = page.getByRole('button', { name: 'Copy address' }).first()
    await copyButton.click()
    
    // Verify success message appears
    await expect(page.getByText('Successfully copied to clipboard')).toBeVisible({ timeout: 5000 })
  })

  test('should toggle privacy screen', async ({ page }) => {
    // Generate mnemonic first
    await page.getByRole('button', { name: /generate/i }).click()
    await expect(page.getByText('Generated Mnemonic')).toBeVisible({ timeout: 10000 })
    
    // Find the privacy toggle in header
    const privacyToggle = page.getByRole('button').filter({ has: page.locator('svg') }).first()
    await privacyToggle.click()
    
    // Check if sensitive data is blurred
    const mnemonicDisplay = page.locator('.privacy-blur').first()
    await expect(mnemonicDisplay).toBeVisible()
  })

  test('should change network selection', async ({ page }) => {
    // Generate mnemonic first
    await page.getByRole('button', { name: /generate/i }).click()
    await expect(page.getByText('Wallet Information')).toBeVisible({ timeout: 10000 })
    
    // Find network selector
    const networkSelect = page.getByRole('combobox').filter({ hasText: /Bitcoin/i })
    await networkSelect.selectOption('LTC')
    
    // Should update to show Litecoin
    await expect(page.getByText('Litecoin')).toBeVisible()
  })

  test('should work offline', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true)
    
    // Generate mnemonic should still work
    await page.getByRole('button', { name: /generate/i }).click()
    await expect(page.getByText('Generated Mnemonic')).toBeVisible({ timeout: 10000 })
    
    // Addresses should still generate
    await expect(page.getByText('Derived Addresses')).toBeVisible()
  })

  test('should display QR codes', async ({ page }) => {
    // Generate mnemonic
    await page.getByRole('button', { name: /generate/i }).click()
    await expect(page.getByRole('table')).toBeVisible({ timeout: 10000 })
    
    // Click QR button for first address
    const qrButton = page.getByRole('button', { name: 'QR' }).first()
    await qrButton.click()
    
    // Should show QR modal
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('img', { name: /qr code/i })).toBeVisible()
    
    // Close modal
    await page.getByRole('button', { name: 'Close' }).click()
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
})