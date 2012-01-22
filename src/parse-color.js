function parse_color(color) {
    var
        hex = '000000',
        hsl = {'h': 0, 's': 0, 'l': 0},
        hsv = {'h': 0, 's': 0, 'v': 0},
        luma = 0,
        rgb = {'r': 0, 'g': 0, 'b': 0},
        
        definitions = [
            {
                're': /^([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})$/,
                'process': function(bits) {
                    return {
                        'r': parseInt(bits[1] + bits[1], 16),
                        'g': parseInt(bits[2] + bits[2], 16),
                        'b': parseInt(bits[3] + bits[3], 16)
                    };
                }
            },
            {
                're': /^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/,
                'process': function(bits) {
                    return {
                        'r': parseInt(bits[1], 16),
                        'g': parseInt(bits[2], 16),
                        'b': parseInt(bits[3], 16)
                    };
                }
            },
            {
                're': /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
                'process': function(bits) {
                    return {
                        'r': parseInt(bits[1], 10),
                        'g': parseInt(bits[2], 10),
                        'b': parseInt(bits[3], 10)
                    };
                }
            },
            {
                're': /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)\)$/,
                'process': function(bits) {
                    return {
                        'r': parseInt(bits[1], 10),
                        'g': parseInt(bits[2], 10),
                        'b': parseInt(bits[3], 10)
                    };
                }
            }
        ],
        field_max = {
            'h': 360,
            's': 100,
            'l': 100,
            'v': 100,
            'r': 255,
            'g': 255,
            'b': 255
        };
    
    var check_model = function() {
        for (field in color) {
            color[field] = (color[field] < 0 || isNaN(color[field])) ? 0 : ((color[field] > field_max[field]) ? field_max[field] : color[field]);
        }
        
        return color;
    };
    
    var get_luma = function() {
        luma = (rgb.r * 0.21 + rgb.g * 0.72 + rgb.b * 0.07) / 255;
    };
    
    var hsl_to_hsv = function() {
        var
            s = hsl.s / 100,
            l = hsl.l / 100,
            
            c = s * (1 - Math.abs(2 * l - 1));
        
        hsv.h = hsl.h;
        hsv.s = 0;
        hsv.v = (2 * l + c) / 2;
        
        if (c != 0) {
            hsv.s = c / hsv.v;
        }
        
        hsv.s *= 100;
        hsv.v *= 100;
    };
    
    var hsv_to_hsl = function() {
        var
            s = hsv.s / 100,
            v = hsv.v / 100,
            
            max = v,
            min = v * (-s + 1),
            
            c = max - min;
        
        hsl.h = hsv.h;
        hsl.s = 0;
        hsl.l = (max + min) / 2;
        
        if (c != 0) {
            hsl.s = c / (1 - Math.abs(2 * hsl.l - 1));
        }
        
        hsl.s *= 100;
        hsl.l *= 100;
    };
    
    var hsv_to_rgb = function() {
        var
            h = hsv.h,
            s = hsv.s / 100,
            v = hsv.v / 100;
        
        rgb.b = rgb.g = rgb.r = v;
        
        if (s != 0) {
            var
                sector_pos = h / 60,
                
                sector_num = Math.floor(sector_pos),
                
                sector_frac = sector_pos - sector_num,
                
                p = v * (1 - s),
                q = v * (1 - (s * sector_frac)),
                t = v * (1 - (s * (1 - sector_frac)));
            
            switch (sector_num) {
                case 0:
                case 6:
                    rgb.g = t;
                    rgb.b = p;
                    
                    break;
                case 1:
                    rgb.r = q;
                    rgb.b = p;
                    
                    break;
                case 2:
                    rgb.r = p;
                    rgb.b = t;
                    
                    break;
                case 3:
                    rgb.r = p;
                    rgb.g = q;
                    
                    break;
                case 4:
                    rgb.r = t;
                    rgb.g = p;
                    
                    break;
                case 5:
                    rgb.g = p;
                    rgb.b = q;
                    
                    break;
            }
        }
        
        rgb.r = Math.round(rgb.r * 255);
        rgb.g = Math.round(rgb.g * 255);
        rgb.b = Math.round(rgb.b * 255);
    };
    
    var rgb_to_hex = function() {
        var
            r = rgb.r.toString(16),
            g = rgb.g.toString(16),
            b = rgb.b.toString(16);
        
        r = (r.length == 1) ? '0' + r : r;
        g = (g.length == 1) ? '0' + g : g;
        b = (b.length == 1) ? '0' + b : b;
        
        hex = (r + g + b).toUpperCase();
    };
    
    var rgb_to_hslv = function() {
        var
            r = rgb.r / 255,
            g = rgb.g / 255,
            b = rgb.b / 255,
            
            max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            
            c = max - min;
        
        hsl.s = hsl.h = max;
        hsl.l = (max + min) / 2;
        
        hsv.v = hsv.s = hsv.h = max;
        
        switch (max) {
            case r:
                if (g >= b) {
                    if (c == 0) {
                        hsl.h = 0;
                    } else {
                        hsl.h = 60 * (g - b) / c;
                    }
                } else if (g < b) {
                    hsl.h = 60 * (g - b) / c + 360;
                }
                
                break;
            case g:
                hsl.h = 60 * (b - r) / c + 120;
                
                break;
            case b:
                hsl.h = 60 * (r - g) / c + 240;
                
                break;
        }
        
        hsv.h = hsl.h;
        
        if (c == 0) {
            hsv.s = hsl.s = 0;
        } else {
            hsl.s = c / (1 - Math.abs(2 * hsl.l - 1));
            hsv.s = c / hsv.v;
        }
        
        hsl.s *= 100;
        hsl.l *= 100;
        hsv.s *= 100;
        hsv.v *= 100;
    };
    
    var str_to_rgb = function() {
        color = color.toLowerCase().replace(/[\s#]/g, '');
        
        for (var i = 0; i < definitions.length; i++) {
            var
                processor = definitions[i].process,
                re = definitions[i].re,
                
                bits = re.exec(color);
            
            if (bits) {
                color = processor(bits);
                
                break;
            }
        }
        
        if (typeof color == 'object') {
            rgb = check_model();
        }
    };
    
    switch (typeof color) {
        case 'number':
            var h = parseInt(color, 10);
            
            hsv.h = (isNaN(h)) ? 0 : Math.max(Math.min(h, 360), 0);
            hsv.s = Math.round(Math.random() * 100);
            hsv.v = Math.round(Math.random() * 100);
            
            hsv_to_hsl();
            hsv_to_rgb();
            rgb_to_hex();
            get_luma();
            
            break;
        case 'object':
            if ('r' in color && 'g' in color && 'b' in color) {
                rgb = check_model();
                
                rgb_to_hslv();
            } else if ('h' in color && 's' in color) {
                if ('l' in color) {
                    hsl = check_model();
                    
                    hsl_to_hsv();
                } else {
                    hsv = check_model();
                    
                    hsv_to_hsl();
                }
                
                hsv_to_rgb();
            } else {
                break;
            }
            
            rgb_to_hex();
            get_luma();
            
            break;
        case 'string':
            str_to_rgb();
            rgb_to_hslv();
            rgb_to_hex();
            get_luma();
            
            break;
        default:
            rgb.r = Math.round(Math.random() * 255);
            rgb.g = Math.round(Math.random() * 255);
            rgb.b = Math.round(Math.random() * 255);
            
            rgb_to_hex();
            rgb_to_hslv();
            get_luma();
            
            break;
    }
    
    return {
        'hex': hex,
        'hsl': hsl,
        'hsv': hsv,
        'luma': luma,
        'rgb': rgb
    };
}
