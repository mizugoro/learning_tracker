[plugin:vite:import-analysis] Failed to resolve import "lucide-react" from "src/components/Dashboard.tsx". Does the file exist?
/home/mizugoro/01_study/learning_tracker/src/components/Dashboard.tsx:10:54
10 |  import { StudyLogList } from "./StudyLogList";
11 |  import { SettingsDialog } from "./SettingsDialog";
12 |  import { BookOpen, LogOut, Settings, Moon, Sun } from "lucide-react";
   |                                                         ^
13 |  import { projectId } from "../utils/supabase/info";
14 |  export function Dashboard({ accessToken, onLogout }) {
このエラーを解消して



プロジェクトのルートで以下を実行：

npm install lucide-react

