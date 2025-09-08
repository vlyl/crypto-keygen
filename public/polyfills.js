// Browser polyfills for crypto libraries
// This file is loaded before the main application to ensure Buffer is available globally

// Buffer polyfill using a simple implementation that works in browsers
if (typeof globalThis.Buffer === 'undefined') {
  // Simple Buffer polyfill - create a minimal Buffer-like object
  globalThis.Buffer = {
    from: function(input, encoding) {
      if (typeof input === 'string') {
        // Convert string to Uint8Array
        const encoder = new TextEncoder();
        return encoder.encode(input);
      } else if (input instanceof Uint8Array || Array.isArray(input)) {
        return new Uint8Array(input);
      }
      return new Uint8Array(0);
    },
    alloc: function(size, fill, encoding) {
      const buffer = new Uint8Array(size);
      if (fill !== undefined) {
        buffer.fill(typeof fill === 'string' ? fill.charCodeAt(0) : fill);
      }
      return buffer;
    },
    isBuffer: function(obj) {
      return obj instanceof Uint8Array;
    }
  };
  
  console.log('✅ Simple Buffer polyfill loaded');
}

// Process polyfill - minimal implementation
if (typeof globalThis.process === 'undefined') {
  globalThis.process = {
    browser: true,
    env: {},
    version: '',
    versions: {},
    nextTick: function(callback) {
      setTimeout(callback, 0);
    }
  };
  
  console.log('✅ Process polyfill loaded');
}