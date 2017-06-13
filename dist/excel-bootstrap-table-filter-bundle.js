(function ($$1) {
'use strict';

$$1 = 'default' in $$1 ? $$1['default'] : $$1;

var FilterMenu = function () {
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
        $trigger.click(function () {
            return $content.toggle();
        });
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
            if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = false;
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
        } else {
            this.toggleAll(true, false);
            if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = true;
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
            this.selectAllCheckbox.checked = totalItems === selectedItems;
        }
    };
    FilterMenu.prototype.selectAllToggle = function (value) {
        this.toggleAll(value, true);
    };
    FilterMenu.prototype.toggleAll = function (value, clearSearch) {
        if (clearSearch) $(this.searchFilter).val('');
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
            var values = arr.map(function (el) {
                return el.innerText;
            });
            if (values.indexOf(el.innerText) < 0) arr.push(el);
            return arr;
        }, []).sort(function (a, b) {
            return a.innerText.toLowerCase() > b.innerText.toLowerCase() ? 1 : -1;
        }).map(this.dropdownFilterItem);
        this.inputs = innerDivs.map(function (div) {
            return div.firstElementChild;
        });
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
        return [this.dropdownFilterSort('A to Z'), this.dropdownFilterSort('Z to A'), searchFilterDiv].concat(outerDiv).reduce(function (html, el) {
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
}();

var FilterCollection = function () {
    function FilterCollection(target) {
        this.filterMenus = target.find('th').toArray().map(function (th, idx) {
            return new FilterMenu(th, idx);
        });
        this.rows = target.find('tbody').find('tr').toArray();
        this.target = target[0];
    }
    FilterCollection.prototype.initialize = function () {
        this.filterMenus.forEach(function (filterMenu) {
            filterMenu.initialize();
        });
        this.bindCheckboxes();
        this.bindSelectAllCheckboxes();
        this.bindSort();
        this.bindSearch();
    };
    FilterCollection.prototype.bindCheckboxes = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var updateRowVisibility = this.updateRowVisibility;
        $('.dropdown-filter-menu-item.item').change(function () {
            var column = $(this).data('column');
            var value = $(this).val();
            filterMenus[column].toggle(value);
            updateRowVisibility(filterMenus, rows);
        });
    };
    FilterCollection.prototype.bindSelectAllCheckboxes = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var updateRowVisibility = this.updateRowVisibility;
        $('.dropdown-filter-menu-item.select-all').change(function () {
            var column = $(this).data('column');
            var value = this.checked;
            filterMenus[column].selectAllToggle(value);
            updateRowVisibility(filterMenus, rows);
        });
    };
    FilterCollection.prototype.bindSort = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var sort = this.sort;
        var table = this.target;
        var updateRowVisibility = this.updateRowVisibility;
        $('.dropdown-filter-sort').click(function () {
            var $sortElement = $(this).find('span');
            var column = $sortElement.data('column');
            var order = $sortElement.attr('class');
            sort(column, order, table);
            updateRowVisibility(filterMenus, rows);
        });
    };
    FilterCollection.prototype.bindSearch = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var sort = this.sort;
        var table = this.target;
        var updateRowVisibility = this.updateRowVisibility;
        $('.dropdown-filter-search').keyup(function () {
            var $input = $(this).find('input');
            var column = $input.data('column');
            var value = $input.val();
            filterMenus[column].searchToggle(value);
            updateRowVisibility(filterMenus, rows);
        });
    };
    FilterCollection.prototype.updateRowVisibility = function (filterMenus, rows) {
        rows.forEach(function (row) {
            var $row = $(row);
            var visible = $row.find('td').toArray().map(function (el, column) {
                return filterMenus[column].isSelected(el.innerText);
            }).reduce(function (prevSelected, nextSelected) {
                return prevSelected && nextSelected;
            }, true);
            visible ? $row.show() : $row.hide();
        });
    };
    FilterCollection.prototype.sort = function (column, order, table) {
        var rows, switching, i, x, y, shouldSwitch;
        switching = true;
        while (switching) {
            switching = false;
            rows = table.getElementsByTagName("tr");
            for (i = 1; i < rows.length - 1; i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("td")[column];
                y = rows[i + 1].getElementsByTagName("td")[column];
                if (order === 'a-to-z') {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                } else {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }
    };
    return FilterCollection;
}();

$$1.fn.excelTableFilter = function (options) {
    var target = this;
    options = $$1.extend({}, $$1.fn.excelTableFilter.options, options);
    var filterCollection = new FilterCollection(target);
    filterCollection.initialize();
    return target;
};
$$1.fn.excelTableFilter.options = {};

}(jQuery));
//# sourceMappingURL=excel-bootstrap-table-filter-bundle.js.map
