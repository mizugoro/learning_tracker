import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface StudyLog {
  id: string;
  date: string;
  duration: number;
  category: string;
  content: string;
}

interface StudyLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  initialData?: StudyLog;
  onSubmit: (data: Omit<StudyLog, "id" | "createdAt">) => void;
}

export function StudyLogDialog({ open, onOpenChange, categories, initialData, onSubmit }: StudyLogDialogProps) {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setCategory(initialData.category);
      const hrs = Math.floor(initialData.duration / 60);
      const mins = initialData.duration % 60;
      setHours(hrs.toString());
      setMinutes(mins.toString());
      setContent(initialData.content);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
      setCategory("");
      setHours("");
      setMinutes("");
      setContent("");
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const duration = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
    
    onSubmit({
      date,
      category,
      duration,
      content,
    });

    // フォームをリセット
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    setCategory("");
    setHours("");
    setMinutes("");
    setContent("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "学習ログを編集" : "学習ログを追加"}</DialogTitle>
          <DialogDescription>
            学習内容を記録して、成長を可視化しましょう
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">日付</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">カテゴリ</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>学習時間</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="時間"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  min="0"
                  max="24"
                />
              </div>
              <span className="self-center">時間</span>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="分"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  min="0"
                  max="59"
                />
              </div>
              <span className="self-center">分</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">学習内容（メモ）</Label>
            <Textarea
              id="content"
              placeholder="今日学んだことを記録しましょう..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              キャンセル
            </Button>
            <Button type="submit" className="flex-1">
              {initialData ? "更新" : "追加"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
