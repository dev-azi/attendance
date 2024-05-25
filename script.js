document.addEventListener("DOMContentLoaded", function() {
  const names = [
    "BIANCA", "JOMAR", "JUSTIN", "JEYA", "ESME", "JULIARD",
    "JULLIAN", "KORINA", "MAEDEN", "MARY", "MINA", "NATHANIEL",
    "WAVENEY", "CYRUS"
  ];

  const attendanceTable = document.getElementById("attendanceTable");

  names.forEach(name => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = name;
    row.appendChild(nameCell);

    ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].forEach(day => {
      const cell = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("form-check-input");
      checkbox.value = (day === "sunday" || day === "saturday") ? "1.5" : "1";
      cell.appendChild(checkbox);
      row.appendChild(cell);
    });

    const deductedAmountCell = document.createElement("td");
    const deductedAmountInput = document.createElement("input");
    deductedAmountInput.type = "number";
    deductedAmountInput.classList.add("form-control", "form-control-sm");
    deductedAmountInput.value = 0;
    deductedAmountInput.oninput = function() {
      if (deductedAmountInput.value < 0) {
        deductedAmountInput.value = Math.abs(deductedAmountInput.value);
      }
    };
    deductedAmountCell.appendChild(deductedAmountInput);
    row.appendChild(deductedAmountCell);

    attendanceTable.appendChild(row);
  });
});

function calculateResults() {
  const amountThisWeek = parseFloat(document.getElementById("amountThisWeek").value) || 0;
  const deductedAmount = Math.abs(parseFloat(document.getElementById("deductedAmount").value)) || 0;

  const resultTable = document.getElementById("resultTable");
  resultTable.innerHTML = ""; // Clear previous results

  const rows = document.querySelectorAll("#attendanceTable tr");
  
  rows.forEach(row => {
    const name = row.children[0].textContent;
    let totalAbsentDays = 0;
    for (let i = 1; i <= 7; i++) {
      const checkbox = row.children[i].querySelector("input[type='checkbox']");
      if (!checkbox.checked) {
        totalAbsentDays += parseFloat(checkbox.value);
      }
    }
    const deductedAmountLastWeek = parseFloat(row.children[8].querySelector("input[type='number']").value) || 0;
    const totalDeductedAmount = (totalAbsentDays * deductedAmount) + deductedAmountLastWeek;
    let totalAmountToBeReceived = amountThisWeek - totalDeductedAmount;

    let finalAmountToBeReceived;
    if (totalAmountToBeReceived > 0) {
      const additionalAmountToBeReceived = totalAmountToBeReceived * 0.1;
      finalAmountToBeReceived = totalAmountToBeReceived + additionalAmountToBeReceived;
    } else {
      finalAmountToBeReceived = totalAmountToBeReceived;
    }

    const resultRow = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = name;
    resultRow.appendChild(nameCell);

    const totalCell = document.createElement("td");
    totalCell.textContent = finalAmountToBeReceived.toFixed(2);
    resultRow.appendChild(totalCell);

    resultTable.appendChild(resultRow);
  });
}

function copyResults() {
  const resultTable = document.getElementById("resultTable");
  const rows = resultTable.querySelectorAll("tr");
  let textToCopy = "Amount to be received this week:\n";

  rows.forEach(row => {
    const name = row.children[0].textContent;
    const total = row.children[1].textContent;
    textToCopy += `${name}: ${total}\n`;
  });

  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = textToCopy;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);

  showCopyNotification();
}

function showCopyNotification() {
  const notification = document.getElementById("copyNotification");
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 2000);
}
