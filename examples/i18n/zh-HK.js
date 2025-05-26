/**
 * 繁體中文 (zh-HK)
 */

export default {
  code: {
    copy: '複製代碼',
    copied: '已複製',
    copyError: '複製失敗',
    maximize: '最大化顯示',
    restore: '還原顯示',
    preview: '在新視窗預覽'
  },
  colorpicker: {
    clear: '清除',
    confirm: '確定'
  },
  dropdown: {
    noData: '暫無資料'
  },
  flow: {
    loadMore: '載入更多',
    noMore: '沒有更多了'
  },
  form: {
    select: {
      noData: '暫無資料',
      noMatch: '無匹配資料',
      placeholder: '請選擇'
    },
    validateMessages: {
      required: '必填項不能為空',
      phone: '手機號碼格式不正確',
      email: '電郵格式不正確',
      url: '連結格式不正確',
      number: '只能填寫數字',
      date: '日期格式不正確',
      identity: '身份證號碼格式不正確'
    },
    verifyErrorPromptTitle: '提示'
  },
  layer: {
    confirm: '確定',
    cancel: '取消',
    defaultTitle: '資訊',
    prompt: {
      InputLengthPrompt: '最多輸入 {length} 個字符'
    },
    photos: {
      noData: '沒有圖片',
      tools:{
        rotate: '旋轉',
        scaleX: '水平變換',
        zoomIn: '放大',
        zoomOut: '縮小',
        reset: '還原',
        close: '關閉'
      },
      viewPicture: '查看原圖',
      urlError: {
        prompt: '當前圖片地址異常，<br>是否繼續查看下一張？',
        confirm: '下一張',
        cancel: '不看了'
      }
    }
  },
  laypage: {
    prev: '上一頁',
    next: '下一頁',
    first: '首頁',
    last: '尾頁',
    total: '共 {total} 條',
    pagesize: '條/頁',
    goto: '到第',
    page: '頁',
    confirm: '確定'
  },
  table: {
    sort: {
      asc: '升序',
      desc: '降序'
    },
    noData: '無資料',
    tools:{
      filter: {
        title: '篩選列'
      },
      export: {
        title: '匯出',
        noDataPrompt: '當前表格無資料',
        compatPrompt: '匯出功能不支援 IE，請用 Chrome 等高級瀏覽器匯出',
        csvText : '匯出 CSV 檔案'
      },
      print: {
        title: '列印',
        noDataPrompt: '當前表格無資料'
      }
    },
    dataFormatError: '返回的資料不符合規範，正確的成功狀態碼應為："{statusName}": {statusCode}',
    xhrError: '請求異常，錯誤提示：{msg}'
  },
  transfer: {
    noData: '無資料',
    noMatch: '無匹配資料',
    title: ['列表一', '列表二'],
    searchPlaceholder: '關鍵詞搜尋'
  },
  tree: {
    defaultNodeName: '未命名',
    noData: '無資料',
    deleteNodePrompt: '確認刪除"{name}"節點嗎？'
  },
  upload: {
    fileType: {
      file: '檔案',
      image: '圖片',
      video: '影片',
      audio: '音訊'
    },
    validateMessages: {
      fileExtensionError: '選擇的{fileType}中包含不支援的格式',
      filesOverLengthLimit: '同時最多只能上傳: {length} 個檔案',
      currentFilesLength: '您當前已經選擇了: {length} 個檔案',
      fileOverSizeLimit: '檔案大小不能超過 {size}'
    },
    chooseText: '{length} 個檔案'
  },
  util: {
    timeAgo: {
      days: '{days} 天前',
      hours: '{hours} 小時前',
      minutes: '{minutes} 分鐘前',
      future: '未來',
      justNow: '剛剛'
    },
    toDateString: {
      meridiem: function(hours, minutes){
        var hm = hours * 100 + minutes;
        if (hm < 600) {
          return '凌晨';
        } else if (hm < 900) {
          return '早上';
        } else if (hm < 1100) {
          return '上午';
        } else if (hm < 1300) {
          return '中午';
        } else if (hm < 1800) {
          return '下午';
        }
        return '晚上';
      }
    }
  }
};
