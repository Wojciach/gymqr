function formatNumber(event) {

    // Get the input value
    let value = event.target.value;
  
    // Remove any non-digit characters except the dot
    value = value.replace(/[^0-9.]/g, '');
  
    // Split the value into integer and decimal parts
    const parts = value.split('.');
  
    // Keep only two decimal places
    if (parts.length > 1) {
        parts[1] = parts[1].slice(0, 2);
    }
  
    // Join the parts back together
    value = parts.join('.');
  
    // Update the input value
    event.target.value = value;
  }

  export default formatNumber;