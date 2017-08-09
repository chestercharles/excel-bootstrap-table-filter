import $ from 'jquery';
import { FilterCollection } from './FilterCollection'

// Define the plugin function on the jQuery extension point.
($.fn as any).excelTableFilter = function (this: JQuery, options: Options) {
  let target = this;
  // Merge the global options with the per-call options.
  options = $.extend({}, ($.fn as any).excelTableFilter.options, options);
  
  let filterCollection = new FilterCollection(target);
  filterCollection.initialize();

  // Return the jQuery object for chaining.
  return target;
};

// Define the plugin's global default options.
($.fn as any).excelTableFilter.options = {};
