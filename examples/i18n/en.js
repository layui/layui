/**
 * English (en)
 */

// Common English internationalization message object
export default {
  code: {
    copy: 'Copy Code',
    copied: 'Copied',
    copyError: 'Copy Failed',
    maximize: 'Maximize',
    restore: 'Restore',
    preview: 'Preview in New Window'
  },
  colorpicker: {
    clear: 'Clear',
    confirm: 'OK'
  },
  dropdown: {
    noData: 'No Data'
  },
  flow: {
    loadMore: 'Load More',
    noMore: 'No More Data'
  },
  form: {
    select: {
      noData: 'No Data',
      noMatch: 'No Matching Data',
      placeholder: 'Please Select'
    },
    validateMessages: {
      required: 'This field is required',
      phone: 'Invalid phone number format',
      email: 'Invalid email format',
      url: 'Invalid URL format',
      number: 'Numbers only',
      date: 'Invalid date format',
      identity: 'Invalid ID number format'
    },
    verifyErrorPromptTitle: 'Notice'
  },
  layer: {
    confirm: 'OK',
    cancel: 'Cancel',
    defaultTitle: 'Info',
    prompt: {
      InputLengthPrompt: 'Maximum {length} characters'
    },
    photos: {
      noData: 'No Image',
      tools: {
        rotate: 'Rotate',
        scaleX: 'Flip Horizontally',
        zoomIn: 'Zoom In',
        zoomOut: 'Zoom Out',
        reset: 'Reset',
        close: 'Close'
      },
      viewPicture: 'View Original',
      urlError: {
        prompt: 'Image URL is invalid<br>Continue to next one?',
        confirm: 'Next',
        cancel: 'Cancel'
      }
    }
  },
  laypage: {
    prev: 'Prev',
    next: 'Next',
    first: 'First',
    last: 'Last',
    total: 'Total {total} items',
    pagesize: 'items/page',
    goto: 'Go to',
    page: 'page',
    confirm: 'Confirm'
  },
  table: {
    sort: {
      asc: 'Ascending',
      desc: 'Descending'
    },
    noData: 'No Data',
    tools: {
      filter: {
        title: 'Filter Columns'
      },
      export: {
        title: 'Export',
        noDataPrompt: 'No data in the table',
        compatPrompt: 'Export is not supported in IE. Please use Chrome or another modern browser.',
        csvText: 'Export CSV File'
      },
      print: {
        title: 'Print',
        noDataPrompt: 'No data in the table'
      }
    },
    dataFormatError: 'Returned data is invalid. The correct success status code should be: "{statusName}": {statusCode}',
    xhrError: 'Request Error: {msg}'
  },
  transfer: {
    noData: 'No Data',
    noMatch: 'No Match',
    title: ['List One', 'List Two'],
    searchPlaceholder: 'Search by Keyword'
  },
  tree: {
    defaultNodeName: 'Unnamed',
    noData: 'No Data',
    deleteNodePrompt: 'Are you sure you want to delete the node "{name}"?'
  },
  upload: {
    fileType: {
      file: 'File',
      image: 'Image',
      video: 'Video',
      audio: 'Audio'
    },
    validateMessages: {
      fileExtensionError: 'Unsupported format in selected {fileType}',
      filesOverLengthLimit: 'Maximum {length} files allowed at once',
      currentFilesLength: 'You have selected {length} files',
      fileOverSizeLimit: 'File size must not exceed {size}'
    },
    chooseText: '{length} files'
  },
  util: {
    timeAgo: {
      days: '{days} days ago',
      hours: '{hours} hours ago',
      minutes: '{minutes} minutes ago',
      future: 'In the future',
      justNow: 'Just now'
    },
    toDateString: {
      meridiem: function (hours, minutes) {
        var hm = hours * 100 + minutes;
        if (hm < 600) {
          return 'Midnight';
        } else if (hm < 900) {
          return 'Morning';
        } else if (hm < 1100) {
          return 'Forenoon';
        } else if (hm < 1300) {
          return 'Noon';
        } else if (hm < 1800) {
          return 'Afternoon';
        }
        return 'Evening';
      }
    }
  }
};
