import { FilterMenu } from './FilterMenu';
var FilterCollection = (function () {
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
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("td")[column];
                y = rows[i + 1].getElementsByTagName("td")[column];
                if (order === 'a-to-z') {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
                else {
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
}());
export { FilterCollection };
//# sourceMappingURL=FilterCollection.js.map