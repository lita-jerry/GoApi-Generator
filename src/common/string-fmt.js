/*
字符串格式化工具

1, 驼峰转下划线方法
2, 生成指定长度字符串，不足位右补空格
*/

// 驼峰转下划线
const StringToBottomLine = (str) => {
	// let result = str.replace(/([A-Z])/g,"_$1").toLowerCase()
	// 以上暴力转换 有很多问题 以下重写
	// var splistCount = 0 // 本次切割长度
	var splitTag = false // 标记切割开始生效，下次遇到大写Or数字切割
	// var continuousUpperTag = false // 连续大写标记
	var splitType = null // 此次切割数据类型 letter number
	var result = '' // 分割后的字符串
		
	for (let index = 0; index < str.length; index++) {
	  const item = str[index]
	  var lastStr = null
	  var nextStr = null
	  if (index > 0) {
	    lastStr = str[index - 1]
	  }
	  if ((index + 1) < str.length) {
	    nextStr = str[index + 1]
	  }
	  let itemType = null
	  // splistCount++
	  // 字母
	  if (/[a-z]/.test(item) || /[A-Z]/.test(item)) {
	    itemType = 'letter'
	  } else if (/[0-9]/.test(item)) { // 数字
	    itemType = 'number'
	  } else {
	    continue
	  }
	  // 如果没有设置此次切割类型
	  if (!splitType) {
	    splitType = itemType
	  }
	  // 小写略过
	  if (/[a-z]/.test(item)) {
	    if (splitType !== itemType) {
	      result += '_'
	      splitType = itemType
	    }
	    result += item
	    splitTag = true
	    continue
	  }
		
	  // 数据类型不同 一定切割
	  if (splitType !== itemType) {
	    result += '_' + item.toLowerCase()
	    splitType = itemType
	    continue
	  }
		
	  // 大写
	  if (/[A-Z]/.test(item)) {
	    // 判断下一位是不是小写
	    if (lastStr && nextStr && /[a-z]/.test(nextStr)) {
	      result += ('_' + item.toLowerCase())
	      splitType = itemType
	      // splistCount = 0
	      continue
	    }
		
	    if (splitTag) {
	      result += '_'
	      splitType = itemType
	    }
	    result += item.toLowerCase()
		
	    if (/[A-Z]/.test(nextStr)) {
	      splitTag = false
	    }
		
	    continue
	  }
		
	  result += item
	}
		
	// return str + ' -> ' + result
	return result
}

// 生成指定长度字符串，不足位右补空格
const MakeSameStringLength = (str, length) => {
	var result = str
	const strLength = str.length
	if (strLength < length) {
		const subLength = length - strLength
		for (let i = 0; i < subLength; i++) {
			result += ' '
		}
	}
	return result
}

// 格式化字符串
const ReplaceFormatString = (str, args) => {
	if (args.length === 0) {
		return str
	}
	var result = str
	if (typeof args === 'object') {
		for (var key in args) {
			if (args[key] === undefined) continue
			result = result.replace(new RegExp('({' + key + '})', 'g'), args[key])
		}
	} else {
		for (var i = 0; i < args.length; i++) {
			if (args[i] === undefined) continue
			result = result.replace(new RegExp('({[' + i + ']})', 'g'), args[i])
		}
	}
	return result.toString()
}

export { StringToBottomLine, MakeSameStringLength, ReplaceFormatString }