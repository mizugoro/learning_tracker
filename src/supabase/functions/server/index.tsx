import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", logger(console.log));
app.use("*", cors());

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// ユーザー登録
app.post("/make-server-48f1a8ee/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // 自動確認（メールサーバー未設定のため）
    });

    if (error) {
      console.log(`User signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // デフォルトカテゴリを作成
    const defaultCategories = ["数学", "英語", "プログラミング", "読書"];
    await kv.set(`categories:${data.user.id}`, defaultCategories);

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: "登録に失敗しました" }, 500);
  }
});

// 学習ログ追加
app.post("/make-server-48f1a8ee/logs", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "認証が必要です" }, 401);
    }

    const logData = await c.req.json();
    const logId = crypto.randomUUID();
    const logKey = `log:${user.id}:${logId}`;
    
    await kv.set(logKey, {
      id: logId,
      userId: user.id,
      date: logData.date,
      category: logData.category,
      duration: logData.duration,
      content: logData.content,
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, id: logId });
  } catch (error) {
    console.log(`Log creation error: ${error}`);
    return c.json({ error: "ログの作成に失敗しました" }, 500);
  }
});

// 学習ログ取得
app.get("/make-server-48f1a8ee/logs", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "認証が必要です" }, 401);
    }

    const logs = await kv.getByPrefix(`log:${user.id}:`);
    return c.json({ logs });
  } catch (error) {
    console.log(`Log retrieval error: ${error}`);
    return c.json({ error: "ログの取得に失敗しました" }, 500);
  }
});

// 学習ログ更新
app.put("/make-server-48f1a8ee/logs/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "認証が必要です" }, 401);
    }

    const logId = c.req.param("id");
    const logData = await c.req.json();
    const logKey = `log:${user.id}:${logId}`;
    
    const existingLog = await kv.get(logKey);
    if (!existingLog) {
      return c.json({ error: "ログが見つかりません" }, 404);
    }

    await kv.set(logKey, {
      ...existingLog,
      date: logData.date,
      category: logData.category,
      duration: logData.duration,
      content: logData.content,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true });
  } catch (error) {
    console.log(`Log update error: ${error}`);
    return c.json({ error: "ログの更新に失敗しました" }, 500);
  }
});

// 学習ログ削除
app.delete("/make-server-48f1a8ee/logs/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "認証が必要です" }, 401);
    }

    const logId = c.req.param("id");
    const logKey = `log:${user.id}:${logId}`;
    
    await kv.del(logKey);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Log deletion error: ${error}`);
    return c.json({ error: "ログの削除に失敗しました" }, 500);
  }
});

// カテゴリ取得
app.get("/make-server-48f1a8ee/categories", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "認証が必要です" }, 401);
    }

    const categories = await kv.get(`categories:${user.id}`) || [];
    return c.json({ categories });
  } catch (error) {
    console.log(`Category retrieval error: ${error}`);
    return c.json({ error: "カテゴリの取得に失敗しました" }, 500);
  }
});

// カテゴリ更新
app.put("/make-server-48f1a8ee/categories", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "認証が必要です" }, 401);
    }

    const { categories } = await c.req.json();
    await kv.set(`categories:${user.id}`, categories);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Category update error: ${error}`);
    return c.json({ error: "カテゴリの更新に失敗しました" }, 500);
  }
});

// ユーザー情報取得
app.get("/make-server-48f1a8ee/user", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "認証が必要です" }, 401);
    }

    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name
      }
    });
  } catch (error) {
    console.log(`User retrieval error: ${error}`);
    return c.json({ error: "ユーザー情報の取得に失敗しました" }, 500);
  }
});

Deno.serve(app.fetch);
