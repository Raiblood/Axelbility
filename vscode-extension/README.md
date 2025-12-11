# Axelbility for VS Code

> Real-time accessibility checking for HTML files

## Features

✅ **Real-time validation** - Check accessibility while you type  
✅ **Auto-fix** - Automatically correct common issues  
✅ **WCAG compliance** - Based on WCAG 2.1 Level A/AA  
✅ **Workspace audit** - Check all HTML files at once  

## Commands

- `Axelbility: Audit Current File` - Check current HTML file (Ctrl+Alt+A)
- `Axelbility: Auto-fix Issues` - Apply automatic fixes
- `Axelbility: Audit Entire Workspace` - Check all HTML files

## Configuration

```json
{
  "axelbility.enableAutoCheck": true,
  "axelbility.strictMode": false,
  "axelbility.showWarnings": true
}
```

## Detected Issues

- Missing alt attributes on images
- Icons without aria-hidden
- Buttons without type attribute
- Form inputs without labels
- Missing page title
- Missing document language
- Generic link text
- Missing ARIA landmarks
- And more...

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Axelbility"
4. Click Install

## Usage

The extension automatically activates when you open HTML files. Issues will appear in the Problems panel.

## Requirements

- VS Code 1.85.0 or higher
- Node.js 18.x or higher

## Release Notes

### 0.1.0
- Initial release
- Basic accessibility checking
- Auto-fix functionality
- Workspace auditing

## License

MIT
