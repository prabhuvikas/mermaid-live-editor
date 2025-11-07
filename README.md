# Mermaid Live Editor

A modern, feature-rich live editor for creating Mermaid diagrams with real-time preview, export capabilities, and extensive customization options.

## ✨ Features

### Phase 1 (MVP) - ✅ Implemented
- **Split-Pane Layout**: Resizable editor and preview panes
- **Code Editor**: Monaco editor with syntax highlighting
- **Live Preview**: Real-time Mermaid diagram rendering
- **All Diagram Types**: Support for flowcharts, sequence, class, state, ER, Gantt, and more
- **Theme Support**: Light/dark mode for both editor and diagrams
- **Settings Panel**: Customizable editor and preview preferences
- **Auto-Save**: Automatic saving to browser localStorage

### Phase 2 - ✅ Implemented
- **Export to PNG, SVG, PDF**: High-quality exports in multiple formats
- **Examples and templates library**: 11+ searchable templates
- **Enhanced persistence**: Auto-save with localStorage
- **Copy to clipboard**: Copy code and diagrams

### Phase 3 - ✅ Implemented
- **File operations**: Open and save .mmd files
- **Shareable links**: URL encoding for easy sharing
- **Keyboard shortcuts**: Full keyboard navigation support
- **Copy/Download**: Multiple clipboard operations

### Phase 4 - ✅ Implemented
- **Multi-diagram tabs**: Work with multiple diagrams simultaneously
- **Presentation mode**: Full-screen diagram viewing with navigation
- **PWA with offline support**: Install as desktop app, works offline
- **Enhanced accessibility**: ARIA labels and keyboard navigation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/prabhuvikas/mermaid-live-editor.git
cd mermaid-live-editor

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

## 📖 Usage

1. **Write Mermaid Code**: Type or paste your Mermaid diagram code in the left editor pane
2. **Live Preview**: See your diagram render in real-time on the right
3. **Multi-Tab Support**: Create multiple diagrams using the + button or Ctrl+N
4. **Export**: Export diagrams as PNG, SVG, or PDF from the Export menu
5. **Share**: Click the share button to generate a shareable URL
6. **Presentation Mode**: Click the fullscreen icon or press F11 for presentation view
7. **Examples**: Browse 11+ templates organized by diagram type
8. **Customize**: Adjust editor and preview settings to your preference

### Keyboard Shortcuts

- **Ctrl/Cmd+S**: Save diagram
- **Ctrl/Cmd+O**: Open file
- **Ctrl/Cmd+N**: New diagram/tab
- **Ctrl/Cmd+E**: Export as PNG
- **Ctrl/Cmd+K**: Open examples
- **Ctrl/Cmd+,**: Open settings
- **Ctrl/Cmd+Shift+T**: Toggle theme
- **F11 or Ctrl/Cmd+Shift+F**: Presentation mode

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Editor**: Monaco Editor
- **Diagram Rendering**: Mermaid.js
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📝 Development

See [Plan.md](./Plan.md) for the complete feature roadmap and implementation plan.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- [Mermaid.js](https://mermaid.js.org/) - Amazing diagramming library
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Powerful code editor
- React and Vite communities
