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

### Phase 2 (Planned)
- Export to PNG, SVG, PDF
- Examples and templates library
- Enhanced persistence with version history
- Copy to clipboard functionality

### Phase 3 (Planned)
- File operations (open, save, drag-drop)
- Shareable links with URL encoding
- Search and replace
- Keyboard shortcuts
- Code formatting

### Phase 4 (Planned)
- Multi-diagram tabs
- AI-powered features
- Cloud storage integration
- Presentation mode
- PWA with offline support

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
3. **Customize**: Click the settings icon to adjust editor and preview preferences
4. **Toggle Theme**: Switch between light and dark modes
5. **Copy/Download**: Use toolbar buttons to copy or download your diagram code

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
