# Change Log

All notable changes to the CodeSprout extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-24

### Added
- Machine learning model for personalized water intake recommendations
- Configuration option for water amount per drink (codeSprout.waterPerDrink)
- Additional user profile settings (age, gender, activity level, climate)
- ML-based recommendation toggle (codeSprout.useMLRecommendations)
- Enhanced data collection for ML model training
- Initial release of CodeSprout
- Virtual plant companion in the sidebar
- Hydration reminders with customizable intervals
- Streak tracking for hydration habits
- Interactive watering mechanism
- Cute animations for the plant
- Personalized water intake calculation based on height and weight
- Settings button to easily access and modify user preferences
- Volume-based hydration tracking (250ml per drink)
- Daily progress monitoring
- Manual water target override option
- Improved daily reset logic
- Time-series data storage for historical tracking
- Weekly hydration trend reporting with interactive charts
- Data export capability (JSON/CSV planned)

### Changed
- Water calculation formula simplified to weight × 35 ml
- Hydration tracking now based on actual volume consumed
- UI updated to show daily goal, consumed amount, and progress percentage
- Height now used for informational purposes only
- Improved streak calculation logic
- Enhanced data storage using time-series records
- Added reporting section with interactive chart visualization

### Fixed
- Icon display issues in VS Code Marketplace
- Updated SVG icon with proper sizing (128x128) for better visibility
- Changed icon color to blue for better visual appeal
- Removed incorrect PNG icon reference from package.json
- Package configuration issues with publisher ID and prepublish script

### Documentation
- Updated USAGE.md with detailed steps on how to use the extension
- Added UI elements section with information about the activity bar icon
- Added visual reference to the new blue icon in the usage guide

### Removed