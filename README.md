# jQuery Palette

Palette is a simple, clean, color picker plugin for [jQuery][jQuery] v1.7+.


## Getting Started

First, make sure the required JavaScript files are included in the `<head>` tag.

~~~ { html }
<script src="js/parse-color.min.js" type="text/javascript"></script>
<script src="js/jquery.min.js" type="text/javascript"></script>
<script src="js/jquery.palette.min.js" type="text/javascript"></script>
~~~

Next, include Palette's stylesheet _(you may need to update the image paths depending on how your site is structured)_.

~~~ { html }
<link rel="stylesheet" href="css/palette.css" type="text/css">
~~~

Lastly, attach Palette to which ever element(s) you want.

~~~ { javascript }
$('#palette').palette({'color': 'CC4747'});
~~~


## Settings

<table>
    <thead>
        <tr>
            <th>Property</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    
    <tbody>
        <tr>
            <td><code>color</code></td>
            <td><em>string|object</em></td>
            <td><em>'000000'</em></td>
            <td>
                <p>The default color of the picker.</p>
                <p><em>Note, can be in any format <a href="https://github.com/uhnomoli/parse-color.js">parse-color.js</a> recognizes.</em></p>
            </td>
        </tr>
        
        <tr>
            <td><code>onChange</code></td>
            <td><em>function</em></td>
            <td>&mdash;</td>
            <td>
                <p>A callback function that's fired when the color of the picker changes.</p>
                
                <p><em>Note, this callback is <strong>not</strong> fired for live changes (e.g. while <strong>dragging</strong> the selector cursor as well as the hue and field sliders). For that use <code>onLive</code>.</em></p>
            </td>
        </tr>
        
        <tr>
            <td><code>onHide</code></td>
            <td><em>function</em></td>
            <td>&mdash;</td>
            <td>A callback function that's fired when the picker is hidden.</td>
        </tr>
        
        <tr>
            <td><code>onLive</code></td>
            <td><em>function</em></td>
            <td>&mdash;</td>
            <td>
                <p>A callback function that's fired <strong>immediately</strong> when the color of the picker changes.</p>
                
                <p><em>Note, this callback is <strong>only</strong> fired for live changes (e.g. while <strong>dragging</strong> the selector cursor as well as the hue and field sliders). <code>onChange</code> will fire on the following <code>mouseup</code> after dragging.</em></p>
            </td>
        </tr>
        
        <tr>
            <td><code>onShow</code></td>
            <td><em>function</em></td>
            <td>&mdash;</td>
            <td>A callback function that's fired when the picker is shown.</td>
        </tr>
        
        <tr>
            <td><code>onSubmit</code></td>
            <td><em>function</em></td>
            <td>&mdash;</td>
            <td>A callback function that's fired when the <strong>current</strong> color of the picker is changed <em>(e.g. when the submit button is clicked)</em>.</td>
        </tr>
    </tbody>
</table>


## Methods

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    
    <tbody>
        <tr>
            <td><code>$.palette.color($palette, color, 'from')</code></td>
            <td>
                <p>Gets or sets the color of the supplied picker.</p>
                
                <p><code>color</code> can be in any format <a href="https://github.com/uhnomoli/parse-color.js">parse-color.js</a> recognizes. If it isn't supplied, the color of the supplied picker is returned.</p>
                
                <p><code>from</code> is a string telling Palette where the color of the picker is being changed from and can be anything. For the most part, it is used internally to tell Palette not to overwrite the field the color is being changed from. If it isn't supplied, all fields are updated.</p>
            </td>
        </tr>
        
        <tr>
            <td><code>$.palette.hide()</code></td>
            <td>Hides the picker(s).</td>
        </tr>
        
        <tr>
            <td><code>$.palette.show($palette)</code></td>
            <td>Shows the supplied picker.</td>
        </tr>
    </tbody>
</table>


## Data

~~~ { javascript }
$('#palette').palette();
~~~

Given the above usage of Palette, the following [data][jQuery-data] is available.

### Parent

~~~ { javascript }
var parent_data = $('#palette').data('palette');
~~~

<table>
    <thead>
        <tr>
            <th>Property</th>
            <th>Description</th>
        </tr>
    </thead>
    
    <tbody>
        <tr>
            <td><code>palette</code></td>
            <td>The jQuery object of the picker.</td>
        </tr>
    </tbody>
</table>

### Picker

~~~ { javascript }
var
    $palette = parent_data.palette,
    
    picker_data = $palette.data('palette');
~~~

<table>
    <thead>
        <tr>
            <th>Property</th>
            <th>Description</th>
        </tr>
    </thead>
    
    <tbody>
        <tr>
            <td><code>color</code></td>
            <td>
                <p>The <a href="https://github.com/uhnomoli/parse-color.js">parse-color.js</a> object of the color of the picker.</p>
                
                <p><em>Note, this can differ from <code>current</code>.</em></p>
            </td>
        </tr>
        
        <tr>
            <td><code>current</code></td>
            <td>The <a href="https://github.com/uhnomoli/parse-color.js">parse-color.js</a> object of the <strong>current</strong> color of the picker.</td>
        </tr>
        
        <tr>
            <td><code>parent</code></td>
            <td>The jQuery object of the element the picker is attached to.</td>
        </tr>
    </tbody>
</table>

_Also note, all of the picker's options are available via it's data._


## Dependencies

+ [jQuery v1.7+][jQuery]
+ [parse-color.js][parse-color.js]


[jQuery]: http://jquery.com/
[jQuery-data]: http://api.jquery.com/data/
[parse-color.js]: https://github.com/uhnomoli/parse-color.js

