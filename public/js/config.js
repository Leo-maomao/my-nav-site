/**
 * 全局配置管理
 * 集中管理 Supabase 等服务配置
 */
var AppConfig = (function() {
    // Supabase 配置
    // 注意：anon key 设计为公开使用，安全性依赖数据库 RLS 策略
    // TODO: 替换为你自己的 Supabase 项目配置
    var SUPABASE_URL = "https://your-project-id.supabase.co";
    var SUPABASE_KEY = "your-supabase-anon-key";

    // 51.la 统计配置（可选，如不需要可删除相关代码）
    // TODO: 替换为你自己的 51.la 统计 ID
    var LA_ID = "your-51la-id";

    // Supabase 客户端单例
    var _supabaseClient = null;

    function getSupabaseClient() {
        if (_supabaseClient) return _supabaseClient;
        if (window.supabase) {
            _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        }
        return _supabaseClient;
    }

    return {
        SUPABASE_URL: SUPABASE_URL,
        SUPABASE_KEY: SUPABASE_KEY,
        LA_ID: LA_ID,
        getSupabaseClient: getSupabaseClient
    };
})();

