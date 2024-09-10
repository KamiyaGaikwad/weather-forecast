document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchBtn').addEventListener('click', function() {
      const city = document.getElementById('city').value;
      if (city) {
        console.log('City detected as', city);
        // Will add API call here later
      }
    });

});