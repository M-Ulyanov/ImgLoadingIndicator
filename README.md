# ImgLoadingIndicator
Loading indicator for large images based on XMLHttpRequest

##Getting started
1. Add to your project plugin - `npm install img-loading-indicator`
2. Include ImgLoadingIndicator.js and ImgLoadingIndicator.less
3. Create img tag with the attribute data-image-loading-url
```html
<img class="js-gallery-item" src="" data-image-loading-url="https://placekitten.com/g/2000/2000" alt="">
```
4. Create instance ImgLoadingIndicator with your options
```html
<script>
new ImgLoadingIndicator({
  image: image,
  showLoadPercent: true,
  callbacks: {
   complete: function(event) {
      console.log(event);
   },
   progress: function(event) {
      console.info(event)
   },
   error: function(event) {
      console.error(event)
   },
  }
});
</script>
```

