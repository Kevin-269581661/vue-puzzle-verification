<script>
import moment from "dayjs";
// 自定义组件
import CustomInputSelect from '@/components/common/components/customInputSelect.vue'

export default {
  name: "searchItems",
  functional: true,
  props: {
    // 表单配置
    fileds: {
      type: Object,
      default() {
        return {}
      }
    },
    // v-model 绑定的对象
    value: {
      type: Object,
      require: true
    },
    // label 宽度，不传默认自动适应
    labelWidth: {
      type: Number,
    },
    // 组件大小： medium / small / mini
    size: {
      type: String,
      default: 'small'
    },
  },
  // model: {
  //   prop: 'value',
  //   event: 'update:value'
  // },
  render(h, context) {
    const { data, props, listeners } = context
    const typeMap = {
      input: inputRender,
      select: selectRender,
      "date-picker": datePickerRender,
      "date-picker-two": datePickerTwoRender,
      "input-two": inputTwoRender,
      // 带自定义输入的选择器组件
      "input-select": inputSelectRender,
    };
    // label 宽度
    const labelWidth = labelWidth || getLabelWidth()

    /**
     * 渲染 搜索组件
     */
    function itemsRender() {
      const { fileds, children } = context.props
      const res = Object.keys(fileds).map(key => {
        return h("el-col",
          {
            class: 'gutter_row',
            props: {
              key,
              xs: 24,
              md: 12,
              lg: 8,
              xl: 6
            },
          }, [
            h("div", {
              class: "search_item",
            }, componentUse(fileds[key], key))
          ]
        )
      })
      res.push(controlRender())
      // if (children) res.push(h("div", children));
      return res;
    }
    /**
     * 让搜索按钮获得焦点
     */
    function focusElement(isShow = false, focusName = "searchBtn") {
      const searchBtnEl = document.getElementById(focusName)
      if (!isShow && searchBtnEl) searchBtnEl.focus();
    }
    /**
     * 判断 使用什么组件
     */
    function componentUse(attrs = {}, i) {
      if (attrs.slot) {
        return [context.slots()[attrs.slot]]
      }
      const res = [titleRender(attrs, i)]
      let component = null;
      if (attrs.slotContent) {
        component = h("div", {
          class: "search_item_slot",
        }, [ context.slots()[attrs.slotContent] ])
      } else {
        component = typeMap[attrs.type || "input"](attrs, i);
      }
      if (component) res.push(component)
      return res;
    }
    /**
     * 表单标题 的渲染
     */
    function titleRender(attrs, i) {
      return h("div", {
        class: "search_item_title",
        style: {
          width: labelWidth
        },
        domProps: { innerHTML: attrs.title },
      });
    }
    /**
     * el-input 组件的渲染方法
     */
    function inputRender(attrs, i) {
      return h("el-input", {
        ...elModel(i, attrs, "input"),
      });
    }
    /**
     * el-input区间
     */
    function inputTwoRender(attrs, i) {
      const attrsMin = getInputTwoProps(attrs, "min");
      const attrsMax = getInputTwoProps(attrs, "max");
      return h(
        "div",
        {
          class: "item-two",
        },
        [inputRender(attrsMin, `${i}Min`), inputRender(attrsMax, `${i}Max`)]
      );
    }
    /**
     * el-select 组件的渲染方法
     */
    function selectRender(attrs, i) {
      const options = computedOptions(attrs, i);
      return h(
        "el-select",
        {
          ...elModel(i, attrs, "change"),
        },
        options.map(optionRender)
      );
    }
    /**
     * 带自定义输入的选择器组件
     */
    function inputSelectRender(attrs, i) {
      return h(
        CustomInputSelect,
        {
          ...elModel(i, attrs, "change"),
        }
      )
    }
    /**
     * el-option 组件的渲染方法
     */
    function optionRender({ label, value, disabled = false, render }) {
      return h(
        "el-option",
        {
          props: {
            label,
            value,
            disabled,
          },
        },
        render ? render(h) : []
      );
    }
    /**
     * el-date-picker 组件的渲染方法
     */
    function datePickerRender(attrs, i) {
      return h("el-date-picker", {
        ...elModel(i, attrs, "input"),
      });
    }
    /**
     * el-date-picker区间 组件的渲染方法
     */
    function datePickerTwoRender(attrs, i) {
      const attrsStart = getDatePickerTwoProps(attrs, "start");
      const attrsEnd = getDatePickerTwoProps(attrs, "end");
      return h(
        "div",
        {
          class: "item-two",
        },
        [
          datePickerRender(attrsStart, `${i}Start`),
          datePickerRender(attrsEnd, `${i}End`),
        ]
      );
    }
    /**
     * 获取计算后的options
     */
    function computedOptions({ options, optionKey = {} }, key) {
      const { value = "value", label = "label" } = optionKey;
      if (!Array.isArray(options)) {
        return console.error(`searchFileds 配置的 ${key} 字段配置 中，缺少 options 数组参数`);
      }
      return options.map((item) => {
        return {
          ...item,
          value: item[value],
          label: item[label],
        };
      });
    }
    /**
     * 搜索、重置控制按钮的渲染
     */
    function controlRender() {
      const els = [
        h('el-button-group', {
          style: {
            marginRight: '8px',
          }
        },
        [
          h('el-button', {
            props: {
              type: "plain",
              size: props.size,
            },
            on: {
              click: () => {
                context.listeners.reset()
              }
            }
          }, '重置'),
          h('el-button', {
            attrs: {
              id: "searchBtn",
            },
            props: {
              type: "primary",
              size: props.size,
            },
            on: {
              click: () => {
                context.listeners.search()
              }
            }
          }, '搜索'),
        ])
      ]
      if (context.slots().action) els.push(context.slots().action)
      if (context.slots().fold) els.push(context.slots().fold)
      return h("div", { class: "control_btns" }, els);
    }
    /**
     * element 组件的双向绑定
     */
    function elModel(key, attrs = {}, type = "input") {
      // 处理自定义指令
      const directives = [];
      if (attrs.directives) {
        for (const key in attrs.directives) {
          directives.push({
            name: key,
            value: attrs.directives[key],
          });
        }
      }
      const onFun = {}; // 组件事件
      const nativeOnFun = {}; // 原生事件
      switch (attrs.type) {
        case "input":
          // 输入组件相关监听
          nativeOnFun.keyup = function (event) {
            // 回车时触发
            if (event.keyCode === 13) context.listeners.search();
          };
          break;
        case "select":
          // 选择组件相关监听
          onFun["visible-change"] = function (event) {
            // 下拉框出现/隐藏时触发
            focusElement(event);
            findEventAndInvoke(attrs, "visible-change");
          };
          onFun["remove-tag"] = function () {
            // 多选模式下移除tag时触发
            focusElement(false);
          };
          onFun.clear = function () {
            // 清空按钮时触发
            focusElement(false);
          };
          break;
        case "date-picker":
          // 日期组件
          onFun.change = function () {
            // 选择时触发
            focusElement(false);
          };
          break;
        case "date-picker-two":
          // 日期组件
          onFun.change = function () {
            // 选择时触发
            focusElement(false);
          };
          break;
      }
      return {
        style: {
          flex: 1
        },
        ...attrs,
        attrs: {
          ...attrs.props,
          ...attrs.attrs,
        },
        props: {
          clearable: true,
          size: props.size,
          ...attrs.props,
          value: context.props.value[key],
        },
        // el-selct 触发原生的change事件
        // el-date-picker 触发原生的input事件
        on: {
          ...attrs.on,
          ...onFun,
          [type](e) {
            // console.log('组件事件 e === ', e)
            if (attrs.type === "date-picker") {
              // 日期组件的特殊处理
              // let dateType = "yyyy-MM-DD";
              // if (
              //   attrs.props &&
              //   attrs.props.valueFormat === "yyyy-MM-dd HH:mm:ss"
              // )
              //   dateType = "yyyy-MM-DD HH:mm:ss";
              // if (moment(e).format(dateType) === e) {
              //   context.props.value[key] = e;
              // }
              context.props.value[key] = e;
            } else {
              context.props.value[key] = e;
            }
            context.listeners.change && context.listeners.change(key, e);
            findEventAndInvoke(attrs, type);
          },
          click() {
            if (context.listeners.click) context.listeners.click(key);
            findEventAndInvoke(attrs, "click");
          },
        },
        // el-input 触发组件的input事件
        nativeOn: {
          ...attrs.nativeOn,
          ...nativeOnFun,
          [type](e) {
            // console.log('组件原生事件 e === ', e)
            if (attrs.type === "date-picker") {
              // 日期组件的特殊处理
              if (e === null) {
                // 用于清空
                context.props.value[key] = null;
                return;
              }
              let dateType = "yyyy-MM-DD";
              if (
                attrs.props &&
                attrs.props.valueFormat === "yyyy-MM-dd HH:mm:ss"
              )
                dateType = "yyyy-MM-DD HH:mm:ss";
              if (moment(e.target.value).format(dateType) === e.target.value)
              context.props.value[key] = e.target.value;
            } else {
              context.props.value[key] = e.target.value
            }
            // context.listeners.change && context.listeners.change(key, e);
            // findEventAndInvoke(attrs, type);
          },
          click() {
            if (context.listeners.click) context.listeners.click(key);
            findEventAndInvoke(attrs, "click");
          },
        },
        directives: directives,
      };
    }
    /**
     * 处理日期区间的相关参数
     */
    function getDatePickerTwoProps(attrs, type) {
      let defaultTime = type === "start" ? "00:00:00" : "23:59:59";
      let placeholder =
        type === "start" ? `${attrs.title}开始` : `${attrs.title}结束`;
      let pickerOptions = {};
      if (attrs.props) {
        if (attrs.props.placeholder)
          placeholder = attrs.props.placeholder + placeholder;
        if (attrs.props.pickerOptionsStart && type === "start") {
          // 开始日期限制选择
          pickerOptions = attrs.props.pickerOptionsStart;
        }
        if (attrs.props.pickerOptionsStart && type === "end") {
          // 结束日期限制选择
          pickerOptions = attrs.props.pickerOptionsEnd;
        }
        // defaultTime
        if (attrs.props.defaultTimeStart && type === "start")
          defaultTime = attrs.props.defaultTimeStart;
        if (attrs.props.defaultTimeEnd && type === "end")
          defaultTime = attrs.props.defaultTimeEnd;
      }
      const data = {
        label: attrs.title,
        title: attrs.title,
        props: {
          ...attrs.props,
          defaultTime,
          placeholder,
          pickerOptions,
        },
        directives: attrs.directives,
        type: "date-picker",
      };
      return data;
    }
    /**
     * 处理输入区间的相关参数
     */
    function getInputTwoProps(attrs, type) {
      let placeholder =
        type === "min" ? `${attrs.title}最小值` : `${attrs.title}最大值`;
      if (attrs.props && attrs.props.placeholder)
        placeholder = attrs.props.placeholder + placeholder;
      const data = {
        label: attrs.title,
        title: attrs.title,
        props: {
          ...attrs.props,
          placeholder,
        },
        directives: attrs.directives,
        type: "el-input",
      };
      return data;
    }
    /**
     * 组件宽度计算方法
     */
    function getInputWidth(str = "标题") {
      const len = str.length + 3; // 加上请输入三个字的长度
      return `${len * 18 + 60}px`;
    }
    /**
     * label宽度计算
     */
    function getLabelWidth() {
      // 找到最长的文字
      const { fileds } = context.props
      const maxWidth = Math.max(
        ...Object.keys(fileds).map(filed => fileds[filed].title ? fileds[filed].title.length : 0)
      );
      return `${ maxWidth * 14 }px`
    }
    /**
     * 处理配置项的事件
     */
    function findEventAndInvoke(attrs, eventKey, params) {
      if (!attrs || !attrs.on || typeof attrs.on !== 'object') return
      Object.keys(attrs.on).forEach((key) => {
        if (key === eventKey) {
          attrs.on[key](params);
        }
      });
    }
    /**
     * Render 页面生成
     */
    const items = itemsRender();
    return h( "div",
      {
        class: "table_search_header",
        style: data.staticStyle,
        ref: data.ref,
        props,
      }, [
        h("el-row", {
          style: {
            width: '100%',
            flexWrap: 'wrap',
          },
          props: {
            gutter: 16,
            align: "middle"
          }
        }, items)
      ]
    );
  },
};
</script>

<style scoped>
.table_search_header {
  box-sizing: border-box;
}

.search_item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.search_item_title {
  font-size: 14px;
  color: #000;
  margin-right: 14px;
  text-align: right;
}

.control_btns {
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  align-items: center;
}

.search_item_slot {
  flex: 1;
}
</style>
