/**
 * 51.la 埋点分析服务
 * 统一管理事件追踪
 */
var AnalyticsService = (function() {
    var _laInitialized = false;
    var _laEventQueue = [];

    function init() {
        if (_laInitialized) return;
        try {
            if (window.LA && typeof LA.init === 'function') {
                LA.init({ id: AppConfig.LA_ID, ck: AppConfig.LA_ID });
                _laInitialized = true;
                // 处理队列中的事件
                _laEventQueue.forEach(function(item) {
                    try {
                        LA.track(item.event, item.params);
                    } catch (e) {
                        // 静默失败
                    }
                });
                _laEventQueue = [];
            }
        } catch (e) {
            // 静默失败，不影响业务
        }
    }

    function track(eventName, params) {
        try {
            if (_laInitialized && window.LA && typeof LA.track === 'function') {
                LA.track(eventName, params || {});
            } else {
                // SDK还没准备好，加入队列
                _laEventQueue.push({ event: eventName, params: params || {} });
            }
        } catch (e) {
            // 埋点失败不影响业务
        }
    }

    // 自动初始化
    (function autoInit() {
        init();
        // 如果SDK还没加载完，监听加载完成事件
        if (!_laInitialized) {
            var laScript = document.getElementById('LA_COLLECT');
            if (laScript) {
                laScript.onload = init;
            }
            // 备用：轮询检查
            var checkLA = setInterval(function() {
                if (window.LA) {
                    init();
                    clearInterval(checkLA);
                }
            }, 100);
            // 5秒后停止轮询
            setTimeout(function() { clearInterval(checkLA); }, 5000);
        }
    })();

    return {
        init: init,
        track: track
    };
})();

// 向后兼容：提供全局 trackEvent 函数
function trackEvent(eventName, params) {
    AnalyticsService.track(eventName, params);
}

