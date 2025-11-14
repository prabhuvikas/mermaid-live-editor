import { X, Search } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { TEMPLATES, getTemplatesByCategory } from '../../constants/templates';
import { Template } from '../../types';
import toast from 'react-hot-toast';

interface ExamplesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Examples = ({ isOpen, onClose }: ExamplesProps) => {
  const { setCurrentDiagram } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(getTemplatesByCategory().keys())];

  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const loadTemplate = (template: Template) => {
    setCurrentDiagram({
      id: crypto.randomUUID(),
      name: template.name,
      code: template.code,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    toast.success(`Loaded template: ${template.name}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-background border border-glow rounded-lg shadow-[0_0_30px_hsl(180_100%_50%/0.3)] w-full max-w-4xl max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-glow">
          <h2 className="text-xl font-semibold text-primary text-glow-cyan">
            Examples & Templates
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-destructive/20 hover:text-destructive rounded transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-4 border-b border-glow space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-primary/30 rounded-lg bg-muted/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-[0_0_10px_hsl(180_100%_50%/0.5)]'
                    : 'bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-[0_0_5px_hsl(180_100%_50%/0.2)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-200px)]">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No templates found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-primary/30 rounded-lg p-4 hover:border-primary hover:shadow-[0_0_15px_hsl(180_100%_50%/0.3)] transition-all duration-200 cursor-pointer bg-muted/10"
                  onClick={() => loadTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      {template.name}
                    </h3>
                    <span className="px-2 py-1 text-xs rounded bg-primary/20 text-primary border border-primary/30">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  <pre className="text-xs bg-muted/20 p-2 rounded overflow-hidden border border-primary/10">
                    <code className="text-muted-foreground line-clamp-3">
                      {template.code}
                    </code>
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
