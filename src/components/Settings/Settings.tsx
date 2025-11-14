import { useStore } from '../../store/useStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

export const Settings = () => {
  const { settings, updateSettings, isSettingsOpen, toggleSettings } = useStore();

  return (
    <Dialog open={isSettingsOpen} onOpenChange={toggleSettings}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your editor and preview preferences
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Editor Settings */}
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Editor Settings</h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <span className="text-sm text-muted-foreground">
                      {settings.editor.fontSize}px
                    </span>
                  </div>
                  <Slider
                    id="fontSize"
                    min={10}
                    max={24}
                    step={1}
                    value={[settings.editor.fontSize]}
                    onValueChange={([value]) =>
                      updateSettings({
                        editor: { ...settings.editor, fontSize: value },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tabSize">Tab Size</Label>
                  <Select
                    value={settings.editor.tabSize.toString()}
                    onValueChange={(value) =>
                      updateSettings({
                        editor: { ...settings.editor, tabSize: parseInt(value) },
                      })
                    }
                  >
                    <SelectTrigger id="tabSize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 spaces</SelectItem>
                      <SelectItem value="4">4 spaces</SelectItem>
                      <SelectItem value="8">8 spaces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="wordWrap" className="flex flex-col gap-1">
                    <span>Word Wrap</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      Wrap long lines in the editor
                    </span>
                  </Label>
                  <Switch
                    id="wordWrap"
                    checked={settings.editor.wordWrap}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        editor: { ...settings.editor, wordWrap: checked },
                      })
                    }
                  />
                </div>
              </div>
            </section>

            <Separator />

            {/* Preview Settings */}
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Preview Settings</h3>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="mermaidTheme">Mermaid Theme</Label>
                  <Select
                    value={settings.preview.mermaidTheme}
                    onValueChange={(value) =>
                      updateSettings({
                        preview: {
                          ...settings.preview,
                          mermaidTheme: value as any,
                        },
                      })
                    }
                  >
                    <SelectTrigger id="mermaidTheme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="forest">Forest</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="base">Base</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="padding">Padding</Label>
                    <span className="text-sm text-muted-foreground">
                      {settings.preview.padding}px
                    </span>
                  </div>
                  <Slider
                    id="padding"
                    min={0}
                    max={100}
                    step={5}
                    value={[settings.preview.padding]}
                    onValueChange={([value]) =>
                      updateSettings({
                        preview: { ...settings.preview, padding: value },
                      })
                    }
                  />
                </div>
              </div>
            </section>

            <Separator />

            {/* General Settings */}
            <section className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">General Settings</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoSave" className="flex flex-col gap-1">
                    <span>Auto-Save</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      Automatically save changes to local storage
                    </span>
                  </Label>
                  <Switch
                    id="autoSave"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) =>
                      updateSettings({ autoSave: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="debounceDelay">Debounce Delay</Label>
                    <span className="text-sm text-muted-foreground">
                      {settings.debounceDelay}ms
                    </span>
                  </div>
                  <Slider
                    id="debounceDelay"
                    min={100}
                    max={2000}
                    step={100}
                    value={[settings.debounceDelay]}
                    onValueChange={([value]) =>
                      updateSettings({ debounceDelay: value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Delay before rendering diagram after typing
                  </p>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
