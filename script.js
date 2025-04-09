// script.js
import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const form = document.getElementById("inventory-form");
const tableBody = document.querySelector("#inventory-table tbody");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("item-name").value;
  const quantity = parseInt(document.getElementById("item-quantity").value);
  const operation = document.getElementById("operation").value;
  const notes = document.getElementById("item-notes").value;

  try {
    await addDoc(collection(db, "inventory"), {
      name,
      quantity,
      operation,
      notes,
      createdAt: serverTimestamp()
    });
    alert("تم الحفظ بنجاح");
    form.reset();
    loadInventory();
  } catch (err) {
    alert("حدث خطأ أثناء الحفظ");
    console.error(err);
  }
});

async function loadInventory() {
  tableBody.innerHTML = "";
  const snapshot = await getDocs(collection(db, "inventory"));
  snapshot.forEach(doc => {
    const item = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.operation}</td>
      <td>${item.notes || ""}</td>
      <td>${item.createdAt?.toDate().toLocaleString("ar-EG") || ""}</td>
    `;
    tableBody.appendChild(row);
  });
}

// تحميل البيانات عند بداية الصفحة
loadInventory();
await fetch("https://script.google.com/macros/s/AKfycbzaLPfHx3ZCOAGh1_8iKE25hGPdRx6Tg6jXVwx4T0tpxsnSvHxPaoCYgl2AghM7vXcjNw/exec", {
    method: "POST",
    body: JSON.stringify({ name, quantity, operation, notes }),
    headers: { "Content-Type": "application/json" }
  });
  