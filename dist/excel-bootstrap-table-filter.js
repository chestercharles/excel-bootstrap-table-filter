import $ from 'jquery';
import { FilterCollection } from './FilterCollection';
$.fn.excelTableFilter = function (options) {
    var target = this;
    options = $.extend({}, $.fn.excelTableFilter.options, options);
    if (typeof options.columnSelector === 'undefined')
        options.columnSelector = '';
    if (typeof options.sort === 'undefined')
        options.sort = true;
    if (typeof options.search === 'undefined')
        options.search = true;
    var filterCollection = new FilterCollection(target, options);
    filterCollection.initialize();
    return target;
};
$.fn.excelTableFilter.options = {};
//# sourceMappingURL=excel-bootstrap-table-filter.js.map