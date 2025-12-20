# Icon Creation Instructions

To fix the missing icon issue in the published extension, you need to create a proper PNG icon:

## Steps:

1. **Create a 128x128 PNG icon**:
   - Use the current SVG as reference
   - Name it `sprout-icon.png`
   - Place it in the `media/` directory

2. **Alternative approach**:
   - Convert the current SVG to PNG using an online converter or design tool
   - Ensure the PNG is 128x128 pixels
   - Save as `media/sprout-icon.png`

3. **Icon design guidelines**:
   - Simple, recognizable water drop shape
   - Clear contrast for visibility in both light and dark themes
   - Transparent background preferred

4. **After creating the PNG**:
   - Remove the ICON_INSTRUCTIONS.md file
   - Repackage the extension with `vsce package`
   - Test locally before republishing

This should resolve the missing icon issue in the VS Code Marketplace.