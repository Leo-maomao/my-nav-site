/**
 * 统一 Modal 组件服务
 * 提供弹窗的显示、隐藏、确认等功能
 */
var ModalService = (function() {
    
    /**
     * 显示指定 Modal
     * @param {string} modalId - Modal 元素 ID
     */
    function show(modalId) {
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('is-visible');
            // 自动聚焦第一个输入框
            var firstInput = modal.querySelector('input, textarea');
            if (firstInput) {
                setTimeout(function() { firstInput.focus(); }, 50);
            }
        }
    }
    
    /**
     * 隐藏指定 Modal
     * @param {string} modalId - Modal 元素 ID
     * @param {boolean} clearInputs - 是否清空输入框
     */
    function hide(modalId, clearInputs) {
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('is-visible');
            if (clearInputs !== false) {
                setTimeout(function() {
                    var inputs = modal.querySelectorAll('input, textarea');
                    inputs.forEach(function(input) {
                        input.value = '';
                    });
                }, 200);
            }
        }
    }
    
    /**
     * 绑定 Modal 的关闭按钮
     * @param {string} modalId - Modal 元素 ID
     * @param {string[]} closeButtonIds - 关闭按钮 ID 数组
     */
    function bindCloseButtons(modalId, closeButtonIds) {
        closeButtonIds.forEach(function(btnId) {
            var btn = document.getElementById(btnId);
            if (btn) {
                btn.onclick = function() {
                    hide(modalId);
                };
            }
        });
        
        // 点击遮罩层关闭
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.onclick = function(e) {
                if (e.target === modal) {
                    hide(modalId);
                }
            };
        }
    }
    
    /**
     * 快速创建确认对话框
     * @param {string} title - 标题
     * @param {string} message - 消息内容
     * @param {Function} onConfirm - 确认回调
     * @param {Object} options - 可选配置 { danger: boolean }
     */
    function confirm(title, message, onConfirm, options) {
        options = options || {};
        var modalOverlay = document.getElementById('configModal');
        var modalTitle = document.getElementById('modalTitle');
        var modalBody = document.getElementById('modalBody');
        var modalConfirmBtn = document.getElementById('modalConfirmBtn');
        
        if (!modalOverlay || !modalTitle || !modalBody || !modalConfirmBtn) return;
        
        modalTitle.textContent = title;
        modalBody.innerHTML = '';
        
        var p = document.createElement('p');
        p.style.fontSize = '14px';
        p.style.color = '#475569';
        p.textContent = message;
        modalBody.appendChild(p);
        
        if (options.danger) {
            modalConfirmBtn.classList.add('danger');
            modalConfirmBtn.textContent = '删除';
        } else {
            modalConfirmBtn.classList.remove('danger');
            modalConfirmBtn.textContent = '确定';
        }
        
        // 存储回调
        modalConfirmBtn._confirmCallback = onConfirm;
        
        show('configModal');
    }
    
    /**
     * 显示表单弹窗
     * @param {string} title - 标题
     * @param {Array} fields - 字段配置 [{ label, key, value, placeholder, type }]
     * @param {Function} onConfirm - 确认回调，参数为表单数据对象
     */
    function form(title, fields, onConfirm) {
        var modalOverlay = document.getElementById('configModal');
        var modalTitle = document.getElementById('modalTitle');
        var modalBody = document.getElementById('modalBody');
        var modalConfirmBtn = document.getElementById('modalConfirmBtn');
        
        if (!modalOverlay || !modalTitle || !modalBody || !modalConfirmBtn) return;
        
        modalTitle.textContent = title;
        modalBody.innerHTML = '';
        
        modalConfirmBtn.classList.remove('danger');
        modalConfirmBtn.textContent = '确定';
        
        fields.forEach(function(field) {
            var group = document.createElement('div');
            group.className = 'modal-input-group';
            
            var label = document.createElement('label');
            label.textContent = field.label;
            
            var input = document.createElement('input');
            input.className = 'modal-input';
            input.value = field.value || '';
            input.placeholder = field.placeholder || '';
            input.setAttribute('data-key', field.key);
            if (field.type) input.type = field.type;
            
            group.appendChild(label);
            group.appendChild(input);
            modalBody.appendChild(group);
        });
        
        // 存储回调
        modalConfirmBtn._confirmCallback = function() {
            var inputs = modalBody.querySelectorAll('input');
            var data = {};
            inputs.forEach(function(input) {
                data[input.getAttribute('data-key')] = input.value.trim();
            });
            onConfirm(data);
        };
        
        show('configModal');
    }
    
    return {
        show: show,
        hide: hide,
        bindCloseButtons: bindCloseButtons,
        confirm: confirm,
        form: form
    };
})();

