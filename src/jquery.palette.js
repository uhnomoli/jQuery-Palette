(function($, window, document) {
    var
        $document = $(document),
        $window = $(window),
        
        defaults = {
            'color': '000000',
            'onChange': function() {},
            'onHide': function() {},
            'onLive': function() {},
            'onShow': function() {},
            'onSubmit': function() {}
        },
        fields = {
            4: {
                'field': 'r',
                'max': 255,
                'model': 'rgb'
            },
            5: {
                'field': 'g',
                'max': 255,
                'model': 'rgb'
            },
            6: {
                'field': 'b',
                'max': 255,
                'model': 'rgb'
            },
            7: {
                'field': 'h',
                'max': 360,
                'model': 'hsv'
            },
            8: {
                'field': 's',
                'max': 100,
                'model': 'hsv'
            },
            9: {
                'field': 'v',
                'max': 100,
                'model': 'hsv'
            }
        },
        html = '<div class="palette"><div class="palette_selector"><div><div>&nbsp;</div></div></div><div class="palette_hue"><div class="palette_hue_slider">&nbsp;</div><div>&nbsp;</div></div><div class="palette_new_color"><div>&nbsp;</div></div><div class="palette_current_color"><div>&nbsp;</div></div><div class="palette_field palette_r"><input type="text" maxlength="3"><span>&nbsp;</span></div><div class="palette_field palette_g"><input type="text" maxlength="3"><span>&nbsp;</span></div><div class="palette_field palette_b"><input type="text" maxlength="3"><span>&nbsp;</span></div><div class="palette_field palette_h"><input type="text" maxlength="3"><span>&nbsp;</span></div><div class="palette_field palette_s"><input type="text" maxlength="3"><span>&nbsp;</span></div><div class="palette_field palette_v"><input type="text" maxlength="3"><span>&nbsp;</span></div><div class="palette_hex"><input type="text" maxlength="6"></div><div class="palette_submit">&nbsp;</div></div>';
    
    var add_bindings = function($palette) {
        var data = $palette.data('palette');
        
        // selector
        $palette.find('.palette_selector > div').mousedown(function(e) {
            if (!(e.which > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)) {
                e.preventDefault();
                
                var $selector = $(this);
                
                change_selector($selector, e.pageX, e.pageY);
                
                $document.on('mousemove.palette', function(e) {
                    change_selector($selector, e.pageX, e.pageY);
                }).one('mouseup.palette', function() {
                    $document.off('mousemove.palette');
                    
                    data.onChange($palette);
                });
            }
        });
        
        // hue
        $palette.children('.palette_hue').mousedown(function(e) {
            if (!(e.which > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)) {
                e.preventDefault();
                
                var $hue = $(this);
                
                change_hue($hue, e.pageY);
                
                $document.on('mousemove.palette', function(e) {
                    change_hue($hue, e.pageY);
                }).one('mouseup.palette', function() {
                    $document.off('mousemove.palette');
                    
                    data.onChange($palette);
                });
            }
        });
        
        // current color
        $palette.children('.palette_current_color').click(function(e) {
            if (!(e.which > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)) {
                $.palette.color($palette, data.current.hsv, 'current');
            }
        });
        
        // fields
        $palette.find('.palette_field input').keyup(function(e) {
            var
                $input = $(this),
                
                val = parseInt($input.val(), 10);
            
            if (e.which == 13 || e.which == 27) {
                $input.blur();
            } else {
                var 
                    info = fields[$input.parent().index()],
                    
                    color = $.extend({}, data.color[info.model]);
                
                if (isNaN(val)) {
                    val = 0;
                } else if (val > info.max) {
                    $input.val(info.max.toString());
                    val = info.max;
                }
                
                color[info.field] = val;
                
                $.palette.color($palette, color, info.field);
            }
        }).keydown(function(e) {
            if (e.which == 38 || e.which == 40) {
                var
                    $input = $(this),
                    
                    info = fields[$input.parent().index()],
                    old = val = parseInt($input.val(), 10),
                    
                    color = $.extend({}, data.color[info.model]);
                
                if (isNaN(val)) {
                    old = val = 0;
                }
                
                if (e.which == 40 && val > 0) {
                    val--;
                    $input.val(val.toString());
                } else if (e.which == 38 && val < info.max) {
                    val++;
                    $input.val(val.toString());
                }
                
                if (val != old) {
                    color[info.field] = val;
                
                    $.palette.color($palette, color, info.field);
                }
            }
        }).blur(function() {
            var
                $input = $(this),
                
                val = parseInt($input.val(), 10);
            
            if (isNaN(val)) {
                $input.val('0');
            } else if (val.toString() != $input.val()) {
                $input.val(val.toString());
            }
        });
        
        // field sliders
        $palette.find('.palette_field span').mousedown(function(e) {
            if (!(e.which > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)) {
                e.preventDefault();
                
                var
                    $slider = $(this),
                    
                    $field = $slider.parent(),
                    
                    $input = $field.children('input'),
                    
                    info = fields[$field.index()],
                    old = parseInt($input.val(), 10),
                    y = e.pageY;
                
                $document.on('mousemove.palette', function(e) {
                    var
                        color = $.extend({}, data.color[info.model]),
                        val = Math.min(Math.max(old + y - e.pageY, 0), info.max);
                    
                    $input.val(val);
                    
                    color[info.field] = val;
                    
                    $.palette.color($palette, color, 'slider');
                }).one('mouseup.palette', function() {
                    $document.off('mousemove.palette');
                    
                    data.onChange($palette);
                });
            }
        });
        
        // hex
        $palette.find('.palette_hex input').keyup(function(e) {
            var $input = $(this);
            
            if (e.which == 13 || e.which == 27) {
                $input.blur();
            } else if ($input.val().length == 3 || $input.val().length == 6) {
                $.palette.color($palette, $input.val(), 'hex');
            }
        }).blur(function() {
            $.palette.color($palette, data.color.hsv, 'blur');
        });
        
        // submit
        $palette.children('.palette_submit').click(function(e) {
            if (!(e.which > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)) {
                $palette.find('.palette_current_color div').css('background-color', '#' + $.palette.color($palette));
                
                data.current = $.extend({}, data.color);
                
                data.onSubmit($palette);
            }
        });
    };
    
    var change_hue = function($hue, y) {
        var
            $palette = $hue.closest('.palette'),
            $hue = $hue.children('div:last'),
            
            offset = $hue.offset(),
            
            top = (y < offset.top) ? 0 : (y > (offset.top + 150)) ? 150 : y - offset.top;
        
        $hue.prev().css('top', top.toString() + 'px');
        
        $.palette.color($palette, $.extend({}, $palette.data('palette').color.hsv, {
            'h': 360 * (150 - Math.max(0, Math.min(150, top))) / 150
        }), 'hue');
    };
    
    var change_selector = function($selector, x, y) {
        var
            $palette = $selector.closest('.palette'),
            
            offset = $selector.offset(),
            
            top = (y < offset.top) ? 0 : (y > (offset.top + 150)) ? 150 : y - offset.top,
            left = (x < offset.left) ? 0 : (x > (offset.left + 150)) ? 150 : x - offset.left;
        
        $selector.children('div').css({
            'top': top.toString() + 'px',
            'left': left.toString() + 'px'
        });
        
        $.palette.color($palette, $.extend({}, $palette.data('palette').color.hsv, {
            's': 100 * (Math.max(0, Math.min(150, left))) / 150,
            'v': 100 * (150 - Math.max(0, Math.min(150, top))) / 150
        }), 'selector');
    };
    
    var compare_hsv = function(one, two) {
        for (field in one) {
            if (one[field] != two[field]) {
                return false;
            }
        }
        
        return true;
    };
    
    var position = function($palette) {
        var
            $parent = $palette.data('palette').parent,
            
            height = $parent.outerHeight(),
            offset = $parent.offset(),
            width = $parent.outerWidth();
        
        if (($window.height() - (offset.top - $window.scrollTop() + height)) > 182) {
            $palette.css('top', (offset.top + height).toString() + 'px');
        } else {
            $palette.css('top', (offset.top - 182).toString() + 'px');
        }
        
        if (($window.width() - offset.left - $window.scrollLeft()) > 367) {
            $palette.css('left', (offset.left).toString() + 'px');
        } else {
            $palette.css('left', (offset.left - width - 367).toString() + 'px');
        }
    };
    
    $.palette = {
        'color': function($palette, color, from) {
            if (typeof color == 'undefined') {
                return $palette.find('.palette_hex input').val();
            }
            
            var
                color = parse_color(color),
                data = $palette.data('palette'),
                
                old = $.extend({}, data.color),
                
                hex = color.hex,
                hsv = color.hsv,
                rgb = color.rgb,
                
                hue = parse_color({
                    'h': hsv.h,
                    's': 100,
                    'v': 100
                });
            
            data.color = color;
            
            if (from != 'selector') {
                $palette.find('.palette_selector > div').css('background-color', '#' + hue.hex);
                $palette.find('.palette_selector div div').css({
                    'top': (150 * (100 - hsv.v) / 100).toString() + 'px',
                    'left': (150 * hsv.s / 100).toString() + 'px'
                });
            }
            
            if (from != 'hue') {
                $palette.find('.palette_hue_slider').css('top', (150 - 150 * hsv.h / 360).toString() + 'px')
            }
            
            $palette.find('.palette_new_color div').css('background-color', '#' + hex);
            
            if (typeof from == 'undefined') {
                $palette.find('.palette_current_color div').css('background-color', '#' + hex);
                
                data.current = color;
                
                data.onSubmit($palette);
            }
            
            for (field in rgb) {
                if (from != field) {
                    $palette.find('.palette_' + field + ' input').val(rgb[field]);
                }
            }
            
            for (field in hsv) {
                if (from != field) {
                    $palette.find('.palette_' + field + ' input').val(Math.round(hsv[field]));
                }
            }
            
            if (from != 'hex') {
                $palette.find('.palette_hex input').val(hex);
            }
            
            if (!old.hsv || !compare_hsv(hsv, old.hsv)) {
                if (from == 'selector' || from == 'hue' || from == 'slider') {
                    data.onLive($palette);
                } else {
                    data.onChange($palette);
                }
            }
        },
        'hide': function() {
            $('.palette:visible').each(function() {
                var $palette = $(this);
                
                $palette.find('input:focus').blur();
                $palette.fadeOut(500, function() {
                    $palette.data('palette').onHide($palette);
                });
            });
        },
        'show': function($palette) {
            position($palette, $palette.data('palette').parent);
            
            $palette.fadeIn(500, function() {
                $palette.data('palette').onShow($palette);
            });
        }
    };
    
    $document.on('keyup.palette', function(e) {
        if (e.which == 27) {
            $.palette.hide();
        }
    });
    
    $.fn.palette = function(options) {
        options = $.extend({}, defaults, options || {});
        
        var
            $this = this,
            $body = $(document.body);
        
        return $this.each(function() {
            var $parent = $(this);
            
            if (!$parent.data('palette')) {
                var $palette = $(html);
                
                $body.append($palette);
                
                $palette.data('palette', $.extend({}, options, {'parent': $parent}));
                $parent.data('palette', {'palette': $palette});
                
                add_bindings($palette);
                
                $.palette.color($palette, options.color);
                
                position($palette);
                
                $parent.on('click.palette', function(e) {
                    if (!(e.which > 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) && e.target == this) {
                        $.palette.hide()
                        
                        if (!$palette.is(':visible')) {
                            $.palette.show($palette);
                        }
                    }
                });
            }
        });
    };
})(jQuery, window, document);
