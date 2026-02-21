# BikeClinique Booking Widget

## Embed Options

### Option 1: Iframe (Recommended)
Add this to your website:

```html
<iframe 
  src="https://bikeclinique-platform.vercel.app/widget" 
  width="100%" 
  height="600" 
  style="border: none; border-radius: 16px;"
  title="Book Bike Service"
></iframe>
```

### Option 2: Popup Button
Add this button to your site, then it opens the booking in a modal:

```html
<!-- Add this button where you want it -->
<button onclick="document.getElementById('bc-widget-modal').style.display='flex'" style="background: #FF6B35; color: white; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
  🚴 Book a Service
</button>

<!-- Add this modal at the bottom of your page -->
<div id="bc-widget-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
  <div style="background: white; border-radius: 16px; width: 90%; max-width: 420px; max-height: 90vh; overflow: auto;">
    <iframe src="https://bikeclinique-platform.vercel.app/widget" width="100%" height="600" style="border: none;"></iframe>
    <button onclick="document.getElementById('bc-widget-modal').style.display='none'" style="position: absolute; top: 10px; right: 10px; background: white; border: none; font-size: 24px; cursor: pointer; padding: 5px 10px; border-radius: 50%;">✕</button>
  </div>
</div>
```

### Option 3: JavaScript Widget
For advanced embedding, use our JavaScript widget:

```html
<!-- Add this script to your site -->
<script src="https://bikeclinique-platform.vercel.app/widget.js"></script>
<script>
  BikeCliniqueWidget.init({
    shop: 'your-shop-slug', // optional
    primaryColor: '#FF6B35',
    position: 'bottom-right' // or 'bottom-left'
  });
</script>
```

## Demo

- **Live Widget:** https://bikeclinique-platform.vercel.app/widget
- **Main Site:** https://bikeclinique-platform.vercel.app

## Customization

The widget can be customized by passing parameters:
- `theme` - 'light' or 'dark'  
- `primaryColor` - Your brand color
- `shop` - Shop identifier (for multi-tenant)

Example with customizations:
```html
<iframe 
  src="https://bikeclinique-platform.vercel.app/widget?theme=dark&primaryColor=FF6B35" 
  width="100%" 
  height="600" 
  style="border: none; border-radius: 16px;"
></iframe>
```
