import { httpGET } from "../../util/http.js";
import { create } from "../../util/createElement.js";

const listContainer = document.getElementById("products");


(async () => {
  const res = await httpGET("/management/data/data.json").catch(e => console.log(e));
  const product = res.product;

  const max_quantity = 5;
  let temp = [...product].sort((a, b) => b.saled - a.saled);
  let fiveMostSaled = temp.slice(0, max_quantity);

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const canvas = document.getElementById('lineChart');
  const context = canvas?.getContext('2d');
  if (context && canvas) {
    const values = [10, 30, 20, 40, 25, 35, 50];
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 250;
    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    context.scale(scale, scale);
    context.clearRect(0, 0, width, height);
    context.strokeStyle = '#e5e7eb';
    context.lineWidth = 1;
    for (let row = 0; row < 4; row += 1) {
      const y = 16 + (height - 40) * row / 3;
      context.beginPath();
      context.moveTo(36, y);
      context.lineTo(width - 8, y);
      context.stroke();
    }
    context.strokeStyle = 'rgb(255, 187, 0)';
    context.lineWidth = 3;
    context.beginPath();
    values.forEach((value, index) => {
      const x = 36 + (width - 52) * index / (values.length - 1);
      const y = height - 24 - value / 60 * (height - 48);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
    context.fillStyle = '#6b7280';
    context.font = '11px sans-serif';
    labels.forEach((label, index) => {
      const x = 36 + (width - 52) * index / (labels.length - 1);
      context.fillText(label.slice(0, 3), x - 9, height - 5);
    });
  }


  fiveMostSaled.map(p => {
    let productListItem = create("tr", [{ id: p.id }],
    `
      <th scope="row">
        <img src="${p.imageSrc}" alt="${p.description}" width="50" height="50"/>
      </th>
      <td>${p.name}</td>
      <td>$ ${p.price}</td>
      <td>${p.saled}</td>
    `);
    // <div class="flex justify-center items-center w-10">
    //   <img src="${p.imageSrc}" alt="${p.description}" width="50" height="50"/>
    // </div>
    // <div class="flex flex-col w-80 gap-5 ml-10">
    //   <p>${p.name} - ${p.saled} sales</p>
    //   <p>${p.description}</p>
    //   <p class="text-sx text-darkgray">$ ${p.price}</p>
    // </div>
    // `
    // )

    // productListItem.classList.add("flex")
    // productListItem.classList.add("bg-gray-50")

    listContainer.appendChild(productListItem);
  })

})()
