import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ContributionGraph } from "./ContributionGraph";
import { StudyLogDialog } from "./StudyLogDialog";
import { CategoryPieChart } from "./CategoryPieChart";
import { StudyStats } from "./StudyStats";
import { StudyLogList } from "./StudyLogList";
import { SettingsDialog } from "./SettingsDialog";
import { BookOpen, LogOut, Settings, Moon, Sun } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface StudyLog {
  id: string;
  date: string;
  duration: number;
  category: string;
  content: string;
  createdAt: string;
}

interface DashboardProps {
  accessToken: string;
  onLogout: () => void;
}

export function Dashboard({ accessToken, onLogout }: DashboardProps) {
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<StudyLog | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchLogs();
    fetchCategories();
    
    // ダークモードの初期設定
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-48f1a8ee/user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserName(data.user.name || "ユーザー");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-48f1a8ee/logs`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-48f1a8ee/categories`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleAddLog = async (logData: Omit<StudyLog, "id" | "createdAt">) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-48f1a8ee/logs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(logData),
        }
      );

      if (response.ok) {
        await fetchLogs();
        setIsLogDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to add log:", error);
    }
  };

  const handleUpdateLog = async (logId: string, logData: Omit<StudyLog, "id" | "createdAt">) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-48f1a8ee/logs/${logId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(logData),
        }
      );

      if (response.ok) {
        await fetchLogs();
        setEditingLog(null);
      }
    } catch (error) {
      console.error("Failed to update log:", error);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-48f1a8ee/logs/${logId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        await fetchLogs();
      }
    } catch (error) {
      console.error("Failed to delete log:", error);
    }
  };

  const handleUpdateCategories = async (newCategories: string[]) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-48f1a8ee/categories`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ categories: newCategories }),
        }
      );

      if (response.ok) {
        setCategories(newCategories);
      }
    } catch (error) {
      console.error("Failed to update categories:", error);
    }
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1>ようこそ、{userName}さん</h1>
              <p className="text-sm text-muted-foreground">今日も学習を記録しましょう</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={toggleDarkMode}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </Button>
          </div>
        </div>

        {/* 統計カード */}
        <StudyStats logs={logs} />

        {/* 草カレンダー */}
        <Card>
          <CardHeader>
            <CardTitle>学習カレンダー</CardTitle>
            <CardDescription>過去1年間の学習記録</CardDescription>
          </CardHeader>
          <CardContent>
            <ContributionGraph logs={logs} />
          </CardContent>
        </Card>

        {/* カテゴリ別グラフと学習ログ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryPieChart logs={logs} />
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>学習ログ</CardTitle>
                <Button onClick={() => setIsLogDialogOpen(true)}>
                  ログを追加
                </Button>
              </div>
              <CardDescription>最近の学習記録</CardDescription>
            </CardHeader>
            <CardContent>
              <StudyLogList
                logs={logs.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)}
                onEdit={setEditingLog}
                onDelete={handleDeleteLog}
              />
            </CardContent>
          </Card>
        </div>

        {/* ダイアログ */}
        <StudyLogDialog
          open={isLogDialogOpen}
          onOpenChange={setIsLogDialogOpen}
          categories={categories}
          onSubmit={handleAddLog}
        />

        {editingLog && (
          <StudyLogDialog
            open={!!editingLog}
            onOpenChange={(open) => !open && setEditingLog(null)}
            categories={categories}
            initialData={editingLog}
            onSubmit={(data) => handleUpdateLog(editingLog.id, data)}
          />
        )}

        <SettingsDialog
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          categories={categories}
          onUpdateCategories={handleUpdateCategories}
        />
      </div>
    </div>
  );
}
