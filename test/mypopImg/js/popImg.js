layui.define('jquery', function(exports) {

    var $ = layui.jquery;

    var $layer = $('<div/>').css({
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
        zIndex: 999999,
        background: '#000',
        opacity: '0.6',
        display: 'none'
    }).attr('data-id', 'b_layer');

    var cloneImg = function($node) {
        var left = $node.offset().left,
            top = $node.offset().top,
            nodeW = $node.width(),
            nodeH = $node.height();

        return $node.clone().css({
            position: 'fixed',
            width: nodeW,
            height: nodeH,
            left: left,
            top: top,
            zIndex: 1000000
        });
    }

    var justifyImg = function($c) {
        var dW = $(window).width(),
            dH = $(window).height();
        $c.css('cursor', 'zoom-out').attr('data-b-img', 1);
        var img = new Image();
        img.onload = function() {
            $c.stop().animate({
                    width: this.width,
                    height: this.height,
                    left: (dW - this.width) / 2,
                    top: (dH - this.height) / 2
                },
                300);
        };
        img.src = $c.attr('src');
    }

    var popImg = function($img) {
        $img.css('cursor', 'zoom-in').on('click', function(event) {
            var $b = $('body');
            $layer.appendTo($b);
            $layer.fadeIn(300);
            var $c = cloneImg($(this));
            $c.appendTo($b);
            justifyImg($c);
        });
    }

    var timer = null;
    $(window).on('resize', function() {
        $("img[data-b-img]").each(function() {
            var $this = $(this);
            timer && clearTimeout(timer);
            timer = setTimeout(function() {
                justifyImg($this);
            }, 10);
        });
    });

    $(document).on('click keydown', function(event) {
        if (event.type === 'keydown' && event.keyCode === 27) {
            $layer.fadeOut(300);
            $('img[data-b-img]').remove();
        }
        var $this = $(event.target);
        if ($this.attr('data-id') === 'b_layer' || $this.attr('data-b-img') == 1) {
            $layer.fadeOut(300);
            $('img[data-b-img]').remove();
        }
    });

    exports('popImg', popImg);

});
