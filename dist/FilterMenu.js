var FilterMenu = (function () {
    function FilterMenu(target, th, column, index, options) {
        this.options = options;
        this.th = th;
        this.column = column;
        this.index = index;
        this.tds = target.find('tbody tr td:nth-child(' + (this.column + 1) + ')').toArray();
    }
    FilterMenu.prototype.initialize = function () {
        this.menu = this.dropdownFilterDropdown();
        this.th.appendChild(this.menu);
        var $trigger = $(this.menu.children[0]);
        var $content = $(this.menu.children[1]);
        var $menu = $(this.menu);
        $trigger.click(function () { return $content.toggle(); });
        $(document).click(function (el) {
            if (!$menu.is(el.target) && $menu.has(el.target).length === 0) {
                $content.hide();
            }
        });
    };
    FilterMenu.prototype.searchToggle = function (value) {
        if (this.selectAllCheckbox instanceof HTMLInputElement)
            this.selectAllCheckbox.checked = false;
        if (value.length === 0) {
            this.toggleAll(true);
            if (this.selectAllCheckbox instanceof HTMLInputElement)
                this.selectAllCheckbox.checked = true;
            return;
        }
        this.toggleAll(false);
        this.inputs.filter(function (input) {
            return input.value.toLowerCase().indexOf(value.toLowerCase()) > -1;
        }).forEach(function (input) {
            input.checked = true;
        });
    };
    FilterMenu.prototype.updateSelectAll = function () {
        if (this.selectAllCheckbox instanceof HTMLInputElement) {
            $(this.searchFilter).val('');
            this.selectAllCheckbox.checked = (this.inputs.length === this.inputs.filter(function (input) {
                return input.checked;
            }).length);
        }
    };
    FilterMenu.prototype.selectAllUpdate = function (checked) {
        $(this.searchFilter).val('');
        this.toggleAll(checked);
    };
    FilterMenu.prototype.toggleAll = function (checked) {
        for (var i = 0; i < this.inputs.length; i++) {
            var input = this.inputs[i];
            if (input instanceof HTMLInputElement)
                input.checked = checked;
        }
    };
    FilterMenu.prototype.dropdownFilterItem = function (td, self) {
        var value = td.innerText;
        var dropdownFilterItem = document.createElement('div');
        dropdownFilterItem.className = 'dropdown-filter-item';
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.value = value.trim().replace(/ +(?= )/g, '');
        input.setAttribute('checked', 'checked');
        input.className = 'dropdown-filter-menu-item item';
        input.setAttribute('data-column', self.column.toString());
        input.setAttribute('data-index', self.index.toString());
        dropdownFilterItem.appendChild(input);
        dropdownFilterItem.innerHTML = dropdownFilterItem.innerHTML.trim() + ' ' + value;
        return dropdownFilterItem;
    };
    FilterMenu.prototype.dropdownFilterItemSelectAll = function () {
        var value = 'Select All';
        var dropdownFilterItemSelectAll = document.createElement('div');
        dropdownFilterItemSelectAll.className = 'dropdown-filter-item';
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.value = 'Select All';
        input.setAttribute('checked', 'checked');
        input.className = 'dropdown-filter-menu-item select-all';
        input.setAttribute('data-column', this.column.toString());
        input.setAttribute('data-index', this.index.toString());
        dropdownFilterItemSelectAll.appendChild(input);
        dropdownFilterItemSelectAll.innerHTML = dropdownFilterItemSelectAll.innerHTML + ' ' + value;
        return dropdownFilterItemSelectAll;
    };
    FilterMenu.prototype.dropdownFilterSearch = function () {
        var dropdownFilterItem = document.createElement('div');
        dropdownFilterItem.className = 'dropdown-filter-search';
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'dropdown-filter-menu-search form-control';
        input.setAttribute('data-column', this.column.toString());
        input.setAttribute('data-index', this.index.toString());
        input.setAttribute('placeholder', 'search');
        dropdownFilterItem.appendChild(input);
        return dropdownFilterItem;
    };
    FilterMenu.prototype.dropdownFilterSort = function (direction) {
        var dropdownFilterItem = document.createElement('div');
        dropdownFilterItem.className = 'dropdown-filter-sort';
        var span = document.createElement('span');
        span.className = direction.toLowerCase().split(' ').join('-');
        span.setAttribute('data-column', this.column.toString());
        span.setAttribute('data-index', this.index.toString());
        span.innerText = direction;
        dropdownFilterItem.appendChild(span);
        return dropdownFilterItem;
    };
    FilterMenu.prototype.dropdownFilterContent = function () {
        var _this = this;
        var self = this;
        var dropdownFilterContent = document.createElement('div');
        dropdownFilterContent.className = 'dropdown-filter-content';
        var innerDivs = this.tds.reduce(function (arr, el) {
            var values = arr.map(function (el) { return el.innerText.trim(); });
            if (values.indexOf(el.innerText.trim()) < 0)
                arr.push(el);
            return arr;
        }, [])
            .sort(function (a, b) {
            var A = a.innerText.toLowerCase();
            var B = b.innerText.toLowerCase();
            if (!isNaN(Number(A)) && !isNaN(Number(B))) {
                if (Number(A) < Number(B))
                    return -1;
                if (Number(A) > Number(B))
                    return 1;
            }
            else {
                if (A < B)
                    return -1;
                if (A > B)
                    return 1;
            }
            return 0;
        })
            .map(function (td) {
            return _this.dropdownFilterItem(td, self);
        });
        this.inputs = innerDivs.map(function (div) { return div.firstElementChild; });
        var selectAllCheckboxDiv = this.dropdownFilterItemSelectAll();
        this.selectAllCheckbox = selectAllCheckboxDiv.firstElementChild;
        innerDivs.unshift(selectAllCheckboxDiv);
        var searchFilterDiv = this.dropdownFilterSearch();
        this.searchFilter = searchFilterDiv.firstElementChild;
        var outerDiv = innerDivs.reduce(function (outerDiv, innerDiv) {
            outerDiv.appendChild(innerDiv);
            return outerDiv;
        }, document.createElement('div'));
        outerDiv.className = 'checkbox-container';
        var elements = [];
        if (this.options.sort)
            elements = elements.concat([this.dropdownFilterSort('A to Z'), this.dropdownFilterSort('Z to A')]);
        if (this.options.search)
            elements.push(searchFilterDiv);
        return elements.concat(outerDiv).reduce(function (html, el) {
            html.appendChild(el);
            return html;
        }, dropdownFilterContent);
    };
    FilterMenu.prototype.dropdownFilterDropdown = function () {
        var dropdownFilterDropdown = document.createElement('div');
        dropdownFilterDropdown.className = 'dropdown-filter-dropdown';
        var arrow = document.createElement('span');
        arrow.className = 'glyphicon glyphicon-arrow-down dropdown-filter-icon';
        var icon = document.createElement('i');
        icon.className = 'arrow-down';
        arrow.appendChild(icon);
        dropdownFilterDropdown.appendChild(arrow);
        dropdownFilterDropdown.appendChild(this.dropdownFilterContent());
        return dropdownFilterDropdown;
    };
    return FilterMenu;
}());
export { FilterMenu };
//# sourceMappingURL=FilterMenu.js.map