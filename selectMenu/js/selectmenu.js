;
(function ($) {
  // 记录当前focus的输入框
  var currentInput = null

  // 保存配置项
  var selectDomArray = {}

  // 创建选择菜单
  function createSelectMenu() {
    var $template = $(`
    <div class="query-form-child clearfix">
      <div class="query-form-child-item" id="tempChild">
        <div class="con select-input-cnt">
          <input style="color:#9C9A9C; width:300px;" class="input-name keyword-input" placeholder="请输入查询关键词" type="text" />
        </div>
        <div class="select-body-cnt">
  
        </div>
        <div class="select-action-cnt clearfix">
          <div class="select-action-left">
            <button type="button" class="btn btn-danger" id="clear_">清空</button>
            <button type="button" class="btn btn-primary" id="selectAll_">全选</button>
          </div>
          <div class="select-action-right">
            <button type="button" class="btn btn-success confirm-button" parentid="true">确定</button>
            <button type="button" class="btn btn-success close-win">取消</button>
          </div>
        </div>
      </div>
    </div>`)
    $('body').prepend($template)
  }
  //弹出下拉菜单显示位置
  function showPopDiv(ele) {
    //如果弹出层超过浏览器宽度,设置弹出层由选择框右下向左弹出.
    if (($(ele).offset().left + 535) > $(window).width())
      $(".query-form-child").css("left", $(ele).offset().left - 388);
    else
      $(".query-form-child").css("left", $(ele).offset().left);
    $(".query-form-child").css("top", $(ele).offset().top + 40);

    $(".query-form-child").show(); //show child frame}
  }

  // 搜索功能
  function searchByKey(keyword) {
    var checkItems = $('#tempChild > .select-body-cnt > ul > label > li')
    var index = 0
    for (index = 0; index < checkItems.length; index++) {
      if (checkItems[index].firstElementChild.name.indexOf(keyword) >= 0) {
        checkItems[index].style.display = 'block'
      } else {
        checkItems[index].style.display = 'none'
      }
    }
  }

  function displayAllItem() {
    var checkItems = $('#tempChild > .select-body-cnt > ul > label > li')
    var index = 0
    for (index = 0; index < checkItems.length; index++) {
      checkItems[index].style.display = 'block'
    }
  }
  // 创建多选框
  function createSelectDOM(labels) {
    var $container = $(`<ul class="check-box select-checkbox-list clearfix"></ul>`)
    var content = labels.map((label) => {
      return (
        `<label>
      <li class="check-item" title="${label.title}">
        <input class="check-box-dept1" type="checkbox" value="${label.id}" name="${label.title}">${label.title}
      </li>
     </label>
    `)
    })
    $container.html(content.join(''))
    return $container
  }

  // 比较结果框与选择项
  function compareValueSelect(selectDOM, selectValue) {
    var $inputArray = selectDOM.find('input.check-box-dept1')
    for (let i = 0; i < $inputArray.length; i++) {
      let temp = $inputArray[i].name
      if (selectValue.indexOf(temp) >= 0) {
        $inputArray[i].checked = true
      } else {
        $inputArray[i].checked = false
      }
    }
  }

  function bindEventListener() {

    // 关闭子菜单
    $(".close-win").click(function () {
      $(".query-form-child").hide(700);
    });
    $('html').on('click', function () {
      $(".query-form-child").hide(700);
    })
    $('.query-form-child').on('click', function (event) {
      event.stopPropagation()
    })

    // 清空选择项
    $("#clear_").click(function () {
      $('.input-name.keyword-input')[0].value = ''
      $(this).parent().parent().prev().children().find("li")
        .css("display", "block");
      if ($(this).attr("checked") == "checked") {} else {
        $(this).parent().parent().prev().children().find(
          "li input[type='checkbox']").attr(
          "checked", false);
      }
    });

    // 选择项全选
    $("#selectAll_").click(function () {
      var $checkItems = $('.check-box-dept1')
      for (let i = 0; i < $checkItems.length; i++) {
        $checkItems[i].checked = true
      }
    });

    // 确定选择项
    $(".confirm-button").bind("click", function (event) {
      var selectEle = $('.check-box-dept1:checked')
      var selectName = []
      var selectValue = []
      for (let i = 0; i < selectEle.length; i++) {
        selectName[i] = selectEle[i].name
        selectValue[i] = selectEle[i].value
      }
      currentHidden.value = selectValue.join(',')
      currentInput.value = selectName.join(',')
      $(".query-form-child").hide(700);
    });

    // 搜索框输入，查找处理
    $('.input-name.keyword-input').on('input', function (event) {
      var keyword = event.target.value
      searchByKey(keyword)
    })

    // 点击输入框，弹出多选框
    $(".show-child").on('click', function (event) {
      if (selectDomArray[event.target.id].children().length === 0) return
      displayAllItem()
      // 记录当前输入框
      currentInput = event.target
      currentHidden = currentInput.nextElementSibling

      $("#filter-con").show();
      $("#filter-chart").hide();
      $(".slide-btn").show();

      // 获取选项
      $('#tempChild .select-body-cnt').empty();
      var inputID = event.target.id
      var currentValue = currentInput.value.split(',')
      compareValueSelect(selectDomArray[inputID], currentValue)
      $('#tempChild .select-body-cnt').append(selectDomArray[inputID])

      // 显示所有选项，搜索框置为空
      var checkItems = $('.select-body-cnt > li')
      for (let index = 0; index < checkItems.length; index++) {
        checkItems[index].style.display = 'block'
      }
      $('.input-name.keyword-input')[0].value = ''

      showPopDiv(this);
      $(".query-form-child").show();
      // 防止事件的继续传播
      return false;
    })
  }

  function selectAllByID(id) {
    var value = []
    var hiddenValue = []
    selectDomArray[id].find('.check-box-dept1').each(function () {
      this.checked = true
      value.push(this.name)
      hiddenValue.push(this.value)
    })
    $('#' + id).val(value.join(','))
    $('#hidden' + id).val(hiddenValue.join(','))
  }

  function cancleAllByID(id) {
    selectDomArray[id].find('.check-box-dept1').each(function () {
      this.checked = false
    })
    $('#' + id).val('')
    $('#hidden' + id).val('')
  }

  function selectItemInit(id, array) {
    // 修改原有的input按钮 
    // <input type="text" readonly="true" placeholder="可多选" class="rp-select-input show-child form-control" id="component">
    // <input type="hidden" id="hidden-component">
    var $ipt = $('#' + id)
    $ipt.addClass('show-child')
    $ipt.attr('readonly', 'true')
    var $hideIpt = $(`<input type="hidden" id="hidden-${id}">`)
    $ipt.after($hideIpt)

    // 创建每项对应的DOM结构
    selectDomArray[id] = createSelectDOM(array)
  }

  function changeOption(id, result) {
    // 修改对应的DOM内容
    selectDomArray[id] = createSelectDOM(result)
  }

  function getSelectValue(id) {
    return $('#hidden-' + id).val()
  }
  $.fn.selectMenu = function (options) { // options是一个对象，每个属性对应一个数组
    createSelectMenu()
    for (var i in options) {
      selectItemInit(i, options[i])
    }
    bindEventListener()
  }
  $.fn.selectMenu.changeOption = changeOption;
  $.fn.selectMenu.getSelectValue = getSelectValue;
})(window.jQuery)