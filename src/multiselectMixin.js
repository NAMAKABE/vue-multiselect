// Copied from Vuex’s util.js
function deepClone(obj) {
    if (Array.isArray(obj)) {
        return obj.map(deepClone)
    } else if (obj && typeof obj === 'object') {
        var cloned = {}
        var keys   = Object.keys(obj)
        for (var i = 0, l = keys.length; i < l; i++) {
            var key     = keys[i]
            cloned[key] = deepClone(obj[key])
        }
        return cloned
    } else {
        return obj
    }
}

module.exports = {
    data () {
        return {
            search: '',
            isOpen: false,
            value: [],
            loading: false,
            cacheData: {
                default: false,
                query: {}
            },
            inputButton: false,
            selectdWatcherCount: 0,
            debugMark: ''
        }
    },
    props: {

        cache: {
            type: Boolean,
            default: false
        },



        validator: {
            default: false
        },
        deep: {
            type: Boolean,
            default: false
        },


        class: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            default: ''
        },
        /**
         * 下拉列表
         * Array of available options: Objects, Strings or Integers.
         * If array of objects, visible label will default to option.label.
         * If `labal` prop is passed, label will equal option['label']
         * @type {Array}
         */
        options: {
            // type: [Array, Object, String],
            // 允许任意值，将在创建实例时转换成Array
            default: function () {
                return [];
            }
            // required: true
        },
        /**
         * 是否多选
         * Equivalent to the `multiple` attribute on a `<select>` input.
         * @default false
         * @type {Boolean}
         */
        multiple: {
            type: Boolean,
            default: false
        },
        /**
         * 已选中的字段
         * Required. Presets the selected options. Add `.sync` to
         * update parent value. If this.onChange callback is present,
         * this will not update. In that case, the parent is responsible
         * for updating this value.
         * @type {Object||Array||String||Integer}
         */
        selected: {
            default: function () {
                return [];
            }
        },
        /**
         * 唯一键值
         * Key to compare objects
         * @default 'id'
         * @type {String}
         */
        key: {
            type: String,
            default: false
        },

        /**
         * 显示标签
         * Label to look for in option Object
         * @default 'label'
         * @type {String}
         */
        label: {
            type: String,
            default: false
        },


        /**
         * 远程URL地址
         * 这里
         */
        remote: {
            type: String,
            default: false
        },
        dataKey: {
            type: String,
            default: false
        },
        queryKey: {
            type: String,
            default: 'q'
        },
        /**
         * Enable/disable search in options
         * @default true
         * @type {Boolean}
         */
        searchable: {
            type: Boolean,
            default: true
        },
        /**
         * Clear the search input after select()
         * @default true
         * @type {Boolean}
         */
        clearOnSelect: {
            type: Boolean,
            default: true
        },
        /**
         * Hide already selected options
         * @default false
         * @type {Boolean}
         */
        hideSelected: {
            type: Boolean,
            default: false
        },



        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * Equivalent to the `placeholder` attribute on a `<select>` input.
         * @default 'Select option'
         * @type {String}
         */
        placeholder: {
            type: String,
            default: '请选择'
        },
        /**
         * Sets maxHeight style value of the dropdown
         * @default 300
         * @type {Integer}
         */
        maxHeight: {
            type: Number,
            default: 300
        },
        /**
         * Allow to remove all selected values
         * @default true
         * @type {Boolean}
         */
        allowEmpty: {
            type: Boolean,
            default: true
        },
        /**
         * Callback function to call after this.value changes
         * @callback onChange
         * @default false
         * @param {Array||Object||String||Integer} Current this.value
         * @param {Integer} $index of current selection
         * @type {Function}
         */
        onChange: {
            type: Function,
            default: false
        },
        /**
         * Callback function to call after this.search changes
         * @callback onSearchChange
         * @default false
         * @param {String} Pass current search String
         * @type {Function}
         */
        onSearchChange: {
            type: Function,
            default: false
        },
        /**
         * Value that indicates if the dropdown has been used.
         * Useful for validation.
         * @default false
         * @type {Boolean}
         */
        touched: {
            type: Boolean,
            default: false
        },
        /**
         * Reset this.value, this.search, this.selected after this.value changes.
         * Useful if want to create a stateless dropdown, that fires the this.onChange
         * callback function with different params.
         * @default false
         * @type {Boolean}
         */
        resetAfter: {
            type: Boolean,
            default: false
        },
        /**
         * Enable/disable closing after selecting an option
         * @default true
         * @type {Boolean}
         */
        closeOnSelect: {
            type: Boolean,
            default: true
        },
        /**
         * Function to interpolate the custom label
         * @default false
         * @type {Function}
         */
        customLabel: {
            type: Function,
            default: false
        },
        /**
         * 自定义标签
         * @default false
         * @type {Function}
         */
        customTag: {
            type: Function,
            default: false
        },
        /**
         * 唯一键值
         * 当且仅当option为一个对象时有效
         * 用于追踪选中状态
         * @default false
         * @type {Function}
         */
        // unique: {
        //     type: String,
        //     default: false
        // },
        /**
         * Disable / Enable tagging
         * @default false
         * @type {Boolean}
         */
        taggable: {
            type: Boolean,
            default: false
        },
        /**
         * Callback function to run when attemting to add a tag
         * @default suitable for primitive values
         * @param {String} Tag string to build a tag
         * @type {Function}
         */
        onTag: {
            type: Function,
            default: function (tag) {

                if (this.onTagPush) {
                    this.options.push(tag)
                }


                if (this.isStringArray) {
                    this.value instanceof Array ? this.value.push(tag[this.label]) : this.value = tag[this.label];
                    this.options.unshift(this.value);
                } else {
                    this.value instanceof Array ? this.value.push(tag) : this.value = deepClone(tag);
                }


            }
        },
        /**
         * 是否在自定义标签后追加到现有列表中
         */
        onTagPush: {
            type: Boolean,
            default: false
        },

        /**
         * 新建标签的KEY
         */

        onTagKey: {
            type: Function,
            default: function () {
                return '';
            }
        },
        /**
         * String to show when highlighting a potential tag
         * @default 'Press enter to create a tag'
         * @type {String}
         */
        tagPlaceholder: {
            type: String,
            default: '按回车新建'
        },
        /**
         * Number of allowed selected options. No limit if false.
         * @default False
         * @type {Number}
         */
        max: {
            type: Number,
            default: false
        },

        /**
         * 在更新selected值得时触发的callback
         */
        onUpdate: {
            type: [Function, Boolean],
            default: false
        }
    },
    created () {
        // debugger;



        // console.log(this.options)
        // console.log(!this.options instanceof Array)
        if (!(this.options instanceof Array)) {


            this.options = [this.options];
        }
        if (!this.selected) {
            this.$set('value', this.multiple ? [] : null)
        } else {

            var p      = this.multiple ? (this.selected instanceof Array ? this.selected : [this.selected]) : (this.selected instanceof Array ? this.selected[0] : this.selected);
            this.value = deepClone(p)

        }
        // if (this.searchable && !this.multiple) {



        if (this.remote) {
            this.loading = true;
            var self     = this;

            if (!this.multiple) {
                // debugger;
                // 注意，这边如果是单选，关闭下拉时，搜索框中应取得自定义Tag的返回值
                // console.log(this.value, '---------')



                // 单选
                var searchTextWhenCreated = this.getOptionLabel(this.value, true);
                searchTextWhenCreated !== '' ? this.search = searchTextWhenCreated : this.generateDropdownContent();
            } else {
                // 多选



                this.generateDropdownContent()

            }

            // $.when(S.get(this.remote)).then(function (data) {
            //     // alert(1)
            //     // console.log(self)
            //     // TODO 这边默认是认为初始化时的值就是默认值，也就是search为空
            //     self.options           = self.dataKey ? data[self.dataKey] : data;
            //     self.cacheData.default = deepClone(self.options);
            //     self.loading           = false;
            // }).fail(function () {
            //     // alert(2)
            //     self.options = [];
            //     self.loading = false;
            // })
        }



    },
    ready(){
        if (this.$el.children[0].tagName !== 'INPUT') {

        } else {
            this.inputButton = this.$el.children[0];
        }



        if (Vue.config.debug) {
            let f             = Math.ceil(Math.random() * 10000000000);
            window['$mu' + f] = this;
            this.debugMark    = '$mu' + f;
            console.log('<multiselect> ready. $mu' + f, window['$mu' + f].$el);
        }

        // console.log('ms ready, this.validator:', this.validator);
        if (this.validator) {
            if (

                !this.selected
                ||
                (this.key ? this.isNull(this.selected[this.key]) : false  )

            ) {
                this.validator.valid   = false;
                this.validator.invalid = true;
            } else {
                this.validator.valid   = true;
                this.validator.invalid = false;
            }

        }

    },
    computed: {

        isStringArray(){
            return this.options.length > 0 && Object.prototype.toString.call(this.options[0]) === '[object String]';
        },
        filteredOptions () {
            let label   = this.label;
            let key     = this.key;
            let search  = this.search || ''
            let options = this.hideSelected
                ? this.options.filter(this.isNotSelected)
                : this.options
            options     = this.$options.filters.filterBy(options, this.search)



            // debugger;
            // 如果可以新增，未达到最大长度，并且这个选项不存在，则执行新增操作
            if (this.taggable && search.length && !this.isExistingOption(search)) {



                let o    = {isTag: true}
                o[label] = search;
                key && (o[key] = this.onTagKey());

                // if (this.isStringArray) {
                //
                //
                // } else {
                //     let o = search;
                // }

                options.unshift(o)
            }


            return options

        },
        valueKeys () {
            if (this.key) {
                return this.multiple
                    ? this.value.map(element => element[this.key])
                    : this.value[this.key]
            } else {
                return this.value
            }
        },
        optionKeys () {
            return this.label
                ? this.options.map(element => element[this.label])
                : this.options
        }
    },
    watch: {
        'value' () {
            if (this.onChange && JSON.stringify(this.value) !== JSON.stringify(this.selected)) {
                this.onChange(deepClone(this.value))
            } else {
                this.$set('selected', deepClone(this.value))
            }
            if (this.resetAfter) {
                if (this.value) this.$set('value', null)
                if (this.search) this.$set('search', null)
                if (this.selected) this.$set('selected', null)
            }
            if (!this.multiple && this.searchable && this.clearOnSelect) {
                this.search = this.getOptionLabel(this.value, true)
            }
        },



        /**
         * 下拉项的Watcher
         * 当onSearchChange激活并且搜索时
         * 开始loading
         */

        'search' () {
            if (this.onSearchChange) {
                this.onSearchChange(this.search);
                this.loading = true
            } else if (this.remote) {



                // console.log('Search Changedccscscscsc');
                //
                // console.log(this.search)

                this.generateDropdownContent();


            }
        },
        /**
         * 下拉项的Watcher
         * 当下拉项发生变化时结束loading
         */
        'options' () {
            this.onSearchChange && (this.loading = false)
        },
        'selected' (newVal, oldVal) {


            // if (Vue.config.debug) {
            //     console.log('<selected> changed detected. old value is ' + oldVal + ', new value is ' + newVal);
            // }
            if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                this.value = deepClone(this.selected)
            }


            if (this.onUpdate) {
                this.onUpdate();
            }


            this.selectdWatcherCount++;



            if (this.validator) {
                if (

                    !this.selected
                    ||
                    (this.key ? this.isNull(this.selected[this.key]) : false  )

                ) {
                    // if (Vue.config.debug) {
                    //     console.log('<selected> changed detected. valid is FALSE');
                    // }
                    this.validator.valid   = false;
                    this.validator.invalid = true;
                } else {
                    this.validator.valid   = true;
                    this.validator.invalid = false;
                }

            }
            if (this.selectdWatcherCount > 1) {
                if (this.validator) {
                    this.validator.dirty = true;
                }
            }


            // if(!!this.selected){
            //     if (this.validator) {
            //         this.validator.dirty = true;
            //
            //
            //         if (!this.selected) {
            //             this.validator.valid   = true;
            //             this.validator.invalid = false;
            //         } else {
            //             this.validator.valid   = false;
            //             this.validator.invalid = true;
            //         }
            //
            //     }
            // }



            // console.log(this.validator.valid)
        },
        'isOpen'(){
            // debugger;

        },
        'validator'(){
            if (this.validator) {
                if (

                    !this.selected
                    ||
                    (this.key ? this.isNull(this.selected[this.key]) : false  )

                ) {
                    // if (Vue.config.debug) {
                    //     console.log('<selected> validator detected. valid is FALSE');
                    // }
                    this.validator.valid   = false;
                    this.validator.invalid = true;
                } else {
                    this.validator.valid   = true;
                    this.validator.invalid = false;
                }
            }
        }
    },
    methods: {

        check: function () {

        },

        isNull(value){
            return value === '-1' || value === '';
        },
        generateDropdownContent(){


            let searchValue = this.trim(this.search);



            if (this.deep && this.cacheData.default) {

                this.options = this.cacheData.default;

                this.loading = false;
            } else if (this.cache && (searchValue === '' ? this.cacheData.default : this.cacheData.query.hasOwnProperty(searchValue))) {
                this.options = searchValue === '' ? this.cacheData.default : this.cacheData.query[searchValue];
                this.loading = false;
            } else {
                this.xhrSearch(searchValue);



                this.loading = true
            }
        },
        xhrSearch(value){
            // this.loading = true;
            let self        = this;
            let searchValue = '';
            let values      = typeof (value) === 'undefined' ? '' : this.trim(value);
            // 判定是否含有querystring


            if (this.remote.indexOf('?') > -1) {
                searchValue = this.remote + '&' + this.queryKey + '=' + values;
            } else {
                searchValue = this.remote + '?' + this.queryKey + '=' + values;
            }



            $.when(S.get(searchValue)).then(function (data) {
                // alert(1)
                // console.log(self)



                self.options = window.S ? window.S.getObject(data, self.dataKey) : data[self.dataKey];
                if (self.cache) {
                    if (self.search === '') {
                        self.cacheData.default = deepClone(self.options);
                    } else {
                        self.cacheData.query[value] = deepClone(self.options);
                    }
                    // self.cacheData[self.search === '' ?'default':'query'] = self.search === '' ? self.cacheData.default : self.cacheData.query[this.search];
                }
                self.loading = false;
            }).fail(function () {
                // alert(2)
            })
        },
        /**
         * Finds out if the given query is already present
         * in the available options
         * @param  {String}
         * @returns {Boolean} returns true if element is available
         */
        isExistingOption (query) {
            return !this.options
                ? false
                : this.optionKeys.indexOf(query) > -1
        },
        /**
         * Finds out if the given element is already present
         * in the result value
         * @param  {Object||String||Integer} option passed element to check
         * @returns {Boolean} returns true if element is selected
         */
        isSelected (option) {
            /* istanbul ignore else */
            // console.log(this.key);
            if (!this.value) return false;
            const opt = this.key
                ? option[this.key]
                : option;



            if (this.multiple) {
                return this.valueKeys.indexOf(opt) > -1
            } else {


                if (option.isTag) {
                    return false;


                }
                return this.valueKeys === opt
            }
        },
        /**
         * Finds out if the given element is NOT already present
         * in the result value. Negated isSelected method.
         * @param  {Object||String||Integer} option passed element to check
         * @returns {Boolean} returns true if element is not selected
         */
        isNotSelected (option) {
            return !this.isSelected(option)
        },
        /**
         * Returns the option[this.label]
         * if option is Object. Otherwise check for option.label.
         * If non is found, return entrie option.
         *
         * @param  {Object||String||Integer} Passed option
         * @returns {Object||String}
         */
        getOptionLabel (option, isTag) {





            // debugger;
            // isTag = 1;
            // 如果是对象数组
            if (typeof option === 'object' && option !== null) {
                // console.log(this.customLabel)
                // 设定了自定义标签
                if (this.customLabel) {
                    // return this.customLabel(option);
                    return isTag ? (this.customTag ? this.customTag(option) : this.customLabel(option)) : this.customLabel(option);
                } else {
                    if (this.label && option[this.label]) {
                        return option[this.label]
                    } else if (option.label) {
                        return option.label
                    }
                }
                // 直接输出Array中的元素（String）
            } else {
                return option
            }
        },



        trim(value){
            if (!value) return '';
            return value.replace(/(^\s*)|(\s*$)/g, "");
        },
        /**
         * Add the given option to the list of selected options
         * or sets the option as the selected option.
         * If option is already selected -> remove it from the results.
         *
         * @param  {Object||String||Integer} option to select/deselect
         */
        select (option) {
            if (this.max && this.multiple && this.value.length === this.max) return


            // 如果是自定义的标签

            // csc



            // debugger;
            if (option.isTag) {
                this.onTag(option)


                this.search = ''

                if (this.closeOnSelect) {
                    this.searchable
                        ? this.$els.search.blur()
                        : this.$el.blur()
                }

            } else {
                if (this.multiple) {
                    if (!this.isNotSelected(option)) {
                        this.removeElement(option)
                    } else {
                        this.value.push(option)
                        if (this.clearOnSelect) {
                            this.search = ''
                        }
                    }
                } else {
                    this.$set('value',
                        !this.isNotSelected(option) && this.allowEmpty
                            ? null
                            : option
                    )
                    if (this.closeOnSelect) {
                        this.searchable
                            ? this.$els.search.blur()
                            : this.$el.blur()
                    }
                }
            }
        },



        /**
         * Removes the given option from the selected options.
         * Additionally checks this.allowEmpty prop if option can be removed when
         * it is the last selected option.
         *
         * @param  {type} option description
         * @returns {type}        description
         */
        removeElement (option) {
            /* istanbul ignore else */
            if (this.allowEmpty || this.value.length > 1) {
                if (this.multiple && typeof option === 'object') {
                    const index = this.valueKeys.indexOf(option[this.key])
                    this.value.splice(index, 1)
                } else {
                    this.value.$remove(option)
                }
            }
        },
        /**
         * Calls this.removeElement() with the last element
         * from this.value (selected element Array)
         *
         * @fires this#removeElement
         */
        removeLastElement () {
            /* istanbul ignore else */
            if (this.search.length === 0 && Array.isArray(this.value)) {
                this.removeElement(this.value[this.value.length - 1])
            }
        },
        /**
         * Opens the multiselect’s dropdown.
         * Sets this.isOpen to TRUE
         */
        activate () {
            /* istanbul ignore else */
            // console.log(!this.isOpen)
            if (!this.isOpen) {
                this.isOpen = true
                /* istanbul ignore else  */
                if (this.searchable) {
                    this.search = ''
                    this.$els.search.focus()
                } else {
                    this.$el.focus()
                }

                // TODO 古怪的地方
                // var self = this;
                // setTimeout(function () {
                //     self.$els.list.style.overflow = 'auto';
                // }, 300)
            } else {



            }
        },


        /**
         * 在滚动条上产生的点击事件
         * @param $event
         */


        onKeypressUl(ev){
            // console.log($event)
            if (ev.target.localName === 'ul') {
                // console.log('UL')
                this.isOpen = true;
            }
        },

        /**
         * Closes the multiselect’s dropdown.
         * Sets this.isOpen to FALSE
         */





        deactivate (execByElement) {
            /* istanbul ignore else */
            // debugger;



            if (this.validator) {

                this.validator.touched   = true;
                this.validator.untouched = !this.validator.touched;
            }

            if (this.isOpen) {
                this.isOpen  = false
                this.touched = true
                // console.log(this.isOpen)
                // debugger;
                /* istanbul ignore else  */



                // return;
                if (this.isOpen == false) {

                    if (this.searchable) {

                        this.$els.search.blur()
                        // debugger;

                        // BUGFIX 修复在下拉但并未blur时，this.serch的值在''和undefined之间交替引发一系列渲染问题
                        // 注意，这边如果是单选，关闭下拉时，搜索框中应取得自定义Tag的返回值
                        this.search = this.multiple
                            ? ''
                            : this.getOptionLabel(this.value) ? this.getOptionLabel(this.value, true) : ''
                        // console.log(this.getOptionLabel(this.value))
                    } else {
                        this.$el.blur()
                    }
                }
                // this.isOpen  = false
                // this.touched = true


                // TODO 古怪的地方
                // var self = this;
                // setTimeout(function () {
                //     self.$els.list.style.overflow = 'hidden';
                // }, 300)
            }
        },
        /**
         * Call this.activate() or this.deactivate()
         * depending on this.isOpen value.
         *
         * @fires this#activate || this#deactivate
         * @property {Boolean} isOpen indicates if dropdown is open
         */
        toggle () {
            this.isOpen
                ? this.deactivate()
                : this.activate()
        }
    }
};


