// Data Service: Encapsulates Database Logic (Supabase)
var DataService = (function() {
    var SUPABASE_URL = "https://aexcnubowsarpxkohqvv.supabase.co";
    // User provided key
    var SUPABASE_KEY = "sb_publishable_YciLcY3_xL7koCNRhXItoQ_K-78060C"; 
    
    var supabase = null;
    var useLocalFallback = false;

    try {
        if (window.supabase) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log("Supabase initialized");
        } else {
            console.error("Supabase SDK not loaded");
            useLocalFallback = true;
        }
    } catch (e) {
        console.error("Supabase Init Error:", e);
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
            console.warn("Supabase Connection Failed (using fallback):", e.message);
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
            console.error("Submit Error:", e);
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
            console.error("Get Feedback Error:", e);
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
                    console.log("Migrating local data to cloud...");
                    var parsed = JSON.parse(localData);
                    await saveToolsData(parsed);
                    return parsed;
                }
            }
        } catch (e) {
            console.warn("Load Tools Error (using local cache):", e);
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
            console.log("Tools data synced to cloud");
        } catch (e) {
            console.error("Save Tools Error:", e);
            alert("云端同步失败，数据已保存在本地: " + e.message);
        }
    }

    // Expose window.DataService for backward compatibility if needed, or just return
    return {
        checkConnection: checkConnection,
        submitFeedback: submitFeedback,
        getFeedback: getFeedback,
        loadToolsData: loadToolsData,
        saveToolsData: saveToolsData
    };
})();

// 顶部时间（翻页时钟）
(function () {
    var dateEl = document.getElementById("navDate");
    var extraEl = document.getElementById("navExtra");

    var flipHour = document.getElementById("flipHour");
    var flipMin = document.getElementById("flipMin");
    var flipSec = document.getElementById("flipSec");

    if (!flipHour || !flipMin || !flipSec) return;

    // Helper: 更新单个翻页单元
    function updateFlipUnit(unitEl, newValue) {
        var currentVal = unitEl.getAttribute("data-val") || "00";
        if (newValue === currentVal) return;

        // 设置新值
        unitEl.setAttribute("data-val", newValue);

        // 创建动画元素
        var top = unitEl.querySelector(".flip-top");
        var bottom = unitEl.querySelector(".flip-bottom");

        // 1. 设置动画前的状态
        var animTop = document.createElement("div");
        animTop.className = "flip-top flip-anim-top";
        animTop.textContent = currentVal;

        var animBottom = document.createElement("div");
        animBottom.className = "flip-bottom flip-anim-bottom";
        animBottom.textContent = newValue;

        unitEl.appendChild(animTop);
        unitEl.appendChild(animBottom);

        // 2. 更新静态底层的值（新值在下，但在动画层覆盖下不可见，直到动画结束）
        // Top 立即更新为新值（被 animTop 遮挡）
        top.textContent = newValue;
        // Bottom 暂时保持旧值（被 animBottom 遮挡前可见），动画结束后再更新

        // 3. 动画结束后清理
        setTimeout(function() {
            if(unitEl.contains(animTop)) unitEl.removeChild(animTop);
            if(unitEl.contains(animBottom)) unitEl.removeChild(animBottom);
            // 动画结束，更新底部为新值
            bottom.textContent = newValue;
        }, 600); // match CSS animation duration
    }

    var weekMap = ["日", "一", "二", "三", "四", "五", "六"];
    var tianGan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    var diZhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    var lunarMonthNames = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];

    function lunarDayName(d) {
      var nStr1 = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
      var nStr2 = ["初", "十", "廿", "三十"];
      if (d === 10) return "初十";
      if (d === 20) return "二十";
      if (d === 30) return "三十";
      var two = Math.floor(d / 10);
      var one = d % 10;
      return nStr2[two] + nStr1[one];
    }

    function pad(n) {
      return n < 10 ? "0" + n : "" + n;
    }

    function tick() {
      var now = new Date();
      var hh = pad(now.getHours());
      var mm = pad(now.getMinutes());
      var ss = pad(now.getSeconds());

      updateFlipUnit(flipHour, hh);
      updateFlipUnit(flipMin, mm);
      updateFlipUnit(flipSec, ss);

      var y = now.getFullYear();
      var m = pad(now.getMonth() + 1);
      var d = pad(now.getDate());
      var week = "周" + weekMap[now.getDay()];
      if (dateEl) dateEl.textContent = y + " 年 " + m + " 月 " + d + " 日";
      
      if (extraEl) {
        var ganIndex = (y - 4) % 10;
        var zhiIndex = (y - 4) % 12;
        if (ganIndex < 0) ganIndex += 10;
        if (zhiIndex < 0) zhiIndex += 12;
        var ganzhiYear = tianGan[ganIndex] + diZhi[zhiIndex] + "年";
        var lunarMonthName = lunarMonthNames[now.getMonth()] || "";
        var lunarDayStr = lunarDayName(now.getDate());
        extraEl.textContent = ganzhiYear + " · " + lunarMonthName + "月" + lunarDayStr + " · " + week;
      }
    }

    tick();
    setInterval(tick, 1000);
})();

// 搜索区域（顶部 tabs + 引擎列表 + 实际搜索逻辑）
(function () {
    var tabsEl = document.getElementById("searchTabs");
    var enginesEl = document.getElementById("searchEngines");
    var inputEl = document.getElementById("searchMainInput");
    var searchBtnEl = document.getElementById("searchMainButton");
    var arrowEl = document.getElementById("searchArrow");
    var mainEl = document.querySelector(".search-main");
    if (!tabsEl || !enginesEl || !inputEl || !arrowEl || !mainEl) return;

    var config = {
      common: {
        placeholder: "输入关键词搜索",
        engines: ["站内", "Bing", "百度", "Google", "Perplexity"]
      },
      search: {
        placeholder: "输入关键词搜索",
        engines: ["Bing", "百度", "Google", "Perplexity", "YOU", "360", "搜狗", "神马"]
      },
      community: {
        placeholder: "输入关键词搜索",
        engines: ["Hugging Face", "GitHub", "飞桨", "魔搭", "和鲸", "掘金", "知乎"]
      },
      image: {
        placeholder: "输入关键词搜索",
        engines: ["文心一格", "花瓣AI圈", "Civitai", "OpenArt", "NightCafe", "DeviantArt", "Lexica"]
      }
    };

    var activeTab = "common";
    var activeEngine = "站内";

    function updatePlaceholder() {
      if (!inputEl) return;
      var text = "";
      if (activeEngine === "站内") {
        text = "站内 AI 工具搜索";
      } else if (activeEngine) {
        text = "在 " + activeEngine + " 中搜索";
      } else {
        var data = config[activeTab];
        text = data && data.placeholder ? data.placeholder : "输入关键词搜索";
      }
      inputEl.placeholder = text;
    }

    // 实际执行搜索
    function performSearch() {
      if (!inputEl) return;
      var kw = inputEl.value.trim();
      if (!kw) return;

      // 1）站内搜索：在工具卡片中查找并高亮
      if (activeEngine === "站内") {
        var cards = document.querySelectorAll(".tool-card");
        if (!cards.length) return;

        Array.prototype.forEach.call(cards, function (c) {
          c.classList.remove("tool-card-highlight");
        });

        var firstMatch = null;
        var lower = kw.toLowerCase();

        Array.prototype.forEach.call(cards, function (c) {
          var text = (c.textContent || "").toLowerCase();
          if (text.indexOf(lower) !== -1) {
            c.classList.add("tool-card-highlight");
            if (!firstMatch) firstMatch = c;
          }
        });

        if (firstMatch) {
          firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          alert("没有找到与「" + kw + "」相关的工具，换个关键词试试～");
        }
        return;
      }

      // 2）外部搜索引擎：根据当前引擎打开新标签页
      var map = {
        "Bing": "https://www.bing.com/search?q=",
        "百度": "https://www.baidu.com/s?wd=",
        "Google": "https://www.google.com/search?q=",
        "Perplexity": "https://www.perplexity.ai/search?q=",
        "YOU": "https://you.com/search?q=",
        "360": "https://www.so.com/s?q=",
        "搜狗": "https://www.sogou.com/web?query=",
        "神马": "https://so.m.sm.cn/s?q=",
        "Hugging Face": "https://huggingface.co/search?q=",
        "GitHub": "https://github.com/search?q=",
        "飞桨": "https://www.paddlepaddle.org.cn/search?query=",
        "魔搭": "https://modelscope.cn/search?query=",
        "和鲸": "https://www.heywhale.com/search?keyword=",
        "掘金": "https://juejin.cn/search?query=",
        "知乎": "https://www.zhihu.com/search?q=",
        "文心一格": "https://yige.baidu.com/search?query=",
        "花瓣AI圈": "https://huaban.com/search/?q=",
        "Civitai": "https://civitai.com/search?query=",
        "OpenArt": "https://openart.ai/search?term=",
        "NightCafe": "https://creator.nightcafe.studio/search?q=",
        "DeviantArt": "https://www.deviantart.com/search?q=",
        "Lexica": "https://lexica.art/?q="
      };

      var base = map[activeEngine] || "https://www.bing.com/search?q=";
      var url = base + encodeURIComponent(kw);
      window.open(url, "_blank", "noopener,noreferrer");
    }

    function renderEngines() {
      var data = config[activeTab];
      updatePlaceholder();
      enginesEl.innerHTML = "";
      var activeSpan = null;
      data.engines.forEach(function (name) {
        var span = document.createElement("span");
        span.className = "search-engine-item" + (name === activeEngine ? " is-active" : "");
        span.textContent = name;
        span.addEventListener("click", function () {
          activeEngine = name;
          renderEngines();
        });
        enginesEl.appendChild(span);
        if (name === activeEngine) {
          activeSpan = span;
        }
      });

      // 根据当前选中的搜索引擎，移动小箭头
      if (activeSpan) {
        var mainRect = mainEl.getBoundingClientRect();
        var spanRect = activeSpan.getBoundingClientRect();
        var center = spanRect.left + spanRect.width / 2 - mainRect.left;
        arrowEl.style.left = center + "px";
      }
    }

    Array.prototype.forEach.call(tabsEl.querySelectorAll(".search-tab"), function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-key");
        if (!config[key]) return;
        activeTab = key;
        activeEngine = config[key].engines[0];
        Array.prototype.forEach.call(tabsEl.querySelectorAll(".search-tab"), function (t) {
          t.classList.toggle("is-active", t === tab);
        });
        renderEngines();
      });
    });

    renderEngines();
    
    inputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        performSearch();
      }
    });

    if (searchBtnEl) {
      searchBtnEl.addEventListener("click", function () {
        performSearch();
      });
    }

    // 点击空白处时清除站内搜索高亮
    document.addEventListener("click", function (e) {
      var target = e.target;
      // 如果点击在搜索区域或工具卡片内，则不清除
      if (
        target.closest(".search-section-inner") ||
        target.closest(".search-main") ||
        target.closest(".search-engines") ||
        target.closest(".search-tabs") ||
        target.closest(".tool-card")
      ) {
        return;
      }
      var cards = document.querySelectorAll(".tool-card-highlight");
      Array.prototype.forEach.call(cards, function (c) {
        c.classList.remove("tool-card-highlight");
      });
    });
})();

// 工具分类渲染 & 配置管理
(function () {
    var containerEl = document.getElementById("toolListContainer");
    var sidebarEl = document.querySelector(".side-menu");
    var configBtn = document.getElementById("configToggleBtn");
    if (!containerEl) return;

    var isConfigMode = false;

    // Modal Logic
    var modalOverlay = document.getElementById("configModal");
    var modalCloseBtn = document.getElementById("modalCloseBtn");
    var modalCancelBtn = document.getElementById("modalCancelBtn");
    var modalConfirmBtn = document.getElementById("modalConfirmBtn");
    var modalTitle = document.getElementById("modalTitle");
    var modalBody = document.getElementById("modalBody");
    var onModalConfirm = null;

    function closeModal() {
        modalOverlay.classList.remove("is-visible");
        setTimeout(function() { modalBody.innerHTML = ""; }, 200);
    }

    function showModal(title, fields, confirmCallback, isDanger) {
        modalTitle.textContent = title;
        modalBody.innerHTML = "";
        onModalConfirm = confirmCallback;

        if (isDanger) {
            modalConfirmBtn.classList.add("danger");
            modalConfirmBtn.textContent = "删除";
        } else {
            modalConfirmBtn.classList.remove("danger");
            modalConfirmBtn.textContent = "确定";
        }

        if (typeof fields === "string") {
            var p = document.createElement("p");
            p.style.fontSize = "14px";
            p.style.color = "#475569";
            p.textContent = fields;
            modalBody.appendChild(p);
        } else {
            fields.forEach(function(field) {
                var group = document.createElement("div");
                group.className = "form-group";
                var label = document.createElement("label");
                label.className = "form-label";
                label.textContent = field.label;
                var input = document.createElement("input");
                input.className = "form-input";
                input.value = field.value || "";
                input.placeholder = field.placeholder || "";
                input.setAttribute("data-key", field.key);
                if (field.type) input.type = field.type;
                group.appendChild(label);
                group.appendChild(input);
                modalBody.appendChild(group);
            });
        }

        modalOverlay.classList.add("is-visible");
        var firstInput = modalBody.querySelector("input");
        if (firstInput) setTimeout(function(){ firstInput.focus(); }, 50);
    }

    if (modalCloseBtn) modalCloseBtn.onclick = closeModal;
    if (modalCancelBtn) modalCancelBtn.onclick = closeModal;
    if (modalOverlay) modalOverlay.onclick = function(e) { if (e.target === modalOverlay) closeModal(); };
    
    if (modalConfirmBtn) {
        modalConfirmBtn.onclick = function() {
            if (onModalConfirm) {
                var inputs = modalBody.querySelectorAll("input");
                if (inputs.length > 0) {
                    var data = {};
                    inputs.forEach(function(input) {
                        data[input.getAttribute("data-key")] = input.value.trim();
                    });
                    onModalConfirm(data);
                } else {
                    onModalConfirm();
                }
            }
            closeModal();
        };
    }

    // 默认数据 (Seed Data) - 使用全局变量
    var defaultData = window.DEFAULT_TOOLS_DATA || [];

    // Async Initialization
    var currentData = defaultData;
    
    async function init() {
        // Load Data (Supabase -> Local)
        var cloudData = await DataService.loadToolsData();
        
        if (cloudData) {
            currentData = cloudData;
        } else {
            // First run fallback
            currentData = defaultData;
        }
        
        renderAll(currentData);
        
        // Check Connection Visual
        DataService.checkConnection().then(function(ok) {
            if(!ok) console.warn("Running in offline/local mode");
        });
    }
    init();

    // 加载最近访问
    var RECENT_KEY = "nav_recent_tools_v1";
    function loadRecent() {
        var saved = localStorage.getItem(RECENT_KEY);
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { console.error("Failed to parse recent tools", e); }
        }
        return [];
    }

    // 添加到最近访问
    function addToRecent(item) {
        if (!item || !item.name) return;
        var list = loadRecent();
        list = list.filter(function(r) { return r.name !== item.name; });
        list.unshift(item);
        if (list.length > 10) list = list.slice(0, 10);
        localStorage.setItem(RECENT_KEY, JSON.stringify(list));
        renderAll(currentData);
    }

    function saveData(data) {
        currentData = data;
        DataService.saveToolsData(data); // Async save
        renderAll(data);
    }

    function renderAll(data) {
        renderSidebar(data);
        renderTools(data);
    }

    function renderSidebar(data) {
        if (!sidebarEl) return;
        sidebarEl.innerHTML = "";
        
        data.forEach(function(cat, index) {
            var li = document.createElement("li");
            li.setAttribute("data-section-id", "tool-section-" + cat.key);
            
            var inner = document.createElement("div");
            inner.className = "side-menu-inner";
            inner.innerHTML = cat.icon + " " + cat.name;
            
            var arrow = document.createElement("i");
            arrow.className = "ri-arrow-right-s-line side-menu-arrow";

            li.appendChild(inner);
            li.appendChild(arrow);

            var actions = document.createElement("div");
            actions.className = "sidebar-item-actions";
            
            var editBtn = document.createElement("div");
            editBtn.className = "sidebar-action-btn edit";
            editBtn.innerHTML = '<i class="ri-edit-line"></i>';
            editBtn.title = "编辑分组";
            editBtn.onclick = function(e) { e.stopPropagation(); editGroup(index); };

            var delBtn = document.createElement("div");
            delBtn.className = "sidebar-action-btn delete";
            delBtn.innerHTML = '<i class="ri-delete-bin-line"></i>';
            delBtn.title = "删除分组";
            delBtn.onclick = function(e) { e.stopPropagation(); deleteGroup(index); };

            actions.appendChild(editBtn);
            actions.appendChild(delBtn);
            li.appendChild(actions);

            li.addEventListener("click", function (event) {
                if (isConfigMode && event.target.closest(".sidebar-item-actions")) return;
                var targetId = li.getAttribute("data-section-id");
                if (!targetId) return;
                var target = document.getElementById(targetId);
                if (!target) return;
                var rect = target.getBoundingClientRect();
                var top = rect.top + window.scrollY - 12;
                window.scrollTo({ top: top, behavior: "smooth" });
            });

            sidebarEl.appendChild(li);
        });

        var addLi = document.createElement("div");
        addLi.className = "sidebar-add-btn";
        addLi.innerHTML = "+ 新增分组";
        addLi.onclick = addGroup;
        sidebarEl.appendChild(addLi);
    }

    function renderTools(data) {
        containerEl.innerHTML = "";
        
        // Render Recent
        var recentList = loadRecent();
        if (recentList.length > 0) {
            var recentCat = {
                key: "recent",
                name: "最近访问",
                icon: '<i class="ri-history-line"></i>',
                items: recentList
            };
            renderCategory(recentCat, -1, true); 
        }

        data.forEach(function(cat, index) {
            renderCategory(cat, index, false);
        });
    }

    function renderCategory(cat, catIndex, isReadOnly) {
        var section = document.createElement("section");
        section.className = "tool-section";
        section.id = "tool-section-" + cat.key;

        var header = document.createElement("div");
        header.className = "tool-section-header";
        header.innerHTML = '<span class="tool-tag-icon">' + cat.icon + '</span><span class="tool-list-title">' + cat.name + '</span>';
        section.appendChild(header);

        var grid = document.createElement("div");
        grid.className = "tool-grid";

        if (cat.items && cat.items.length) {
            cat.items.forEach(function(item, itemIndex) {
                var card = document.createElement("div");
                card.className = "tool-card";
                
                var link = document.createElement("a");
                link.style.display = "flex";
                link.style.alignItems = "center";
                link.style.width = "100%";
                link.style.textDecoration = "none";
                link.style.color = "inherit";
                
                link.href = item.link || "#";
                link.target = item.link ? "_blank" : "_self";
                link.rel = "noopener noreferrer";
                
                link.onclick = function(e) {
                    if (isConfigMode) {
                        e.preventDefault();
                    } else {
                        if (!isReadOnly) addToRecent(item); // Only record if from main list
                    }
                };

                var iconUrl = "https://www.google.com/s2/favicons?domain_url=" + (item.link || "") + "&sz=64";
                var iconInner = '<img src="' + iconUrl + '" alt="' + item.name + '" loading="lazy" />';

                link.innerHTML =
                    '<div class="tool-card-header" style="width:100%;">' + 
                    '<div class="tool-card-icon">' + iconInner + '</div>' +
                    '<div class="tool-card-body"><div class="tool-card-name">' + item.name + '</div>' +
                    '<div class="tool-card-desc">' + (item.desc || "") + '</div></div>' +
                    '</div>';
                
                var img = link.querySelector("img");
                if (img) {
                    img.onerror = function () {
                        var parent = img.parentNode;
                        if (parent) {
                            parent.classList.add("has-fallback");
                            var firstLetter = (item.name || "A")[0].toUpperCase();
                            parent.innerHTML = "<span>" + firstLetter + "</span>";
                        }
                    };
                }

                card.appendChild(link);

                if (!isReadOnly) {
                    var actions = document.createElement("div");
                    actions.className = "tool-card-actions";
                    
                    var editBtn = document.createElement("div");
                    editBtn.className = "tool-action-btn edit";
                    editBtn.innerHTML = '<i class="ri-edit-line"></i>';
                    editBtn.onclick = function(e) { e.stopPropagation(); editTool(catIndex, itemIndex); };

                    var delBtn = document.createElement("div");
                    delBtn.className = "tool-action-btn delete";
                    delBtn.innerHTML = '<i class="ri-delete-bin-line"></i>';
                    delBtn.onclick = function(e) { e.stopPropagation(); deleteTool(catIndex, itemIndex); };

                    actions.appendChild(editBtn);
                    actions.appendChild(delBtn);
                    card.appendChild(actions);
                }

                grid.appendChild(card);
            });
        } else {
            var empty = document.createElement("div");
            empty.textContent = "暂无工具";
            empty.style.fontSize = "12px";
            empty.style.color = "#9ca3af";
            empty.style.padding = "10px";
            grid.appendChild(empty);
        }

        if (!isReadOnly) {
            var addBtn = document.createElement("div");
            addBtn.className = "tool-card-add";
            addBtn.innerHTML = '<i class="ri-add-line" style="font-size:24px;"></i><span style="font-size:12px;">添加工具</span>';
            addBtn.onclick = function() { addTool(catIndex); };
            grid.appendChild(addBtn);
        }

        section.appendChild(grid);
        containerEl.appendChild(section);
    }

    // Logic (Config)
    function toggleMode() {
        isConfigMode = !isConfigMode;
        document.body.classList.toggle("is-config-mode", isConfigMode);
        configBtn.classList.toggle("is-active", isConfigMode);
    }

    function addGroup() {
        showModal("新增分组", [
            { label: "分组名称", key: "name", placeholder: "例如：AI视频工具" },
            { label: "唯一标识 (Key)", key: "key", value: "group_" + Date.now() },
            { label: "图标类名 (Remix Icon)", key: "icon", value: "ri-folder-line", placeholder: "ri-folder-line" }
        ], function(data) {
            if (!data.name || !data.key) return;
            currentData.push({ key: data.key, name: data.name, icon: '<i class="' + (data.icon || 'ri-folder-line') + '"></i>', items: [] });
            saveData(currentData);
        });
    }

    function editGroup(index) {
        var cat = currentData[index];
        var iconClassMatches = cat.icon.match(/class="([^"]+)"/);
        var currentIcon = iconClassMatches ? iconClassMatches[1] : "ri-folder-line";
        showModal("编辑分组", [
            { label: "分组名称", key: "name", value: cat.name },
            { label: "图标类名 (Remix Icon)", key: "icon", value: currentIcon }
        ], function(data) {
            if (data.name) cat.name = data.name;
            if (data.icon) cat.icon = '<i class="' + data.icon + '"></i>';
            saveData(currentData);
        });
    }

    function deleteGroup(index) {
        showModal("删除分组", "确定要删除这个分组及其下所有工具吗？此操作不可恢复。", function() {
            currentData.splice(index, 1);
            saveData(currentData);
        }, true);
    }

    function addTool(catIndex) {
        showModal("添加工具", [
            { label: "工具名称", key: "name", placeholder: "例如：ChatGPT" },
            { label: "链接地址", key: "link", value: "https://", placeholder: "https://..." },
            { label: "简短描述", key: "desc", placeholder: "一句话描述功能..." }
        ], function(data) {
            if (!data.name) return;
            currentData[catIndex].items.push({ name: data.name, link: data.link, desc: data.desc, icon: "" });
            saveData(currentData);
        });
    }

    function editTool(catIndex, toolIndex) {
        var item = currentData[catIndex].items[toolIndex];
        showModal("编辑工具", [
            { label: "工具名称", key: "name", value: item.name },
            { label: "链接地址", key: "link", value: item.link },
            { label: "简短描述", key: "desc", value: item.desc }
        ], function(data) {
            if (data.name) item.name = data.name;
            item.link = data.link;
            item.desc = data.desc;
            saveData(currentData);
        });
    }

    function deleteTool(catIndex, toolIndex) {
        showModal("删除工具", "确定要删除这个工具吗？", function() {
            currentData[catIndex].items.splice(toolIndex, 1);
            saveData(currentData);
        }, true);
    }

    if (configBtn) configBtn.addEventListener("click", toggleMode);
    renderAll(currentData);

})();

// 自动获取天气（IP 定位 + 缓存）
(function () {
    var nameEl = document.getElementById("weatherCityName");
    var updateTimeEl = document.getElementById("weatherUpdateTime");
    var tempEl = document.getElementById("weatherTemp");
    var descEl = document.getElementById("weatherDesc");
    var iconEl = document.getElementById("weatherIcon");
    
    // 未来几天气温趋势图
    var chartSvgEl = document.getElementById("weatherChart");
    var chartHighLineEl = document.getElementById("weatherChartLineHigh");
    var chartLowLineEl = document.getElementById("weatherChartLineLow");
    var chartAreaEl = document.getElementById("weatherChartArea");
    var chartLabelsEl = document.getElementById("weatherChartLabels");
    var chartIconsHighEl = document.getElementById("weatherChartIconsHigh");
    var chartTempsHighEl = document.getElementById("weatherChartTempsHigh");
    var chartTempsLowEl = document.getElementById("weatherChartTempsLow");
    var chartIconsLowEl = document.getElementById("weatherChartIconsLow");
    var chartTitleEl = document.getElementById("weatherForecastTitle");

    var iconMap = {
      "Clear": "ri-sun-line", "Sunny": "ri-sun-line",
      "Partly cloudy": "ri-sun-cloudy-line",
      "Cloudy": "ri-cloudy-line", "Overcast": "ri-cloudy-2-line",
      "Mist": "ri-mist-line", "Fog": "ri-foggy-line", "Haze": "ri-haze-line",
      "Rain": "ri-rainy-line", "Light rain": "ri-drizzle-line", "Moderate rain": "ri-rainy-fill", "Heavy rain": "ri-heavy-showers-line",
      "Snow": "ri-snowy-line", "Light snow": "ri-snowy-line",
      "Thunder": "ri-thunderstorms-line", "Thunderstorm": "ri-thunderstorms-fill"
    };

    function renderWeather(data) {
        if (!data) return;
        var current = data.current_condition && data.current_condition[0];
        var nearest = data.nearest_area && data.nearest_area[0];
        if (!current) return;

        var city = "本地";
        if (nearest && nearest.areaName && nearest.areaName[0]) {
            city = nearest.areaName[0].value;
        }
        if (nameEl) nameEl.textContent = city;

        var temp = current.temp_C;
        var desc = current.weatherDesc && current.weatherDesc[0] ? current.weatherDesc[0].value : "";
        
        var descCN = desc;
        if (desc.includes("Sunny") || desc.includes("Clear")) descCN = "晴";
        else if (desc.includes("Partly cloudy")) descCN = "多云";
        else if (desc.includes("Cloudy") || desc.includes("Overcast")) descCN = "阴";
        else if (desc.includes("Rain")) descCN = "雨";
        else if (desc.includes("Snow")) descCN = "雪";
        else if (desc.includes("Fog") || desc.includes("Mist") || desc.includes("Haze")) descCN = "雾";
        else if (desc.includes("Thunder")) descCN = "雷雨";

        if (tempEl) tempEl.textContent = temp + "°";
        if (descEl) descEl.textContent = descCN;

        var matchedIcon = "ri-cloudy-line";
        for (var key in iconMap) {
            if (desc.includes(key)) {
                matchedIcon = iconMap[key];
                break;
            }
        }
        if (iconEl) {
           iconEl.className = "weather-icon-big " + matchedIcon;
           iconEl.textContent = "";
        }

        if (chartHighLineEl && chartLowLineEl && chartSvgEl && chartLabelsEl) {
          function buildChartFromDaily(daily) {
            if (!daily || !daily.time) return;

            var times = daily.time;
            var maxTemps = daily.temperature_2m_max || [];
            var minTemps = daily.temperature_2m_min || [];
            var codes = daily.weathercode || [];
            var len = Math.min(5, times.length, maxTemps.length, minTemps.length, codes.length);
            if (!len) return;

            var labels = [];
            var weekMap = ["日","一","二","三","四","五","六"];

            var i;
            for (i = 0; i < len; i++) {
                var dateStr = times[i];
                var d = new Date(dateStr);
                var label = "";
                if (i === 0) label = "今";
                else if (i === 1) label = "明";
                else if (!isNaN(d.getTime())) {
                label = "周" + weekMap[d.getDay()];
                } else {
                label = (i + 1) + "天";
                }
                labels.push(label);
            }

            if (chartTitleEl) {
                chartTitleEl.textContent = "";
            }

            var tMin = Math.min.apply(null, minTemps.slice(0, len));
            var tMax = Math.max.apply(null, maxTemps.slice(0, len));
            if (tMax === tMin) tMax = tMin + 1;

            var highPoints = [];
            var lowPoints = [];
            var dots = chartSvgEl.querySelectorAll(".weather-chart-dot");
            Array.prototype.forEach.call(dots, function (node) {
                chartSvgEl.removeChild(node);
            });
            
            if (chartLabelsEl) chartLabelsEl.innerHTML = "";
            if (chartIconsHighEl) chartIconsHighEl.innerHTML = "";
            if (chartTempsHighEl) chartTempsHighEl.innerHTML = "";
            if (chartTempsLowEl) chartTempsLowEl.innerHTML = "";
            if (chartIconsLowEl) chartIconsLowEl.innerHTML = "";

            var rows = [chartLabelsEl, chartIconsHighEl, chartTempsHighEl, chartTempsLowEl, chartIconsLowEl];
            rows.forEach(function (el) {
                if (el) el.style.setProperty("--weather-days", len);
            });

            function mapWeatherCodeToIcon(code) {
                if (code === 0) return "ri-sun-line";
                if (code === 1 || code === 2) return "ri-sun-cloudy-line";
                if (code === 3) return "ri-cloudy-line";
                if (code === 45 || code === 48) return "ri-foggy-line";
                if (code === 51 || code === 53 || code === 55) return "ri-drizzle-line";
                if (code === 61 || code === 63 || code === 65) return "ri-rainy-line";
                if (code === 80 || code === 81 || code === 82) return "ri-heavy-showers-line";
                if (code === 71 || code === 73 || code === 75 || code === 77) return "ri-snowy-line";
                if (code === 95 || code === 96 || code === 99) return "ri-thunderstorms-line";
                return "ri-cloudy-2-line";
            }

            for (i = 0; i < len; i++) {
                if (chartLabelsEl) {
                var labelSpan = document.createElement("span");
                labelSpan.textContent = labels[i];
                chartLabelsEl.appendChild(labelSpan);
                }

                var iconClass = mapWeatherCodeToIcon(codes[i]);
                if (chartIconsHighEl) {
                var iconSpanHigh = document.createElement("span");
                iconSpanHigh.innerHTML = "<i class='" + iconClass + "'></i>";
                chartIconsHighEl.appendChild(iconSpanHigh);
                }

                if (chartTempsHighEl) {
                var tempSpanHigh = document.createElement("span");
                tempSpanHigh.textContent = Math.round(maxTemps[i]) + "°";
                chartTempsHighEl.appendChild(tempSpanHigh);
                }

                if (chartTempsLowEl) {
                var tempSpanLow = document.createElement("span");
                tempSpanLow.textContent = Math.round(minTemps[i]) + "°";
                chartTempsLowEl.appendChild(tempSpanLow);
                }

                if (chartIconsLowEl) {
                var iconSpanLow = document.createElement("span");
                iconSpanLow.innerHTML = "<i class='" + iconClass + "'></i>";
                chartIconsLowEl.appendChild(iconSpanLow);
                }
            }

            var svgRect = chartSvgEl.getBoundingClientRect();
            var svgW = svgRect.width || 300;
            var svgH = svgRect.height || 80;

            chartSvgEl.setAttribute("viewBox", "0 0 " + svgW + " " + svgH);

            var topY = 10;
            var bottomY = svgH - 10;

            for (i = 0; i < len; i++) {
                var xVal = len === 1 ? (svgW / 2) : (svgW * (i + 0.5) / len);
                var normHigh = (maxTemps[i] - tMin) / (tMax - tMin);
                var normLow = (minTemps[i] - tMin) / (tMax - tMin);
                
                var yHigh = bottomY - normHigh * (bottomY - topY);
                var yLow = bottomY - normLow * (bottomY - topY);

                highPoints.push(xVal.toFixed(1) + "," + yHigh.toFixed(1));
                lowPoints.push(xVal.toFixed(1) + "," + yLow.toFixed(1));

                var dotHigh = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dotHigh.setAttribute("class", "weather-chart-dot");
                dotHigh.setAttribute("cx", xVal.toFixed(1));
                dotHigh.setAttribute("cy", yHigh.toFixed(1));
                dotHigh.setAttribute("r", 3);
                dotHigh.setAttribute("fill", "#f97316");
                chartSvgEl.appendChild(dotHigh);

                var dotLow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dotLow.setAttribute("class", "weather-chart-dot");
                dotLow.setAttribute("cx", xVal.toFixed(1));
                dotLow.setAttribute("cy", yLow.toFixed(1));
                dotLow.setAttribute("r", 2.5);
                dotLow.setAttribute("fill", "#3b82f6");
                chartSvgEl.appendChild(dotLow);
            }

            chartHighLineEl.setAttribute("points", highPoints.join(" "));
            chartLowLineEl.setAttribute("points", lowPoints.join(" "));

            if (chartAreaEl) {
                var areaBottom = svgH; 
                var area = [];
                if (highPoints.length) {
                var first = highPoints[0].split(",");
                var last = highPoints[highPoints.length - 1].split(",");
                area.push(first[0] + "," + areaBottom);
                area = area.concat(highPoints);
                area.push(last[0] + "," + areaBottom);
                chartAreaEl.setAttribute("points", area.join(" "));
                } else {
                chartAreaEl.setAttribute("points", "");
                }
            }
          }

          if (data.daily_forecast) {
            buildChartFromDaily(data.daily_forecast);
          } else {
            var lat = null;
            var lon = null;
            if (nearest) {
              if (nearest.latitude) {
                if (typeof nearest.latitude === "string") {
                  lat = parseFloat(nearest.latitude);
                } else if (nearest.latitude[0] && nearest.latitude[0].value) {
                  lat = parseFloat(nearest.latitude[0].value);
                }
              }
              if (nearest.longitude) {
                if (typeof nearest.longitude === "string") {
                  lon = parseFloat(nearest.longitude);
                } else if (nearest.longitude[0] && nearest.longitude[0].value) {
                  lon = parseFloat(nearest.longitude[0].value);
                }
              }
            }

            if (lat && lon) {
              var url =
                "https://api.open-meteo.com/v1/forecast?latitude=" +
                lat +
                "&longitude=" +
                lon +
                "&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto";

              fetch(url)
                .then(function (res) { return res.json(); })
                .then(function (forecast) {
                  if (!forecast || !forecast.daily) return;
                  buildChartFromDaily(forecast.daily);
                })
                .catch(function (err) {
                  console.warn("Open-Meteo forecast error", err);
                });
            }
          }
        }
        
        if (updateTimeEl) {
            var now = new Date();
            var h = now.getHours().toString().padStart(2, '0');
            var m = now.getMinutes().toString().padStart(2, '0');
            updateTimeEl.textContent = h + ":" + m + " 更新";
        }
    }

    var CACHE_KEY = "nav_weather_data";
    var CACHE_TIME_KEY = "nav_weather_time";
    var CACHE_DURATION = 3600 * 1000; // 1 hour

    function fetchWeather() {
      if (updateTimeEl) updateTimeEl.textContent = "更新中...";

      function mapCodeToDesc(code) {
        if (code === 0) return "Sunny";
        if (code === 1 || code === 2) return "Partly cloudy";
        if (code === 3) return "Cloudy";
        if (code === 45 || code === 48) return "Fog";
        if (code === 51 || code === 53 || code === 55) return "Light rain";
        if (code === 61 || code === 63) return "Rain";
        if (code === 65 || code === 80 || code === 81 || code === 82) return "Heavy rain";
        if (code === 71 || code === 73 || code === 75 || code === 77) return "Snow";
        if (code === 95 || code === 96 || code === 99) return "Thunderstorm";
        return "Cloudy";
      }

      function offline() {
        if (nameEl) nameEl.textContent = "离线";
        if (updateTimeEl) updateTimeEl.textContent = "获取失败";
      }

      function loadByCoords(lat, lon, cityLabel) {
        if (!lat || !lon) {
          offline();
          return;
        }

        var url =
          "https://api.open-meteo.com/v1/forecast?latitude=" +
          lat +
          "&longitude=" +
          lon +
          "&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto";

        fetch(url)
          .then(function (res) { return res.json(); })
          .then(function (om) {
            if (!om || !om.current_weather) {
              offline();
              return;
            }

            var cw = om.current_weather;
            var descEn = mapCodeToDesc(typeof cw.weathercode === "number" ? cw.weathercode : 0);

            var fakeWttr = {
              current_condition: [
                {
                  temp_C: Math.round(cw.temperature || 0),
                  weatherDesc: [{ value: descEn }]
                }
              ],
              nearest_area: [
                {
                  areaName: [{ value: cityLabel || "本地" }],
                  latitude: String(lat),
                  longitude: String(lon)
                }
              ],
              daily_forecast: om.daily || null
            };

            localStorage.setItem(CACHE_KEY, JSON.stringify(fakeWttr));
            localStorage.setItem(CACHE_TIME_KEY, Date.now());
            renderWeather(fakeWttr);
          })
          .catch(function (err) {
            console.warn("Open-Meteo base fetch failed", err);
            offline();
          });
      }

      function useIpLocation() {
        fetch("https://ipapi.co/json/")
          .then(function (res) { return res.json(); })
          .then(function (ip) {
            var lat = ip && ip.latitude;
            var lon = ip && ip.longitude;
            var city = (ip && ip.city) || "本地";
            if (!lat || !lon) {
              offline();
              return;
            }
            loadByCoords(lat, lon, city);
          })
          .catch(function (err) {
            console.warn("IP location fetch failed", err);
            offline();
          });
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (pos) {
            var lat = pos && pos.coords && pos.coords.latitude;
            var lon = pos && pos.coords && pos.coords.longitude;
            fetch(
              "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" +
                lat +
                "&longitude=" +
                lon +
                "&localityLanguage=zh"
            )
              .then(function (res) {
                return res.json();
              })
              .then(function (geo) {
                var city =
                  geo.city ||
                  geo.locality ||
                  geo.principalSubdivision ||
                  "当前位置";
                loadByCoords(lat, lon, city);
              })
              .catch(function () {
                loadByCoords(lat, lon, "当前位置");
              });
          },
          function () {
            useIpLocation();
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 10 * 60 * 1000
          }
        );
      } else {
        useIpLocation();
      }
    }

    var cachedData = localStorage.getItem(CACHE_KEY);
    var cachedTime = localStorage.getItem(CACHE_TIME_KEY);

    if (cachedData && cachedTime && (Date.now() - cachedTime < CACHE_DURATION)) {
        try {
            renderWeather(JSON.parse(cachedData));
        } catch (e) {
            fetchWeather();
        }
    } else {
        fetchWeather();
    }
})();

// 回到顶部按钮
(function () {
    var btn = document.getElementById("backToTop");
    if (!btn) return;

    function toggle() {
      var feedbackBtn = document.getElementById("feedbackBtn");
      if (window.scrollY > 260) {
        btn.classList.add("is-visible");
        if (feedbackBtn) feedbackBtn.classList.add("move-up");
      } else {
        btn.classList.remove("is-visible");
        if (feedbackBtn) feedbackBtn.classList.remove("move-up");
      }
    }

    window.addEventListener("scroll", toggle);
    toggle();

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();

// 左侧分组点击后滚动到右侧对应分类
(function () {
    var groupItems = document.querySelectorAll(".sidebar .side-menu li[data-section-id]");
    if (!groupItems.length) return;

    groupItems.forEach(function (item) {
      item.addEventListener("click", function () {
        var targetId = item.getAttribute("data-section-id");
        if (!targetId) return;
        var target = document.getElementById(targetId);
        if (!target) return;
        var rect = target.getBoundingClientRect();
        var top = rect.top + window.scrollY - 12;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
})();

// 访客数据逻辑：从 51.la 隐藏挂件中抓取数据并填入自定义样式
(function () {
    function syncData() {
        var container = document.getElementById("la_data_container");
        
        if (!container) return;

        var text = container.textContent || container.innerText || "";
        
        if (!text.trim()) return;
        
        var onlineMatch = text.match(/(\d+).*?(?:活跃|在线|Current)/) || text.match(/(?:活跃|在线|Current).*?(\d+)/);
        var todayMatch  = text.match(/(\d+).*?(?:今日|Today)/) || text.match(/(?:今日|Today).*?(\d+)/);
        var totalMatch  = text.match(/(\d+).*?(?:总|Total)/) || text.match(/(?:总|Total).*?(\d+)/);

        var nums = text.match(/\d+/g);
        
        var onlineVal = "1";
        var todayVal = "--";
        var totalVal = "--";

        if (nums && nums.length >= 3) {
             onlineVal = nums[0];
             todayVal = nums[1];
             totalVal = nums[2];
        } else {
             if (onlineMatch) onlineVal = onlineMatch[1];
             if (todayMatch) todayVal = todayMatch[1];
             if (totalMatch) totalVal = totalMatch[1];
        }

        var tDay = parseInt(todayVal, 10);
        var tTot = parseInt(totalVal, 10);

        if (!isNaN(tDay)) {
            if (isNaN(tTot) || tTot < tDay) {
                tTot = tDay; 
                totalVal = tTot.toString();
            }
        }
        
        if (parseInt(totalVal) > 100000000) totalVal = "1";

        var elTotal = document.getElementById("custom_total");
        var elToday = document.getElementById("custom_today");
        var elOnline = document.getElementById("custom_online");

        if (elTotal) elTotal.textContent = totalVal;
        if (elToday) elToday.textContent = todayVal;
        if (elOnline) elOnline.textContent = onlineVal;
    }

    setInterval(syncData, 1000);
})();

// 轮播图逻辑
(function() {
    var bannerWrapper = document.getElementById("bannerWrapper");
    var indicatorsEl = document.getElementById("bannerIndicators");
    var loadingEl = bannerWrapper ? bannerWrapper.querySelector(".banner-loading") : null;
    
    if (!bannerWrapper) return;

    var slidesData = [];
    var currentIndex = 0;
    var slideInterval = null;

    var feedSources = [
      { url: "https://www.jiqizhixin.com/rss", name: "机器之心" },
      { url: "https://www.qbitai.com/feed", name: "量子位" },
      { url: "https://36kr.com/feed/tag/AI", name: "36氪AI" }, 
      { url: "https://www.aibase.com/feed", name: "AI基地" }, 
      { url: "https://hub.baai.ac.cn/rss", name: "智源社区" },
      { url: "https://www.leiphone.com/feed", name: "雷峰网" }, 
      { url: "https://cn.technode.com/feed", name: "动点科技" } 
    ];

    var fallbackData = [
      {
        title: "OpenAI 发布 GPT-4o 模型，多模态能力大幅提升",
        link: "https://openai.com/index/hello-gpt-4o/",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
        source: "OpenAI"
      },
      {
        title: "Google I/O 2024：Gemini 全面整合进 Android 系统",
        link: "https://blog.google/products/android/android-ai-gemini-io-2024/",
        image: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?auto=format&fit=crop&q=80&w=1000",
        source: "Google"
      },
      {
        title: "Apple 推出 Apple Intelligence，重新定义个人智能系统",
        link: "https://www.apple.com/apple-intelligence/",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1000",
        source: "Apple"
      },
      {
        title: "Anthropic 发布 Claude 3.5 Sonnet，编码能力超越 GPT-4o",
        link: "https://www.anthropic.com/news/claude-3-5-sonnet",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
        source: "Anthropic"
      },
      {
        title: "Midjourney v6.1 版本更新，图像细节与连贯性增强",
        link: "https://www.midjourney.com",
        image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000",
        source: "Midjourney"
      }
    ];

    function extractImage(item) {
        if (item.enclosure && item.enclosure.link && item.enclosure.type && item.enclosure.type.indexOf('image') !== -1) {
            return item.enclosure.link;
        }
        if (item.thumbnail) return item.thumbnail;
        
        var html = (item.description || "") + (item.content || "");
        var imgRegex = /<img[^>]+src="([^">]+)"/i;
        var match = html.match(imgRegex);
        if (match && match[1]) return match[1];

        return null;
    }

    function getRandomFallbackImage(index) {
        var images = [
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1531297461137-3635ebef57a6?auto=format&fit=crop&q=80&w=800"
        ];
        return images[index % images.length];
    }

    function getRelevantImage(title) {
        if (!title) return getRandomFallbackImage(0);
        
        var t = title.toLowerCase();
        
        if (t.includes("apple") || t.includes("iphone") || t.includes("mac") || t.includes("ios")) 
            return "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80";
        if (t.includes("google") || t.includes("gemini") || t.includes("android") || t.includes("pixel")) 
            return "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80";
        if (t.includes("openai") || t.includes("gpt") || t.includes("chatgpt")) 
            return "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80";
        if (t.includes("microsoft") || t.includes("copilot") || t.includes("bing")) 
            return "https://images.unsplash.com/photo-1633419461186-7d75076e474b?w=800&q=80";
        if (t.includes("tesla") || t.includes("robot") || t.includes("musk")) 
            return "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80";
        if (t.includes("code") || t.includes("python") || t.includes("github") || t.includes("dev")) 
            return "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80";
        if (t.includes("image") || t.includes("video") || t.includes("midjourney") || t.includes("sora")) 
            return "https://images.unsplash.com/photo-1535378437327-525e99493c56?w=800&q=80";
        if (t.includes("chip") || t.includes("nvidia") || t.includes("hardware")) 
            return "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&q=80";

        var hash = 0;
        for (var i = 0; i < title.length; i++) {
            hash = title.charCodeAt(i) + ((hash << 5) - hash);
        }
        var index = Math.abs(hash);
        
        var pool = [
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80", 
            "https://images.unsplash.com/photo-1531297461137-3635ebef57a6?w=800&q=80", 
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80", 
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80", 
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", 
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", 
            "https://images.unsplash.com/photo-1504384308090-c54be3855462?w=800&q=80", 
            "https://images.unsplash.com/photo-1620825937374-87fc7d6bddc2?w=800&q=80"  
        ];
        
        return pool[index % pool.length];
    }

    function fetchNews() {
        var promises = feedSources.map(function(source) {
            var apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(source.url) + "&t=" + Date.now();
            return fetch(apiUrl)
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    if (data.status === "ok" && data.items) {
                        return data.items.map(function(item) {
                            return {
                                title: item.title,
                                link: item.link,
                                pubDate: new Date(item.pubDate), 
                                image: extractImage(item),
                                source: source.name
                            };
                        });
                    }
                    return [];
                })
                .catch(function(e) { 
                    console.warn("Feed fetch failed: " + source.name, e);
                    return []; 
                });
        });

        Promise.all(promises).then(function(results) {
            var allNews = [].concat.apply([], results);
            allNews.sort(function(a, b) { return b.pubDate - a.pubDate; });
            var finalNews = allNews.slice(0, 5);

            finalNews = finalNews.map(function(item, idx) {
                if (!item.image || item.image.length < 10) {
                    item.image = getRelevantImage(item.title);
                }
                return item;
            });

            if (finalNews.length > 0) {
                initSlider(finalNews);
            } else {
                initSlider(fallbackData);
            }
        });
    }

    function initSlider(data) {
      slidesData = data;
      if (loadingEl) loadingEl.style.display = "none";
      bannerWrapper.innerHTML = ""; 
      
      data.forEach(function(item, index) {
        var slide = document.createElement("div");
        slide.className = "banner-slide" + (index === 0 ? " active" : "");
        
        var imgObj = new Image();
        imgObj.src = item.image;
        slide.style.background = "linear-gradient(135deg, #cbd5e1 0%, #f1f5f9 100%)"; 
        
        imgObj.onload = function() {
            if (this.width < 150 || this.height < 100) {
                console.warn("Image too small (likely tracking pixel):", item.image);
                var fallbackUrl = getRelevantImage(item.title);
                if (fallbackUrl !== item.image) {
                    slide.style.backgroundImage = "url('" + fallbackUrl + "')";
                }
            } else {
                slide.style.backgroundImage = "url('" + item.image + "')";
            }
        };
        imgObj.onerror = function() {
            console.warn("Image failed to load:", item.image);
            var fallbackUrl = getRelevantImage(item.title);
            if (fallbackUrl !== item.image) {
                slide.style.backgroundImage = "url('" + fallbackUrl + "')";
            }
        };
        
        slide.style.backgroundImage = "url('" + item.image + "')";
        slide.onclick = function() {
           window.open(item.link, "_blank");
        };
        
        var content = document.createElement("div");
        content.className = "banner-content";
        
        var tag = document.createElement("span");
        tag.className = "banner-tag";
        tag.textContent = item.source || "AI News";
        
        var title = document.createElement("h3");
        title.className = "banner-title";
        title.textContent = item.title;
        
        content.appendChild(tag);
        content.appendChild(title);
        slide.appendChild(content);
        
        bannerWrapper.appendChild(slide);
      });

      var indContainer = document.createElement("div");
      indContainer.className = "banner-indicators";
      indicatorsEl = indContainer; 

      data.forEach(function(_, index) {
        var dot = document.createElement("div");
        dot.className = "banner-dot" + (index === 0 ? " active" : "");
        dot.onclick = function(e) {
          e.stopPropagation();
          goToSlide(index);
        };
        indContainer.appendChild(dot);
      });
      bannerWrapper.appendChild(indContainer);

      startAutoPlay();
    }

    function goToSlide(index) {
      var slides = bannerWrapper.querySelectorAll(".banner-slide");
      var dots = indicatorsEl ? indicatorsEl.querySelectorAll(".banner-dot") : [];
      
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;

      slides.forEach(function(el) { el.classList.remove("active"); });
      dots.forEach(function(el) { el.classList.remove("active"); });

      if (slides[index]) slides[index].classList.add("active");
      if (dots[index]) dots[index].classList.add("active");
      
      currentIndex = index;
      resetAutoPlay();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function startAutoPlay() {
      if (slideInterval) clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }

    fetchNews();
})();

// 51.la Init
try {
    // 假设 SDK 已加载
    if (window.LA) {
        LA.init({id:"3OBuXueXb41ODfzv",ck:"3OBuXueXb41ODfzv"});
    }
} catch (e) {
    console.warn("LA init failed", e);
}

// Feedback Logic & Pagination
(function() {
    var FEEDBACK_KEY = "site_feedback_data";
    
    var currentPage = 1;
    var pageSize = 20;
    var allFeedback = [];

    var btn = document.getElementById("feedbackBtn");
    var modal = document.getElementById("feedbackModal");
    var close = document.getElementById("feedbackModalClose");
    var cancel = document.getElementById("feedbackCancelBtn");
    var submit = document.getElementById("feedbackSubmitBtn");
    var contentInput = document.getElementById("feedbackContent");
    var contactInput = document.getElementById("feedbackContact");

    if(btn) btn.onclick = function() { modal.classList.add("is-visible"); };
    function closeModal() { 
        modal.classList.remove("is-visible"); 
        setTimeout(function() {
        if(contentInput) contentInput.value = "";
        if(contactInput) contactInput.value = "";
        }, 200);
    }
    if(close) close.onclick = closeModal;
    if(cancel) cancel.onclick = closeModal;

    if(submit) submit.onclick = function() {
        var content = contentInput.value.trim();
        if (!content) { alert("请输入反馈内容"); return; }
        
        DataService.submitFeedback(content, contactInput.value.trim());
        
        closeModal();
        if (document.getElementById("adminFeedbackModal").classList.contains("is-visible")) {
            setTimeout(loadFeedbackData, 1000); 
        }
    };

    var adminModal = document.getElementById("adminFeedbackModal");
    var listContainer = document.getElementById("feedbackListContainer");
    var adminClose = document.getElementById("adminFeedbackClose");
    
    var pageSizeSelect = document.getElementById("pageSizeSelect");
    var prevBtn = document.getElementById("prevPageBtn");
    var nextBtn = document.getElementById("nextPageBtn");
    var pageInfo = document.getElementById("pageInfo");

    async function loadFeedbackData() {
        allFeedback = await DataService.getFeedback();
        currentPage = 1;
        renderFeedbackList();
    }

    function renderFeedbackList() {
        listContainer.innerHTML = "";
        
        if (allFeedback.length === 0) {
            listContainer.innerHTML = "<div style='padding:20px;text-align:center;color:#94a3b8;'>暂无反馈</div>";
            pageInfo.textContent = "0 / 0";
            if(prevBtn) prevBtn.disabled = true;
            if(nextBtn) nextBtn.disabled = true;
            return;
        }

        var totalPages = Math.ceil(allFeedback.length / pageSize);
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        var start = (currentPage - 1) * pageSize;
        var end = start + pageSize;
        var pageItems = allFeedback.slice(start, end);

        pageItems.forEach(function(item) {
            var itemEl = document.createElement("div");
            itemEl.className = "feedback-item";
            itemEl.innerHTML = 
                '<div class="feedback-meta"><span>' + item.time + '</span></div>' +
                '<div class="feedback-text">' + item.content + '</div>' +
                (item.contact ? '<div class="feedback-contact">' + item.contact + '</div>' : '');
            listContainer.appendChild(itemEl);
        });

        if(pageInfo) pageInfo.textContent = currentPage + " / " + totalPages;
        if(prevBtn) prevBtn.disabled = currentPage === 1;
        if(nextBtn) nextBtn.disabled = currentPage === totalPages;
    }

    window.openAdminFeedback = function() {
        loadFeedbackData();
        currentPage = 1; 
        renderFeedbackList();
        adminModal.classList.add("is-visible");
    };
    
    function closeAdmin() { adminModal.classList.remove("is-visible"); }
    if(adminClose) adminClose.onclick = closeAdmin;

    if(pageSizeSelect) {
        pageSizeSelect.onchange = function() {
            pageSize = parseInt(this.value);
            currentPage = 1;
            renderFeedbackList();
        };
    }
    if(prevBtn) {
        prevBtn.onclick = function() {
            if (currentPage > 1) {
                currentPage--;
                renderFeedbackList();
            }
        };
    }
    if(nextBtn) {
        nextBtn.onclick = function() {
            var totalPages = Math.ceil(allFeedback.length / pageSize);
            if (currentPage < totalPages) {
                currentPage++;
                renderFeedbackList();
            }
        };
    }

})();

// 权限控制与登录逻辑 (Supabase Auth)
(function() {
    // Supabase 配置说明：
    // 在静态网站中，Supabase 的 'anon' (公开) key 需要暴露在前端代码中以连接数据库。
    // 安全性依赖于数据库层面的 RLS (Row Level Security) 策略，而非隐藏 key。
    // 请确保您的 Supabase 项目已启用 RLS 并配置了正确的访问策略。
    
    // 添加键盘快捷键 (Ctrl + Shift + K)
    document.addEventListener('keydown', function(e) {
        // 支持 Mac Command 键 (MetaKey)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            console.log("Admin shortcut triggered");
            handleLoginTrigger();
        }
    });

    // 添加退出登录按钮到侧边栏底部（仅登录后显示）
    var footer = document.getElementById('sideFooter');
    if (footer) {
        var logoutBtn = document.createElement('div');
        logoutBtn.className = 'side-footer-btn';
        logoutBtn.id = 'adminLogoutBtn';
        logoutBtn.innerHTML = '<i class="ri-logout-box-r-line"></i>';
        logoutBtn.title = "退出登录";
        logoutBtn.style.display = 'none'; // 默认隐藏
        logoutBtn.onclick = function() {
             if(confirm("确定要退出管理员模式吗？")) {
                 if (window.DataService) {
                     var SUPABASE_URL = "https://aexcnubowsarpxkohqvv.supabase.co";
                     var SUPABASE_KEY = "sb_publishable_YciLcY3_xL7koCNRhXItoQ_K-78060C"; 
                     var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                     sb.auth.signOut();
                 }
             }
        };
        // 插入到最后 (Logout)
        footer.appendChild(logoutBtn);
    }

    // Login Modal Logic
    var loginModal = document.getElementById('loginModal');
    var loginClose = document.getElementById('loginModalClose');
    var loginCancel = document.getElementById('loginCancelBtn');
    var loginSubmit = document.getElementById('loginSubmitBtn');
    var emailInput = document.getElementById('loginEmail');
    var passInput = document.getElementById('loginPassword');

    function closeLoginModal() {
        if (loginModal) {
            loginModal.classList.remove('is-visible');
            if (emailInput) emailInput.value = '';
            if (passInput) passInput.value = '';
        }
    }
    if (loginClose) loginClose.onclick = closeLoginModal;
    if (loginCancel) loginCancel.onclick = closeLoginModal;

    if (loginSubmit) {
        loginSubmit.onclick = function() {
             var email = emailInput ? emailInput.value.trim() : "";
             var password = passInput ? passInput.value.trim() : "";
             if (!email || !password) { alert("请输入邮箱和密码"); return; }

             var SUPABASE_URL = "https://aexcnubowsarpxkohqvv.supabase.co";
             var SUPABASE_KEY = "sb_publishable_YciLcY3_xL7koCNRhXItoQ_K-78060C"; 
             var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

             loginSubmit.textContent = "登录中...";
             sb.auth.signInWithPassword({
                email: email,
                password: password,
             }).then(function(resp) {
                 loginSubmit.textContent = "登录";
                 if (resp.error) {
                     alert("登录失败: " + resp.error.message);
                 } else {
                     closeLoginModal();
                 }
             });
        };
    }

    async function checkUser() {
        if (!window.supabase) return;
        
        var SUPABASE_URL = "https://aexcnubowsarpxkohqvv.supabase.co";
        var SUPABASE_KEY = "sb_publishable_YciLcY3_xL7koCNRhXItoQ_K-78060C"; 
        var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

        var { data: { session } } = await sb.auth.getSession();
        updateUI(session);

        sb.auth.onAuthStateChange((_event, session) => {
            updateUI(session);
        });
    }

    function updateUI(session) {
        var footer = document.getElementById('sideFooter');
        var logoutBtn = document.getElementById('adminLogoutBtn');
        
        if (session) {
            if (footer) footer.style.display = 'flex';
            if (logoutBtn) logoutBtn.style.display = 'flex';
            document.body.classList.add('is-admin');
        } else {
            if (footer) footer.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
            document.body.classList.remove('is-admin');
        }
    }

    function handleLoginTrigger() {
        if (document.body.classList.contains('is-admin')) {
            if(confirm("当前已是管理员模式，是否退出？")) {
                 var SUPABASE_URL = "https://aexcnubowsarpxkohqvv.supabase.co";
                 var SUPABASE_KEY = "sb_publishable_YciLcY3_xL7koCNRhXItoQ_K-78060C"; 
                 var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                 sb.auth.signOut();
            }
        } else {
            if (loginModal) {
                loginModal.classList.add('is-visible');
                setTimeout(function() { if(emailInput) emailInput.focus(); }, 50);
            } else {
                console.error("Login modal not found!");
            }
        }
    }

    setTimeout(checkUser, 1000);

})();

(function() {
    // 自动缩放逻辑：确保在小屏幕（如笔记本）上按比例缩放
    function adjustZoom() {
       var width = window.innerWidth;
       var baseWidth = 1600; 
       
       if (width < baseWidth && width > 768) {
           var scale = width / baseWidth;
           document.body.style.zoom = scale;
           var compensatedHeight = 100 / scale;
           var compVal = compensatedHeight + 'vh';
           var layout = document.querySelector('.layout');
           var sidebar = document.querySelector('.sidebar');
           if(layout) layout.style.minHeight = compVal;
           if(sidebar) sidebar.style.height = compVal;
       } else {
           document.body.style.zoom = 1;
           var layout = document.querySelector('.layout');
           var sidebar = document.querySelector('.sidebar');
           if(layout) layout.style.minHeight = '100vh';
           if(sidebar) sidebar.style.height = '100vh';
       }
    }

    window.addEventListener('resize', adjustZoom);
    adjustZoom();
    window.addEventListener('DOMContentLoaded', adjustZoom);
})();

