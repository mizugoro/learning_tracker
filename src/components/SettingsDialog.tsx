import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, Plus, Pencil, Check } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  onUpdateCategories: (categories: string[]) => void;
}

export function SettingsDialog({ open, onOpenChange, categories, onUpdateCategories }: SettingsDialogProps) {
  const [localCategories, setLocalCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    setLocalCategories([...categories]);
    setEditingIndex(null);
  }, [categories, open]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !localCategories.includes(newCategory.trim())) {
      setLocalCategories([...localCategories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (index: number) => {
    setLocalCategories(localCategories.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleStartEdit = (index: number, currentValue: string) => {
    setEditingIndex(index);
    setEditingValue(currentValue);
  };

  const handleSaveEdit = (index: number) => {
    if (editingValue.trim() && !localCategories.includes(editingValue.trim())) {
      const updatedCategories = [...localCategories];
      updatedCategories[index] = editingValue.trim();
      setLocalCategories(updatedCategories);
      setEditingIndex(null);
      setEditingValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleSave = () => {
    onUpdateCategories(localCategories);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>設定</DialogTitle>
          <DialogDescription>
            カテゴリの管理や設定を変更できます
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>カテゴリ管理</Label>
            <div className="flex gap-2">
              <Input
                placeholder="新しいカテゴリ"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <Button onClick={handleAddCategory} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>登録済みカテゴリ</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {localCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-md border bg-card"
                >
                  {editingIndex === index ? (
                    <>
                      <Input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSaveEdit(index);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveEdit(index)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancelEdit}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1">{category}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartEdit(index, category)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCategory(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
              {localCategories.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  カテゴリがありません
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              キャンセル
            </Button>
            <Button onClick={handleSave} className="flex-1">
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
