import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Clock, Calendar, Flame, TrendingUp } from "lucide-react";

interface StudyLog {
  id: string;
  date: string;
  duration: number;
  category: string;
  content: string;
}

interface StudyStatsProps {
  logs: StudyLog[];
}

export function StudyStats({ logs }: StudyStatsProps) {
  // 総学習時間
  const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);

  // 今週の学習時間
  const getWeekStart = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // 月曜始まり
    return new Date(now.setDate(diff)).toISOString().split("T")[0];
  };

  const weekStart = getWeekStart();
  const thisWeekDuration = logs
    .filter((log) => log.date >= weekStart)
    .reduce((sum, log) => sum + log.duration, 0);

  // 連続学習日数
  const getConsecutiveDays = (): number => {
    const sortedDates = [...new Set(logs.map((log) => log.date))].sort().reverse();
    
    if (sortedDates.length === 0) return 0;

    let consecutive = 0;
    const today = new Date().toISOString().split("T")[0];
    let checkDate = new Date();

    for (let i = 0; i < sortedDates.length; i++) {
      const dateStr = checkDate.toISOString().split("T")[0];
      
      if (sortedDates[i] === dateStr) {
        consecutive++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return consecutive;
  };

  const consecutiveDays = getConsecutiveDays();

  // 学習日数
  const studyDays = new Set(logs.map((log) => log.date)).size;

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}分`;
    if (mins === 0) return `${hours}時間`;
    return `${hours}時間${mins}分`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">総学習時間</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{formatDuration(totalDuration)}</div>
          <p className="text-xs text-muted-foreground">累計の学習時間</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">今週の学習</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{formatDuration(thisWeekDuration)}</div>
          <p className="text-xs text-muted-foreground">今週の学習時間</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">連続学習日数</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{consecutiveDays}日</div>
          <p className="text-xs text-muted-foreground">継続は力なり</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">学習日数</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{studyDays}日</div>
          <p className="text-xs text-muted-foreground">総学習日数</p>
        </CardContent>
      </Card>
    </div>
  );
}
