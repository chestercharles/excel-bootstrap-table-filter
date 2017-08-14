import { FilterMenu } from './FilterMenu';
var FilterCollection = (function () {
    function FilterCollection(target, options) {
        this.target = target;
        this.options = options;
        this.ths = target.find('th' + options.columnSelector).toArray();
        this.filterMenus = this.ths.map(function (th, index) {
            var column = $(th).index();
            return new FilterMenu(target, th, column, index, options);
        });
        this.rows = target.find('tbody').find('tr').toArray();
        this.table = target.get(0);
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
        var ths = this.ths;
        var updateRowVisibility = this.updateRowVisibility;
        this.target.find('.dropdown-filter-menu-item.item').change(function () {
            var index = $(this).data('index');
            var value = $(this).val();
            filterMenus[index].updateSelectAll();
            updateRowVisibility(filterMenus, rows, ths);
        });
    };
    FilterCollection.prototype.bindSelectAllCheckboxes = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var ths = this.ths;
        var updateRowVisibility = this.updateRowVisibility;
        this.target.find('.dropdown-filter-menu-item.select-all').change(function () {
            var index = $(this).data('index');
            var value = this.checked;
            filterMenus[index].selectAllUpdate(value);
            updateRowVisibility(filterMenus, rows, ths);
        });
    };
    FilterCollection.prototype.bindSort = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var ths = this.ths;
        var sort = this.sort;
        var table = this.table;
        var updateRowVisibility = this.updateRowVisibility;
        this.target.find('.dropdown-filter-sort').click(function () {
            var $sortElement = $(this).find('span');
            var column = $sortElement.data('column');
            var order = $sortElement.attr('class');
            sort(column, order, table);
            updateRowVisibility(filterMenus, rows, ths);
        });
    };
    FilterCollection.prototype.bindSearch = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var ths = this.ths;
        var updateRowVisibility = this.updateRowVisibility;
        this.target.find('.dropdown-filter-search').keyup(function () {
            var $input = $(this).find('input');
            var index = $input.data('index');
            var value = $input.val();
            filterMenus[index].searchToggle(value);
            updateRowVisibility(filterMenus, rows, ths);
        });
    };
    FilterCollection.prototype.updateRowVisibility = function (filterMenus, rows, ths) {
        var showRows = rows;
        var hideRows = [];
        var selectedLists = filterMenus.map(function (filterMenu) {
            return {
                column: filterMenu.column,
                selected: filterMenu.inputs
                    .filter(function (input) {
                    return input.checked;
                }).map(function (input) {
                    return input.value.trim().replace(/ +(?= )/g, '');
                })
            };
        });
        for (var i = 0; i < rows.length; i++) {
            var tds = rows[i].children;
            for (var j = 0; j < selectedLists.length; j++) {
                var content = tds[selectedLists[j].column].textContent.trim().replace(/ +(?= )/g, '');
                if (selectedLists[j].selected.indexOf(content) === -1) {
                    $(rows[i]).hide();
                    break;
                }
                $(rows[i]).show();
            }
        }
    };
    FilterCollection.prototype.sort = function (column, order, table) {
        var flip = 1;
        if (order === 'z-to-a')
            flip = -1;
        var tbody = $(table).find('tbody').get(0);
        var rows = $(tbody).find('tr').get();
        rows.sort(function (a, b) {
            var A = a.children[column].textContent.toUpperCase();
            var B = b.children[column].textContent.toUpperCase();
            if (!isNaN(Number(A)) && !isNaN(Number(B))) {
                if (Number(A) < Number(B))
                    return -1 * flip;
                if (Number(A) > Number(B))
                    return 1 * flip;
            }
            else {
                if (A < B)
                    return -1 * flip;
                if (A > B)
                    return 1 * flip;
            }
            return 0;
        });
        for (var i = 0; i < rows.length; i++) {
            tbody.appendChild(rows[i]);
        }
    };
    return FilterCollection;
}());
export { FilterCollection };
//# sourceMappingURL=FilterCollection.js.map