<template>
  <div class="wrap">
    <!-- 数据库表 -->
    <div class="actions-box">
      <div class="label-title">Class Name:</div>
      <el-input v-model="className" class="input-name" />
      <el-checkbox v-model="useGormModel" style="margin-left: 10px;">Use Gorm Model</el-checkbox>
      <el-checkbox v-model="isGORMDebug" style="margin-left: 10px;">Open Gorm Debug</el-checkbox>
      <el-button type="primary" class="btn-action" @click="onImportConfig()">Import</el-button>
      <el-button type="success" class="btn-action" @click="onExportConfig()">Export</el-button>
      <div style="flex: 1;"></div>
      <el-button type="warning" class="btn-action" @click="onExample()">Example</el-button>
      <el-button type="warning" class="btn-action">Reset</el-button>
    </div>
    
    <el-table :data="listColumn" border fit highlight-current-row>
      <el-table-column align="center" label="Name" width="130">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" placeholder="Row name" />
        </template>
      </el-table-column>
			<el-table-column align="center" label="Table" width="130">
			  <template slot-scope="scope">
			    <el-input v-model="scope.row.table" placeholder="Table name" />
			  </template>
			</el-table-column>
      <el-table-column align="center" label="Comment" min-width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.comment" placeholder="Row comment" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Type" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" @change="onTableTypeChanged(scope.$index, scope.row)">
            <el-option v-for="item in tableTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Not null" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isNotNull" active-color="#409EFF" inactive-color="#D8D8D8" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Length" width="220">
        <template slot-scope="scope">
          <el-radio v-model="scope.row.dataLength.isDefault" :label="true">Default</el-radio>
          <el-radio v-model="scope.row.dataLength.isDefault" :label="false">
            <el-input-number
              v-model="scope.row.dataLength.value"
              label=""
              :controls="false"
              size="small"
              style="width: 70px;"
            />
          </el-radio>
        </template>
      </el-table-column>
      <el-table-column align="center" label="PrimaryKey" width="100">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.primaryKey" active-color="#409EFF" inactive-color="#D8D8D8" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Auto increment" width="125">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.autoIncrement" active-color="#409EFF" inactive-color="#D8D8D8" />
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="Unsigned" width="95">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.unsigned" active-color="#409EFF" inactive-color="#D8D8D8" />
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="Unique" width="95">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.unique" active-color="#409EFF" inactive-color="#D8D8D8" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Default" width="260">
        <template slot-scope="scope">
          <el-input v-if="scope.row.type=='string'" v-model="scope.row.default" placeholder="Default string" />
          <el-switch
            v-if="scope.row.type=='bool'"
            v-model="scope.row.default"
            active-text="True"
            inactive-text="False"
            active-color="#409EFF"
            inactive-color="#D8D8D8"
          />
          <el-date-picker
            v-if="scope.row.type=='time'"
            v-model="scope.row.default"
            type="datetime"
            placeholder="Please select default time"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
          <el-input-number
            v-if="['uint','uint8','uint16','uint32','uint64'].indexOf(scope.row.type) != -1"
            v-model="scope.row.default"
            label=""
            :min="0"
            :controls="false"
          />
          <el-input-number v-if="['int','int8','int16','int32','int64','float32','float64','byte','rune'].indexOf(scope.row.type) != -1" v-model="scope.row.default" label="" :controls="false" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Actions" align="center" width="160">
        <template slot-scope="scope">
          <el-button slot="reference" size="mini" type="primary">Copy</el-button>
          <el-button
            slot="reference"
            :disabled="listColumn.length <= 1"
            size="mini"
            type="danger"
            @click="removeTableRow(scope.$index)"
          >X</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div style="margin-left: 10px; margin-top: 20px">
      <el-button type="primary" @click="addTableRow()">Add Row</el-button>
      <el-button type="primary" @click="handleGenerateCode()">Generate Code (⌘+⏎)</el-button>
    </div>
    
    <!-- 方法配置区 -->
    <div class="label-section">Function Config</div>
    <el-table :data="listFunction" border fit highlight-current-row>
      <el-table-column align="center" label="Name" width="160">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" placeholder="Row name" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Comment">
        <template slot-scope="scope">
          <el-input v-model="scope.row.comment" placeholder="Row comment" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Method" width="100">
        <template slot-scope="scope">
          <!-- tyoe=0:增;1:删;2:改;3:查; -->
          <el-select v-model="scope.row.type">
            <el-option label="增" :value="0" />
            <el-option label="删" :value="1" />
            <el-option label="改" :value="2" />
            <el-option label="查" :value="3" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Multiple" width="160">
        <template slot-scope="scope">
          <!-- 删、改默认多条 -->
          <el-checkbox v-model="scope.row.multiple" :disabled="scope.row.type>=1 && scope.row.type<=2">multiple</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Custom Bean" width="160">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" round :disabled="scope.row.type != 3" @click="onEditCustomBean(scope.row, scope.$index)">{{ scope.row.isCustomBean ? 'Edit' : 'Set' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 自定义相应Bean -->
    <el-dialog title="Custom Bean" :visible.sync="dialogCustomBeanVisible">
      <!-- :model="jsonBeanForm" -->
      <el-form>
        <el-form-item label-width="120px" v-for="(item,index) in jsonBeanForm" :key="index" :label="item.key" >
          <div class="flex-row flex-align-center" style="display: flex; flex-direction: row; align-items: center;">
            <el-input v-model="item.json" autocomplete="off" style="width: 220px;"></el-input>
            <el-checkbox :value="item.json==='-'" style="margin-left: 20px;" @change="onVisibleBeanItem($event, index)">Visible</el-checkbox>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCustomBeanVisible = false">取 消</el-button>
        <el-button type="primary" @click="onEditCustomBeanDone()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="Generator Code" :visible.sync="dialogCodeVisible">
      <el-input
        type="textarea"
        :rows="20"
        v-model="codeString">
      </el-input>
      <!-- <div style="white-space: pre-wrap;">{{ codeString }}</div> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCodeVisible = false">Close</el-button>
        <el-button type="primary" @click="onCopyAndClose()">Copy And Close</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MySql from './common/mysql.js'
import { StringToBottomLine } from './common/string-fmt.js'
import { GenerateDataBase, GenerateBeanStruct, GenerateCreateMethod, GenerateDeleteMethod, GenerateUpdateMethod, GenerateFindMethod } from './common/code-generator.js'
export default {
  name: 'app',
	data: function() {
		return {
			// 自定义Bean弹窗
			dialogCustomBeanVisible: false,
			jsonBeanForm: [],
			jsonBeanFuncIndex: 0, // 当前正在编辑的函数
			// Other
			className: '',
			useGormModel: false,
			isGORMDebug: true,
			tableTypeList: [
				{ value: 'string', label: 'String' },
				{ value: 'bool', label: 'Bool' },
				{ value: 'time', label: 'Time' },
				{ value: 'int', label: 'Int' },
				{ value: 'int8', label: 'Int8' },
				{ value: 'int16', label: 'Int16' },
				{ value: 'int32', label: 'Int32' },
				{ value: 'int64', label: 'Int64' },
				{ value: 'byte', label: 'Byte' },
				{ value: 'uint', label: 'UInt' },
				{ value: 'uint8', label: 'UInt8' },
				{ value: 'uint16', label: 'UInt16' },
				{ value: 'uint32', label: 'UInt32' },
				{ value: 'uint64', label: 'UInt64' },
				{ value: 'float32', label: 'Float32' },
				{ value: 'float64', label: 'Float64' },
				{ value: 'rune', label: 'Rune' }
			],
			findTypeList: [
				{ value: 'list', label: 'List' },
				{ value: 'single', label: 'Single' }
			],
	
			listColumn: [], // 数据库表字段
			listFunction: [],
	
			dialogCodeVisible: false, // 显示生成后的代码
			codeString: `` // 生成后的代码
	
		}
	},
	created: function() {
		MySql.Execute(
					"106.12.128.72",
					"root", 
					"Cjm@12070817", 
					"uepush", 
					"show full columns from data_type_tests", 
					function (data) {
						if (data.Success) {
							console.log(data.Result)
						}
					}
		)
		this.addTableRow()
	},
	methods: {
	  onExample: function() {
	    this.className = 'UEAccount'
	    this.listColumn = [
	      { name: 'Name', table: StringToBottomLine('Name'), comment: '', type: 'string', isNotNull: true, dataLength: { isDefault: true, value: 0 }, primaryKey: true, autoIncrement: false, unsigned: false, unique: true, default: null },
	      { name: 'RegistTime', table: StringToBottomLine('RegistTime'), comment: '', type: 'time', isNotNull: false, dataLength: { isDefault: true, value: 0 }, primaryKey: false, autoIncrement: false, unsigned: false, unique: false, default: null },
	      { name: 'IsVIP', table: StringToBottomLine('IsVIP'), comment: '', type: 'bool', isNotNull: true, dataLength: { isDefault: false, value: 2 }, primaryKey: false, autoIncrement: false, unsigned: false, unique: false, default: false }
	    ]
	    this.setDefaultFunctionByColumns()
	    this.handleGenerateCode()
	  },
	  // 导入
	  onImportConfig: function() {
	    // 创建一个file input
	    let input = document.createElement('input')
	    input.type = 'file'
	
	    const self = this
	
	    // 绑定onchange事件
	    input.onchange = (event) => {
	      const files = event.target.files
	      if (!files || !files.length) {
	        input = null
	        throw new Error('No files')
	      }
	
	      // 当选择文件后，使用FileReader API读取文件，返回数据
	      const reader = new FileReader()
	      reader.onload = (event) => {
	        try {
	          const { ClassName, UseGormModel, IsGORMDebug, ListColumn, ListFunction } = JSON.parse(event.target.result)
	          self.className = ClassName
	          self.useGormModel = UseGormModel
	          self.isGORMDebug = IsGORMDebug
	          self.listColumn = ListColumn
	          self.listFunction = ListFunction
	        } catch (e) {
	          throw new Error(e)
	        }
	        input = null
	      }
	      reader.readAsText(files[0])
	    }
	
	    // 触发上传文件
	    input.click()
	  },
	  // 导出
	  onExportConfig: function() {
	    const fileJson = {}
	    fileJson.ClassName = this.className
	    fileJson.UseGormModel = this.useGormModel
	    fileJson.IsGORMDebug = this.isGORMDebug
	    fileJson.ListColumn = this.listColumn
	    fileJson.ListFunction = this.listFunction
	    const fileStr = JSON.stringify(fileJson)
	    const blob = new Blob([fileStr], { type: '' })
			var FileSaver = require('file-saver');
	    FileSaver.saveAs(blob, this.className + '.json')
	  },
	  addTableRow: function() {
	    this.listColumn.push({
	      name: '',
	      comment: '',
	      type: 'string',
	      isNotNull: false,
	      dataLength: {
	        isDefault: true,
	        value: 0
	      },
	      primaryKey: false,
	      autoIncrement: false,
	      unsigned: false,
	      unique: false,
	      default: null
	    })
	  },
	  // 根据字段设置默认方法
	  setDefaultFunctionByColumns: function() {
	    this.listFunction = []
	    // var colums = this.listColumn.map((item) => { return item.name })
	    // 增 tyoe=0:增;1:删;2:改;3:查;
	    this.listFunction.push({
	      type: 0,
	      name: 'Insert',
	      where: null,
	      multiple: false,
	      isCustomBean: false,
	      json: [],
	      isPaging: false,
	      comment: '添加单条数据'
	    })
	    this.listFunction.push({
	      type: 0,
	      name: 'InsertList',
	      where: null,
	      multiple: true,
	      isCustomBean: false,
	      json: [],
	      isPaging: false,
	      comment: '添加多条数据'
	    })
	    // 删
	    this.listFunction.push({
	      type: 1,
	      name: 'Delete',
	      where: [],
	      multiple: false,
	      isCustomBean: false,
	      json: [],
	      isPaging: false,
	      comment: '根据条件删除数据'
	    })
	    // 改
	    this.listFunction.push({
	      type: 2,
	      name: 'Save',
	      where: [],
	      multiple: true,
	      isCustomBean: false,
	      json: [],
	      isPaging: false,
	      comment: '根据条件修改数据'
	    })
	    // 查
	    this.listFunction.push({
	      type: 3,
	      name: 'GetDetail',
	      where: [],
	      multiple: false,
	      isCustomBean: false,
	      json: this.listColumn.map(function(item) {
	        return {
	          key: item.name,
	          json: StringToBottomLine(item.name),
	          type: (item.type === 'time' ? 'time.Time' : item.type)
	        }
	      }.bind(this)),
	      isPaging: false,
	      comment: '根据条件查找单条数据'
	    })
	    this.listFunction.push({
	      type: 3,
	      name: 'Find',
	      where: [],
	      multiple: true,
	      isCustomBean: false,
	      json: this.listColumn.map(function(item) {
	        return {
	          key: item.name,
	          json: StringToBottomLine(item.name),
	          type: (item.type === 'time' ? 'time.Time' : item.type)
	        }
	      }.bind(this)),
	      isPaging: false,
	      comment: '根据条件查找多条数据'
	    })
	  },
	  // 根据字段设置默认json和bean
	  setDefaultJsonBeanByColumns: function() {
	    // 生成数据库bean
	
	    // 根据方法列表生成bean
	  },
	  removeTableRow: function(index) {
	    this.listColumn.splice(index, 1)
	  },
	  onTableTypeChanged: function(index, row) {
	    const type = this.listColumn[index].type
	    if (type === 'string') {
	      this.listColumn[index].default = ''
	    } else if (type === 'time') {
	      this.listColumn[index].default = null
	    } else if (type === 'bool') {
	      this.listColumn[index].default = false
	    } else {
	      this.listColumn[index].default = 0
	    }
	  },
	  handleGenerateCode: function() {
	    this.codeString = ``
	    // 表结构
	    this.codeString += GenerateDataBase(this.className, true, this.listColumn) + `\n`
	    // 根据方法生成
	    for (const item of this.listFunction) {
	      if (item.type === 0) {
	        this.codeString += GenerateCreateMethod(item, this.className, this.isGORMDebug) + `\n`
	      }
	      if (item.type === 1) {
	        this.codeString += GenerateDeleteMethod(item, this.className, this.isGORMDebug) + `\n`
	      }
	      if (item.type === 2) {
	        this.codeString += GenerateUpdateMethod(item, this.className, this.isGORMDebug) + `\n`
	      }
	      if (item.type === 3) {
	        this.codeString += GenerateFindMethod(item, this.className, this.isGORMDebug) + `\n`
	      }
	    }
	    console.log(this.codeString)
	    this.dialogCodeVisible = true
	  },
	  // 复制并关闭生成后的代码
	  onCopyAndClose: function(e) {
	    this.dialogCodeVisible = false
	    this.$copyText(this.codeString).then(function(e) {
	      this.$message.success('Copied')
	    }.bind(this), function(e) {
	      this.$message.error('Can not copy: browser does not support')
	    }.bind(this))
	  },
	  onEditCustomBean: function(data, funcIndex) {
	    this.jsonBeanForm = data.json
	    this.jsonBeanFuncIndex = funcIndex
	    this.dialogCustomBeanVisible = true
	  },
	  onVisibleBeanItem: function(event, beanIndex) {
	    if (event) {
	      this.jsonBeanForm[beanIndex].json = '-'
	    } else {
	      this.jsonBeanForm[beanIndex].json = StringToBottomLine(this.jsonBeanForm[beanIndex].key)
	    }
	  },
	  onEditCustomBeanDone: function() {
	    this.dialogCustomBeanVisible = false
	    this.listFunction[this.jsonBeanFuncIndex].json = this.jsonBeanForm
	  },
	}
}
</script>

<style>
.wrap { }
.actions-box {
	margin: 10px 0;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.actions-box .label-title {
	margin: auto 20px;
}
.actions-box .input-name {
	width: 300px;
}
.actions-box .btn-action {
	margin: auto 20px;
}

.label-section {
	margin: 30px 20px 20px;
}
</style>
