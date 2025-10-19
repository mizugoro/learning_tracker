import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface StudyLog {
  id: string;
  date: string;
  duration: number;
  category: string;
  content: string;
}

interface ContributionGraphProps {
  logs: StudyLog[];
}

export function ContributionGraph({ logs }: ContributionGraphProps) {
  // 過去365日分のデータを生成
  const generateDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    
    return days;
  };

  // 日付ごとの学習時間を計算
  const getStudyDuration = (date: Date): number => {
    const dateStr = date.toISOString().split("T")[0];
    return logs
      .filter((log) => log.date === dateStr)
      .reduce((sum, log) => sum + log.duration, 0);
  };

  // 学習時間に応じた色を取得
  const getColor = (duration: number): string => {
    if (duration === 0) return "bg-muted";
    if (duration < 60) return "bg-green-200 dark:bg-green-900";
    if (duration < 120) return "bg-green-300 dark:bg-green-700";
    if (duration < 180) return "bg-green-500 dark:bg-green-600";
    return "bg-green-700 dark:bg-green-500";
  };

  const days = generateDays();
  
  // 週ごとにグループ化
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}分`;
    if (mins === 0) return `${hours}時間`;
    return `${hours}時間${mins}分`;
  };

  return (
    <div className="overflow-x-auto">
      <TooltipProvider>
        <div className="inline-flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                const duration = getStudyDuration(day);
                return (
                  <Tooltip key={dayIndex}>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-3 h-3 rounded-sm ${getColor(duration)} transition-colors cursor-pointer hover:ring-2 hover:ring-primary`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        {formatDate(day)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {duration > 0 ? formatDuration(duration) : "学習記録なし"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </TooltipProvider>
      
      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <span>少</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
          <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700" />
          <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600" />
          <div className="w-3 h-3 rounded-sm bg-green-700 dark:bg-green-500" />
        </div>
        <span>多</span>
      </div>
    </div>
  );
}
