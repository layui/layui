/**
 * layui.tableFilter
 * Table header filtering and search functionality
 * Extends table module with column filtering capabilities
 */

layui.define(['table', 'form', 'dropdown'], function(exports) {
  "use strict";

  var $ = layui.$;
  var table = layui.table;
  var form = layui.form;
  var dropdown = layui.dropdown;
  var MOD_NAME = 'tableFilter';

  // Filter configuration
  var config = {
    filterIcon: '<i class="layui-icon layui-icon-filter"></i>',
    searchIcon: '<i class="layui-icon layui-icon-search"></i>',
    clearIcon: '<i class="layui-icon layui-icon-close"></i>',
    filterClass: 'layui-table-filter',
    activeClass: 'layui-table-filter-active'
  };

  // Filter cache
  var filterCache = {};

  // Table filter class
  var TableFilter = function(options) {
    this.options = $.extend({}, config, options);
    this.tableId = options.tableId;
    this.init();
  };

  // Initialize filter
  TableFilter.prototype.init = function() {
    var that = this;
    var tableId = that.tableId;
    
    // Initialize filter cache
    if (!filterCache[tableId]) {
      filterCache[tableId] = {
        filters: {},
        originalData: null
      };
    }
    
    that.renderFilterIcons();
    that.bindEvents();
  };

  // Render filter icons in table headers
  TableFilter.prototype.renderFilterIcons = function() {
    var that = this;
    var tableId = that.tableId;
    var $table = $('#' + tableId).next('.layui-table-view');
    
    // Add filter icon to each filterable column
    $table.find('.layui-table-header th[data-field]').each(function() {
      var $th = $(this);
      var field = $th.data('field');
      var filterType = $th.data('filter-type') || 'text'; // text, select, date, number
      
      if (field && !$th.find('.' + config.filterClass).length) {
        var $filterBtn = $('<span class="' + config.filterClass + '">' + config.filterIcon + '</span>');
        $th.find('.layui-table-cell').append($filterBtn);
      }
    });
  };

  // Bind filter events
  TableFilter.prototype.bindEvents = function() {
    var that = this;
    var tableId = that.tableId;
    var $table = $('#' + tableId).next('.layui-table-view');
    
    // Click filter icon
    $table.on('click', '.' + config.filterClass, function(e) {
      e.stopPropagation();
      var $btn = $(this);
      var $th = $btn.closest('th');
      var field = $th.data('field');
      var filterType = $th.data('filter-type') || 'text';
      
      that.showFilterDropdown($btn, field, filterType);
    });
  };

  // Show filter dropdown
  TableFilter.prototype.showFilterDropdown = function($btn, field, filterType) {
    var that = this;
    var tableId = that.tableId;
    var currentFilter = filterCache[tableId].filters[field] || '';
    
    var content = that.getFilterContent(field, filterType, currentFilter);
    
    dropdown.render({
      elem: $btn,
      data: [{
        title: content,
        type: 'html'
      }],
      trigger: 'click',
      style: 'width: 250px; padding: 10px;',
      ready: function() {
        that.bindFilterActions(field, filterType);
      }
    });
  };

  // Get filter content HTML
  TableFilter.prototype.getFilterContent = function(field, filterType, currentValue) {
    var html = '<div class="layui-table-filter-content">';
    
    switch(filterType) {
      case 'text':
        html += '<input type="text" class="layui-input layui-table-filter-input" ';
        html += 'placeholder="Search..." value="' + (currentValue || '') + '" />';
        break;
        
      case 'number':
        html += '<div class="layui-form-item">';
        html += '<input type="number" class="layui-input layui-table-filter-min" placeholder="Min" />';
        html += '</div>';
        html += '<div class="layui-form-item">';
        html += '<input type="number" class="layui-input layui-table-filter-max" placeholder="Max" />';
        html += '</div>';
        break;
        
      case 'select':
        html += '<div class="layui-table-filter-options">';
        html += that.getUniqueValues(field);
        html += '</div>';
        break;
        
      case 'date':
        html += '<div class="layui-form-item">';
        html += '<input type="text" class="layui-input layui-table-filter-date-start" placeholder="Start Date" />';
        html += '</div>';
        html += '<div class="layui-form-item">';
        html += '<input type="text" class="layui-input layui-table-filter-date-end" placeholder="End Date" />';
        html += '</div>';
        break;
    }
    
    html += '<div class="layui-table-filter-actions" style="margin-top: 10px;">';
    html += '<button class="layui-btn layui-btn-sm layui-table-filter-apply">Apply</button>';
    html += '<button class="layui-btn layui-btn-sm layui-btn-primary layui-table-filter-clear">Clear</button>';
    html += '</div>';
    html += '</div>';
    
    return html;
  };

  // Get unique values for select filter
  TableFilter.prototype.getUniqueValues = function(field) {
    var that = this;
    var tableId = that.tableId;
    var tableData = table.cache[tableId] || [];
    var values = {};
    var html = '';
    
    // Collect unique values
    tableData.forEach(function(row) {
      var value = row[field];
      if (value !== undefined && value !== null && value !== '') {
        values[value] = true;
      }
    });
    
    // Generate checkboxes
    Object.keys(values).sort().forEach(function(value) {
      html += '<div class="layui-form-item">';
      html += '<input type="checkbox" lay-skin="primary" value="' + value + '" title="' + value + '">';
      html += '</div>';
    });
    
    return html || '<div>No options available</div>';
  };

  // Bind filter actions
  TableFilter.prototype.bindFilterActions = function(field, filterType) {
    var that = this;
    
    // Apply filter
    $(document).on('click', '.layui-table-filter-apply', function() {
      var filterValue = that.getFilterValue(filterType);
      that.applyFilter(field, filterValue, filterType);
      dropdown.close('all');
    });
    
    // Clear filter
    $(document).on('click', '.layui-table-filter-clear', function() {
      that.clearFilter(field);
      dropdown.close('all');
    });
  };

  // Get filter value from inputs
  TableFilter.prototype.getFilterValue = function(filterType) {
    var value = null;
    
    switch(filterType) {
      case 'text':
        value = $('.layui-table-filter-input').val();
        break;
        
      case 'number':
        value = {
          min: $('.layui-table-filter-min').val(),
          max: $('.layui-table-filter-max').val()
        };
        break;
        
      case 'select':
        value = [];
        $('.layui-table-filter-options input:checked').each(function() {
          value.push($(this).val());
        });
        break;
        
      case 'date':
        value = {
          start: $('.layui-table-filter-date-start').val(),
          end: $('.layui-table-filter-date-end').val()
        };
        break;
    }
    
    return value;
  };

  // Apply filter to table
  TableFilter.prototype.applyFilter = function(field, value, filterType) {
    var that = this;
    var tableId = that.tableId;
    
    // Save filter
    filterCache[tableId].filters[field] = value;
    
    // Save original data if first filter
    if (!filterCache[tableId].originalData) {
      filterCache[tableId].originalData = table.cache[tableId];
    }
    
    // Filter data
    var filteredData = that.filterData(filterCache[tableId].originalData, filterCache[tableId].filters);
    
    // Reload table with filtered data
    table.reload(tableId, {
      data: filteredData
    });
    
    // Mark filter as active
    that.markFilterActive(field, true);
  };

  // Filter data based on all active filters
  TableFilter.prototype.filterData = function(data, filters) {
    return data.filter(function(row) {
      for (var field in filters) {
        var filterValue = filters[field];
        var rowValue = row[field];
        
        // Text filter
        if (typeof filterValue === 'string') {
          if (rowValue === null || rowValue === undefined) return false;
          if (String(rowValue).toLowerCase().indexOf(filterValue.toLowerCase()) === -1) {
            return false;
          }
        }
        
        // Number range filter
        else if (filterValue && filterValue.min !== undefined) {
          var num = parseFloat(rowValue);
          if (filterValue.min && num < parseFloat(filterValue.min)) return false;
          if (filterValue.max && num > parseFloat(filterValue.max)) return false;
        }
        
        // Select filter (array)
        else if (Array.isArray(filterValue) && filterValue.length > 0) {
          if (filterValue.indexOf(String(rowValue)) === -1) return false;
        }
        
        // Date range filter
        else if (filterValue && filterValue.start !== undefined) {
          var date = new Date(rowValue);
          if (filterValue.start && date < new Date(filterValue.start)) return false;
          if (filterValue.end && date > new Date(filterValue.end)) return false;
        }
      }
      return true;
    });
  };

  // Clear filter
  TableFilter.prototype.clearFilter = function(field) {
    var that = this;
    var tableId = that.tableId;
    
    // Remove filter
    delete filterCache[tableId].filters[field];
    
    // If no more filters, restore original data
    if (Object.keys(filterCache[tableId].filters).length === 0) {
      table.reload(tableId, {
        data: filterCache[tableId].originalData
      });
      filterCache[tableId].originalData = null;
    } else {
      // Re-filter with remaining filters
      var filteredData = that.filterData(filterCache[tableId].originalData, filterCache[tableId].filters);
      table.reload(tableId, {
        data: filteredData
      });
    }
    
    // Mark filter as inactive
    that.markFilterActive(field, false);
  };

  // Mark filter icon as active/inactive
  TableFilter.prototype.markFilterActive = function(field, active) {
    var that = this;
    var tableId = that.tableId;
    var $table = $('#' + tableId).next('.layui-table-view');
    var $th = $table.find('th[data-field="' + field + '"]');
    var $filterBtn = $th.find('.' + config.filterClass);
    
    if (active) {
      $filterBtn.addClass(config.activeClass);
    } else {
      $filterBtn.removeClass(config.activeClass);
    }
  };

  // Public API
  var tableFilter = {
    // Render filter for table
    render: function(options) {
      return new TableFilter(options);
    },
    
    // Clear all filters for a table
    clearAll: function(tableId) {
      if (filterCache[tableId]) {
        filterCache[tableId].filters = {};
        if (filterCache[tableId].originalData) {
          table.reload(tableId, {
            data: filterCache[tableId].originalData
          });
          filterCache[tableId].originalData = null;
        }
      }
    },
    
    // Get current filters
    getFilters: function(tableId) {
      return filterCache[tableId] ? filterCache[tableId].filters : {};
    }
  };

  exports(MOD_NAME, tableFilter);
});
