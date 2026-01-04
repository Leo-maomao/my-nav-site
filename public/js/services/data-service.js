/**
 * 数据服务模块
 * 封装 Supabase 数据库操作
 */
var DataService = (function() {
    var supabase = null;
    var useLocalFallback = false;

    try {
        supabase = AppConfig.getSupabaseClient();
        if (!supabase) {
            useLocalFallback = true;
        }
    } catch (e) {
        useLocalFallback = true;
    }

    // Keys
    var TOOLS_KEY = "tools_data";
    var FEEDBACK_TABLE = "feedback";
    var LOCAL_TOOLS_KEY = "nav_tools_data_v1";
    var LOCAL_FEEDBACK_KEY = "site_feedback_data";

    // Helper: Check connection or validity
    async function checkConnection() {
        if (useLocalFallback) return false;
        try {
            var { data, error } = await supabase.from('config').select('key').limit(1);
            if (error) throw error;
            return true;
        } catch (e) {
            useLocalFallback = true;
            return false;
        }
    }

    // --- Feedback Methods ---
    async function submitFeedback(content, contact) {
        if (useLocalFallback) {
            var list = JSON.parse(localStorage.getItem(LOCAL_FEEDBACK_KEY) || "[]");
            list.unshift({
                id: Date.now(),
                content: content,
                contact: contact || "无联系方式",
                created_at: new Date().toISOString()
            });
            localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(list));
            alert("反馈已提交 (本地模式)");
            return;
        }

        try {
            var { error } = await supabase
                .from(FEEDBACK_TABLE)
                .insert([{ content: content, contact: contact }]);
            
            if (error) throw error;
            alert("反馈已提交成功！");
        } catch (e) {
            alert("提交失败，请重试: " + e.message);
        }
    }

    async function getFeedback() {
        if (useLocalFallback) {
            return JSON.parse(localStorage.getItem(LOCAL_FEEDBACK_KEY) || "[]");
        }

        try {
            var { data, error } = await supabase
                .from(FEEDBACK_TABLE)
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (e) {
            return [];
        }
    }

    // --- Config/Tools Methods ---
    async function loadToolsData() {
        var localData = localStorage.getItem(LOCAL_TOOLS_KEY);
        
        if (useLocalFallback) {
            return localData ? JSON.parse(localData) : null;
        }

        try {
            var { data, error } = await supabase
                .from('config')
                .select('value')
                .eq('key', TOOLS_KEY)
                .single();

            if (error && error.code !== 'PGRST116') { 
                throw error;
            }

            if (data && data.value) {
                localStorage.setItem(LOCAL_TOOLS_KEY, JSON.stringify(data.value));
                return data.value;
            } else {
                // DB is empty, try to migrate local data
                if (localData) {
                    var parsed = JSON.parse(localData);
                    await saveToolsData(parsed);
                    return parsed;
                }
            }
        } catch (e) {
            return localData ? JSON.parse(localData) : null;
        }
        return null;
    }

    async function saveToolsData(dataJson) {
        localStorage.setItem(LOCAL_TOOLS_KEY, JSON.stringify(dataJson));
        if (useLocalFallback) return;

        try {
            var { error } = await supabase
                .from('config')
                .upsert({ key: TOOLS_KEY, value: dataJson });
            if (error) throw error;
        } catch (e) {
            // 静默失败，数据已保存在本地，不影响用户使用
        }
    }

    return {
        checkConnection: checkConnection,
        submitFeedback: submitFeedback,
        getFeedback: getFeedback,
        loadToolsData: loadToolsData,
        saveToolsData: saveToolsData
    };
})();

