/*
代码生成器

1, 生成数据库表结构
2, 生成Bean Struct rows为二维数组
*/

import { MakeSameStringLength, ReplaceFormatString } from './string-fmt.js'

// 生成数据库表结构
const GenerateDataBase = (className, useGormModel, columns) => {
	var rows = []
	// 是否使用GORM Model
	if (useGormModel) {
		rows.push(['gorm.Model'])
	}
	// 遍历列
	for (var item of columns) {
		const column = []
		// 名字
		column.push(item.name)
		// 类型
		var type = item.type
		type = (type === 'time' ? 'time.Time' : type)
		if (!item.isNotNull) {
			type = '*' + type // 用指针表示可为空
		}
		column.push(type)
		// 注释部分
		let comment = ''
		// 注释开始
		if (item.table) {
			comment += `column:` + item.table + `; `
		}
		if (item.primaryKey) {
			comment += `primaryKey; `
		}
		if (item.dataLength > 0 && (item.type==='string'||item.type==='int'||item.type==='uint')) {
			comment += `size:` + item.dataLength + `; `
		}
		if (item.isNotNull) {
			comment += `not null; `
		}
		if (item.autoIncrement) {
			comment += `autoIncrement; `
		}
		if (item.unique) {
			comment += `unique; `
		}
		if (item.default) {
			if (item.type === 'time') {
				comment += `default:'` + item.default + `'; `
			} else {
				comment += `default:` + item.default + `; `
			}
		}
		if (item.comment) {
			comment += `comment:` + item.comment + `; `
		}
    if (comment.length > 0) {
      if (comment[comment.length - 1] === ' ') {
        comment = comment.slice(0, comment.length - 1)
      }
      column.push(`\`gorm:"` + comment + `"\``)
    }
    // 注释结尾
		rows.push(column)
	}

	return GenerateBeanStruct(className, rows, className)
}

// 生成Bean Struct rows为二维数组
const GenerateBeanStruct = (name, rows, comment) => {
	var result = ``
	if (comment) {
		result += `\/\/` + comment + `\n`
	}
	result += `type ` + name + ` struct {\n`
	// 生成rows
	var rowsItemMaxLength = [] // 数组保存最长字符串长度
	// 第一次遍历最大长度
	rows.forEach((rowsLine) => {
		rowsLine.forEach((rowsLineItem, rowsLineIndex) => {
			if (!rowsItemMaxLength[rowsLineIndex] || rowsLineItem.length > rowsItemMaxLength[rowsLineIndex]) {
				rowsItemMaxLength[rowsLineIndex] = rowsLineItem.length
			}
		})
	})
	// 第二次遍历生成row
	rows.forEach((rowsLine) => {
		var row = `    `
		rowsLine.forEach((rowsLineItem, rowsLineIndex) => {
			row += (MakeSameStringLength(rowsLineItem, rowsItemMaxLength[rowsLineIndex]) + ' ')
		})
		row += `\n`
		result += row
	})

	result += `}\n`
	return result
}

// 增删改查 Model方法 Start

const GenerateModelCreateMethod = (funcVal, className, debug) => {
	var result = ''

	if (funcVal.multiple) {
		result =
			`\/\/ {comment}\n` +
			`func {func}(datas []{bean}) (rowsAffected int64, err error) {\n` +
			`    result := db{debug}.Create(&datas)\n` +
			`    return result.RowsAffected, result.Error\n` +
			`}`
	} else {
		result =
			`\/\/ {comment}\n` +
			`func (data {bean}) {func}() (rowsAffected int64, err error) {\n` +
			`    result := db{debug}.Create(&data)\n` +
			`    return result.RowsAffected, result.Error\n` +
			`}`
	}

	result = ReplaceFormatString(result, {
		debug: debug ? '.Debug()' : '',
		func: funcVal.name,
		bean: className,
		comment: funcVal.comment
	})

	return result
}

const GenerateModelDeleteMethod = (funcVal, className, debug) => {
	var result =
		`\/\/ {comment}\n` +
		`func (data {bean}) {func}(query interface{}, args ...interface{}) (rowsAffected int64, err error) {\n` +
		`    result := db{debug}.Where(query, args).Delete(&data)\n` +
		`    return result.RowsAffected, result.Error\n` +
		`}`

	result = ReplaceFormatString(result, {
		debug: debug ? '.Debug()' : '',
		func: funcVal.name,
		bean: className,
		comment: funcVal.comment
	})
	return result
}

const GenerateModelUpdateMethod = (funcVal, className, debug) => {
	var result =
		`\/\/ {comment}\n` +
		`func (data {bean}) {func}(query interface{}, args ...interface{}) (rowsAffected int64, err error) {\n` +
		`    result := db{debug}.Model({bean}{}).Where(query, args).Updates(data)\n` +
		`    return result.RowsAffected, result.Error\n` +
		`}`
	result = ReplaceFormatString(result, {
		debug: debug ? '.Debug()' : '',
		func: funcVal.name,
		bean: className,
		comment: funcVal.comment
	})
	return result
}

const GenerateModelFindMethod = (funcVal, className, debug) => {
	var result = ''
	if (funcVal.multiple) {
		result +=
			`\/\/ {comment}\n` +
			`func {func}(query interface{}, args ...interface{}) (res {bean}) {\n` +
			`    db{debug}.Where(query, args).Model(&{bean}{}).Find(&res)\n` +
			`    return res\n` +
			`}`
	} else {
		result +=
			`\/\/ {comment}\n` +
			`func {func}(query interface{}, args ...interface{}) (res {bean}) {\n` +
			`    db{debug}.Where(query, args).Model(&{bean}{}).First(&res)\n` +
			`    return res\n` +
			`}`
	}


	result = ReplaceFormatString(result, {
		debug: debug ? '.Debug()' : '',
		func: funcVal.name,
		bean: className,
		comment: funcVal.comment
	})

	return result
}

// 增删改查 Model方法 End

// 增删改查 方法 Start

const GenerateCreateMethod = (funcVal, className, debug) => {
	var result = ''

	if (funcVal.multiple) {
		result =
			`\/\/ {comment}\n` +
			`func {func}(datas []{bean}) (rowsAffected int64, err error) {\n` +
			`    result := db{debug}.Create(&datas)\n` +
			`    return result.RowsAffected, result.Error\n` +
			`}`
	} else {
		result =
			`\/\/ {comment}\n` +
			`func (data {bean}) {func}() (rowsAffected int64, err error) {\n` +
			`    result := db{debug}.Create(&data)\n` +
			`    return result.RowsAffected, result.Error\n` +
			`}`
	}

	result = ReplaceFormatString(result, {
		debug: debug ? '.Debug()' : '',
		func: funcVal.name,
		bean: className,
		comment: funcVal.comment
	})

	return result
}

const GenerateDeleteMethod = (funcVal, className, debug) => {
	var result =
		`\/\/ {comment}\n` +
		`func (data {bean}) {func}(query interface{}, args ...interface{}) (rowsAffected int64, err error) {\n` +
		`    result := db{debug}.Where(query, args).Delete(&data)\n` +
		`    return result.RowsAffected, result.Error\n` +
		`}`

	result = ReplaceFormatString(result, {
		debug: debug ? '.Debug()' : '',
		func: funcVal.name,
		bean: className,
		comment: funcVal.comment
	})
	return result
}

const GenerateUpdateMethod = (funcVal, className, debug) => {
	var result =
		`\/\/ {comment}\n` +
		`func (data {bean}) {func}(query interface{}, args ...interface{}) (rowsAffected int64, err error) {\n` +
		`    result := db{debug}.Model({bean}{}).Where(query, args).Updates(data)\n` +
		`    return result.RowsAffected, result.Error\n` +
		`}`
	result = ReplaceFormatString(result, {
		debug: debug ? '.Debug()' : '',
		func: funcVal.name,
		bean: className,
		comment: funcVal.comment
	})
	return result
}

const GenerateFindMethod = (funcVal, className, debug) => {
	var result = ''
	if (funcVal.json.filter((item) => item.json === '-').length > 0) {
		result += GenerateBeanStruct(funcVal.name + 'ResBean', funcVal.json.map((item) => [item.key, `\`json:"` + item.json + `"\``]))
	}
	if (funcVal.multiple) {
		result +=
			`\/\/ {comment}\n` +
			`func {func}(query interface{}, args ...interface{}) (res {resBean}) {\n` +
			`    db{debug}.Where(query, args).Model(&{bean}{}).Find(&res)\n` +
			`    return res\n` +
			`}`
	} else {
		result +=
			`\/\/ {comment}\n` +
			`func {func}(query interface{}, args ...interface{}) (res {resBean}) {\n` +
			`    db{debug}.Where(query, args).Model(&{bean}{}).First(&res)\n` +
			`    return res\n` +
			`}`
	}

	const resultBeanName = funcVal.name + 'ResBean'

	result = ReplaceFormatString(result, {
		debug: debug ? '.Debug()' : '',
		func: funcVal.name,
		bean: className,
		resBean: resultBeanName,
		comment: funcVal.comment
	})

	return result
}

// 增删改查 方法 End

export { GenerateDataBase,
				 GenerateBeanStruct,
				 
				 GenerateModelCreateMethod,
				 GenerateModelDeleteMethod,
				 GenerateModelUpdateMethod,
				 GenerateModelFindMethod,
				 
				 GenerateCreateMethod,
				 GenerateDeleteMethod,
				 GenerateUpdateMethod,
				 GenerateFindMethod
				}