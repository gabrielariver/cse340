document.addEventListener("DOMContentLoaded", function () {
    const selectElement = document.getElementById("classification_id");
  
    selectElement.addEventListener("change", async function () {
      const classificationId = selectElement.value;
  
      try {
        const response = await fetch(`/inv/getInventory/${classificationId}`);
        const data = await response.json();
  
        buildInventoryTable(data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      }
    });
  });
    /**
     *  displays the inventory in the DOM
    **/
  function buildInventoryTable(data) {
    const table = document.createElement("table");
    table.classList.add("inv-display");
  
    // table headers
    const headers = table.insertRow();
    headers.innerHTML = `
      <th>Vehicle Name</th>
      <th>Model</th>
      <th>Year</th>
      <th>Price</th>
      <th>Modify</th>
      <th>Delete</th>
    `;
  
    // rows
    data.forEach(vehicle => {
      const row = table.insertRow();
      row.innerHTML = `
        <td>${vehicle.inv_make} ${vehicle.inv_model}</td>
        <td>${vehicle.inv_model}</td>
        <td>${vehicle.inv_year}</td>
        <td>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</td>
        <td><a href='/inv/edit/${vehicle.inv_id}' title='Click to update'>Modify</a></td>
        <td><a href='/inv/delete/${vehicle.inv_id}' title='Click to delete'>Delete</a></td>
      `;
    });
  
    const displayDiv = document.getElementById("inventoryDisplay");
    displayDiv.innerHTML = "";
    displayDiv.appendChild(table);
  }
  