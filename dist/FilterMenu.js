var FilterMenu = (function () {
    function FilterMenu(th, col) {
        this.th = th;
        this.column = col;
        this.tds = $('table tbody tr td:nth-child(' + (this.column + 1) + ')').toArray();
    }
    FilterMenu.prototype.initialize = function () {
        this.menuItems = this.retrieveMenuItems();
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
    FilterMenu.prototype.isSelected = function (value) {
        return this.menuItems.filter(function (item) {
            return item.selected;
        }).map(function (item) {
            return item.value;
        }).indexOf(value) > -1;
    };
    FilterMenu.prototype.searchToggle = function (value) {
        if (value.length > 0) {
            this.toggleAll(false, false);
            if (this.selectAllCheckbox instanceof HTMLInputElement)
                this.selectAllCheckbox.checked = false;
            this.menuItems.filter(function (item) {
                return item.value.toLowerCase().indexOf(value.toLowerCase()) > -1;
            }).forEach(function (item) {
                item.selected = true;
            });
            this.inputs.filter(function (input) {
                return input.value.toLowerCase().indexOf(value.toLowerCase()) > -1;
            }).forEach(function (input) {
                input.checked = true;
            });
        }
        else {
            this.toggleAll(true, false);
            if (this.selectAllCheckbox instanceof HTMLInputElement)
                this.selectAllCheckbox.checked = true;
        }
    };
    FilterMenu.prototype.toggle = function (value) {
        this.menuItems.filter(function (item) {
            return item.value === value;
        }).forEach(function (item) {
            item.selected = !item.selected;
        });
        var totalItems = this.menuItems.length;
        var selectedItems = this.menuItems.filter(function (item) {
            return item.selected;
        }).length;
        if (this.selectAllCheckbox instanceof HTMLInputElement) {
            this.selectAllCheckbox.checked = (totalItems === selectedItems);
        }
    };
    FilterMenu.prototype.selectAllToggle = function (value) {
        this.toggleAll(value, true);
    };
    FilterMenu.prototype.toggleAll = function (value, clearSearch) {
        if (clearSearch)
            $(this.searchFilter).val('');
        this.menuItems.forEach(function (item) {
            item.selected = value;
        });
        this.inputs.forEach(function (input) {
            input.checked = value;
        });
    };
    FilterMenu.prototype.retrieveMenuItems = function () {
        var inputs = this.inputs;
        var column = this.column;
        return this.tds.map(function (el, row) {
            return {
                column: column,
                row: row,
                value: el.innerHTML,
                selected: true
            };
        });
    };
    FilterMenu.prototype.dropdownFilterItem = function (td) {
        var value = td.innerText;
        var dropdownFilterItem = document.createElement('div');
        dropdownFilterItem.className = 'dropdown-filter-item';
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.value = value;
        input.setAttribute('checked', 'checked');
        input.className = 'dropdown-filter-menu-item item';
        input.setAttribute('data-column', $(td).parent().children().index($(td)).toString());
        dropdownFilterItem.appendChild(input);
        dropdownFilterItem.innerHTML = dropdownFilterItem.innerHTML + ' ' + value;
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
        span.innerText = direction;
        dropdownFilterItem.appendChild(span);
        return dropdownFilterItem;
    };
    FilterMenu.prototype.dropdownFilterContent = function () {
        var dropdownFilterContent = document.createElement('div');
        dropdownFilterContent.className = 'dropdown-filter-content';
        var innerDivs = this.tds.reduce(function (arr, el) {
            var values = arr.map(function (el) { return el.innerText; });
            if (values.indexOf(el.innerText) < 0)
                arr.push(el);
            return arr;
        }, [])
            .sort(function (a, b) {
            return a.innerText.toLowerCase() > b.innerText.toLowerCase() ? 1 : -1;
        })
            .map(this.dropdownFilterItem);
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
        return [this.dropdownFilterSort('A to Z'),
            this.dropdownFilterSort('Z to A'),
            searchFilterDiv
        ]
            .concat(outerDiv)
            .reduce(function (html, el) {
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