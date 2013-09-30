# ExtremeAlpha
### _Image Alpha Quality Check Tool_


#### NOTE: Current status is BETA.

## Long term plans

Include: 

- Quality Check/Comparator Tool (proves the theory)
- Image Generator/Compressor Tool (can be ImageAlpha)
- Image List Generator Tool 
- Image List Generator WebSocket Server
- Image Alpha Blending Library: CreateJS, CSS

## TODO

- Add support for WebP in software mode
http://antimatter15.github.com/weppy/alpha/alpha.html
- Compare more WebP
/doc/cwebp.html
- Add Loading icon
- Convert to JSON format instead of plain JS.
- Create button

### Options
- CSS Render
- Canvas transparent render
- Refresh system
- Add color picker
- Design settings button
- Improve CSS for selects


## Other Tools 

### Generating step

- Grunt.js plugin extremealpha-generate-multiple-formats 
- Input: One big PNG 24 bits
- Output: 
	- Generate 10x PNG, 10x JPEG, 10x WEBP
	- 1or2 JSON
- GUI
- WRAP the plugin in a node-webkit app, containing a nodejs websocket server

### Checking step
- ExtremeAlpha (Image Alpha Quality Check Tool)

### Using step
- Library code for common libs.
- ImageAlphaLoader.js
- CreateJS
- CSS