import $ from 'jquery';
import { FilterCollection } from './FilterCollection';
$.fn.excelTableFilter = function (options) {
    var target = this;
    options = $.extend({}, $.fn.excelTableFilter.options, options);
    var filterCollection = new FilterCollection(target);
    filterCollection.initialize();
    return target;
};
$.fn.excelTableFilter.options = {};
//# sourceMappingURL=excel-bootstrap-table-filter.js.map