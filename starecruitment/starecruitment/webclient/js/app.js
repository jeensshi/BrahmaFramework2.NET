$(function() {


  var init_tab = function() {
    $(".tab").each(function(index, item) {
      var oTab = $(item);
      var $tab_li = oTab.find('.tab_menu li');
      $tab_li.click(function() {
        $(this).addClass('sel').siblings().removeClass('sel');
        var index = $tab_li.index(this);
        oTab.find('.tab_box > .mod').eq(index).show().siblings().hide();
      });
    });
  }

  init_tab();

  $("#slider4").responsiveSlides({
    auto: true,
    pager: false,
    nav: true,
    speed: 500,
    namespace: "callbacks",
    before: function() {
      $('.events').append("<li>before event fired.</li>");
    },
    after: function() {
      $('.events').append("<li>after event fired.</li>");
    }
  });


  $(".scroll_box").children("ul").css("margin-left", "0px");
  li_num = $(".scroll_box").children("ul").children("li").size();
  ul_len = li_num * 374; //374 = li长度+li左右margin
  $(".scroll_box").children("ul").width(ul_len);
  var flag = true;
  $(".prev").click(function() {
    if (-parseInt($(".scroll_box").children("ul").css("margin-left")) > 0 && flag) {
      flag = false;
      $(".scroll_box").children("ul").animate({
        marginLeft: "+=" + 374 + "px"
      }, function() {
        flag = true;
      });
    }
  });

  $(".next").click(function() {
    if (-parseInt($(".scroll_box").children("ul").css("margin-left")) + 1124 < ul_len && flag) {
      flag = false;
      $(".scroll_box").children("ul").animate({
        marginLeft: "-=" + 374 + "px"
      }, function() {
        flag = true;
      });
    }
  });

});