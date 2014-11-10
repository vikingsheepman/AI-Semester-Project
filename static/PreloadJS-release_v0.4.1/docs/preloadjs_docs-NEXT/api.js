YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "AbstractLoader",
        "Event",
        "EventDispatcher",
        "LoadQueue",
        "PreloadJS",
        "SamplePlugin",
        "TagLoader",
        "Utility Methods",
        "XHRLoader"
    ],
    "modules": [
        "CreateJS",
        "PreloadJS"
    ],
    "allModules": [
        {
            "displayName": "CreateJS",
            "name": "CreateJS",
            "description": "A collection of Classes that are shared across all the CreateJS libraries.  The classes are included in the minified\nfiles of each library and are available on the createsjs namespace directly.\n\n<h4>Example</h4>\n     myObject.addEventListener(\"change\", createjs.proxy(myMethod, scope));"
        },
        {
            "displayName": "PreloadJS",
            "name": "PreloadJS",
            "description": "PreloadJS provides a consistent way to preload content for use in HTML applications. Preloading can be done using\nHTML tags, as well as XHR.\n\nBy default, PreloadJS will try and load content using XHR, since it provides better support for progress and\ncompletion events, <b>however due to cross-domain issues, it may still be preferable to use tag-based loading\ninstead</b>. Note that some content requires XHR to work (plain text, web audio), and some requires tags (HTML audio).\nNote this is handled automatically where possible.\n\nPreloadJS currently supports all modern browsers, and we have done our best to include support for most older\nbrowsers. If you find an issue with any specific OS/browser combination, please visit http://community.createjs.com/\nand report it.\n\n<h4>Getting Started</h4>\nTo get started, check out the {{#crossLink \"LoadQueue\"}}{{/crossLink}} class, which includes a quick overview of how\nto load files and process results.\n\n<h4>Example</h4>\n\n     var queue = new createjs.LoadQueue();\n     queue.installPlugin(createjs.Sound);\n     queue.on(\"complete\", handleComplete, this);\n     queue.loadFile({id:\"sound\", src:\"http://path/to/sound.mp3\"});\n     queue.loadManifest([\n         {id: \"myImage\", src:\"path/to/myImage.jpg\"}\n     ]);\n     function handleComplete() {\n         createjs.Sound.play(\"sound\");\n         var image = queue.getResult(\"myImage\");\n         document.body.appendChild(image);\n     }\n\n<b>Important note on plugins:</b> Plugins must be installed <i>before</i> items are added to the queue, otherwise\nthey will not be processed, even if the load has not actually kicked off yet. Plugin functionality is handled when\nthe items are added to the LoadQueue.\n\n<h4>Browser Support</h4>\nPreloadJS is partially supported in all browsers, and fully supported in all modern browsers. Known exceptions:\n<ul><li>XHR loading of any content will not work in many older browsers (See a matrix here: <a href=\"http://caniuse.com/xhr2\" target=\"_blank\">http://caniuse.com/xhr2</a>).\n     In many cases, you can fall back on tag loading (images, audio, CSS, scripts, SVG, and JSONP). Text and\n     WebAudio will only work with XHR.</li>\n     <li>Some formats have poor support for complete events in IE 6, 7, and 8 (SVG, tag loading of scripts, XML/JSON)</li>\n     <li>Opera has poor support for SVG loading with XHR</li>\n     <li>CSS loading in Android and Safari will not work with tags (currently, a workaround is in progress)</li>\n     <li>Local loading is not permitted with XHR, which is required by some file formats. When testing local content\n     use either a local server, or enable tag loading, which is supported for most formats. See {{#crossLink \"LoadQueue/setUseXHR\"}}{{/crossLink}}\n     for more information.</li>\n</ul>\n\n<h4>Cross-domain Loading</h4>\nMost content types can be loaded cross-domain, as long as the server supports CORS. PreloadJS also has internal\nsupport for images served from a CORS-enabled server, via the `crossOrigin` argument on the {{#crossLink \"LoadQueue\"}}{{/crossLink}}\nconstructor. If set to a string value (such as \"Anonymous\"), the \"crossOrigin\" property of images generated by\nPreloadJS is set to that value. Please note that setting a `crossOrigin` value on an image that is served from a\nserver without CORS will cause other errors. For more info on CORS, visit https://en.wikipedia.org/wiki/Cross-origin_resource_sharing."
        }
    ]
} };
});