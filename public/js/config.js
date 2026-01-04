/**
 * 全局配置管理
 * 集中管理 Supabase 等服务配置
 */
var AppConfig = (function() {
    // Supabase 配置
    // 注意：anon key 设计为公开使用，安全性依赖数据库 RLS 策略
    var SUPABASE_URL = "https://jqsmoygkbqukgnwzkxvq.supabase.co";
    var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxc21veWdrYnF1a2dud3preHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Mjk0MzYsImV4cCI6MjA4MDMwNTQzNn0.RrGVhh2TauEmGE4Elc2f3obUmZKHVdYVVMaz2kxKlW4";

    // 51.la 统计配置
    var LA_ID = "3OBuXueXb41ODfzv";

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

