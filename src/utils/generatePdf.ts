import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Product, calculatePrice } from "@/data/calculatorData";

export interface CompanyInfo {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
}

interface PdfData {
  products: Product[];
  selectedProducts: string[];
  dimensionX: number;
  dimensionY: number;
  dimensionL: number;
  roofAngle: number;
  metalCoating: string;
  metalColor: string;
  capCollection: string;
  designBypass: string;
  roofMaterial: string;
  coatingMultiplier: number;
  comment: string;
  company: CompanyInfo;
}

export async function generateCommercialPdf(data: PdfData) {
  // Create a hidden container with the proposal content
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;left:-9999px;top:0;width:800px;padding:40px;background:#fff;font-family:sans-serif;color:#111;";

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("ru-RU").format(n) + " руб";

  const selected = data.products.filter((p) =>
    data.selectedProducts.includes(p.id)
  );

  const rows = selected.map((p) => {
    const price = calculatePrice(
      p,
      data.dimensionX,
      data.dimensionY,
      data.dimensionL,
      data.roofAngle,
      data.coatingMultiplier
    );
    return { name: p.name, desc: p.description, price };
  });

  const total = rows.reduce((s, r) => s + r.price, 0);

  const co = data.company;
  const hasCompany = co.companyName || co.contactPerson || co.phone || co.email;

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:24px">
      <h1 style="font-size:22px;margin:0;font-weight:700">КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</h1>
      <p style="font-size:13px;color:#666;margin:6px 0 0">FOR SYSTEM PIPE ЕВРОПА 2024</p>
      <p style="font-size:12px;color:#999;margin:4px 0 0">Дата: ${new Date().toLocaleDateString("ru-RU")}</p>
    </div>

    ${hasCompany ? `
    <div style="background:#f8f8f8;border:1px solid #e0e0e0;border-radius:6px;padding:14px 18px;margin-bottom:20px;font-size:13px">
      ${co.companyName ? `<div style="font-weight:700;font-size:15px;margin-bottom:6px">${co.companyName}</div>` : ""}
      ${co.contactPerson ? `<div style="color:#444">Контактное лицо: ${co.contactPerson}</div>` : ""}
      ${co.phone ? `<div style="color:#444">Тел: ${co.phone}</div>` : ""}
      ${co.email ? `<div style="color:#444">Email: ${co.email}</div>` : ""}
    </div>` : ""}

    <h3 style="font-size:14px;margin:20px 0 8px;border-bottom:1px solid #ddd;padding-bottom:6px">
      Параметры конфигурации
    </h3>
    <table style="width:100%;font-size:13px;border-collapse:collapse;margin-bottom:20px">
      <tr><td style="padding:4px 0;color:#666;width:220px">Размеры трубы (X × Y × L)</td>
          <td style="padding:4px 0;font-weight:600">${data.dimensionX} × ${data.dimensionY} × ${data.dimensionL} мм</td></tr>
      <tr><td style="padding:4px 0;color:#666">Угол уклона кровли</td>
          <td style="padding:4px 0;font-weight:600">${data.roofAngle}°</td></tr>
      <tr><td style="padding:4px 0;color:#666">Покрытие металла</td>
          <td style="padding:4px 0;font-weight:600">${data.metalCoating}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Цвет металла</td>
          <td style="padding:4px 0;font-weight:600">${data.metalColor}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Коллекция колпаков</td>
          <td style="padding:4px 0;font-weight:600">${data.capCollection}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Дизайнерские обходы</td>
          <td style="padding:4px 0;font-weight:600">${data.designBypass}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Материал кровли</td>
          <td style="padding:4px 0;font-weight:600">${data.roofMaterial}</td></tr>
    </table>

    <h3 style="font-size:14px;margin:20px 0 8px;border-bottom:1px solid #ddd;padding-bottom:6px">
      Состав комплекта
    </h3>
    <table style="width:100%;font-size:13px;border-collapse:collapse">
      <thead>
        <tr style="background:#f5f5f5">
          <th style="text-align:left;padding:8px;border:1px solid #ddd">№</th>
          <th style="text-align:left;padding:8px;border:1px solid #ddd">Наименование</th>
          <th style="text-align:left;padding:8px;border:1px solid #ddd">Описание</th>
          <th style="text-align:right;padding:8px;border:1px solid #ddd">Стоимость</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (r, i) => `
          <tr>
            <td style="padding:8px;border:1px solid #ddd">${i + 1}</td>
            <td style="padding:8px;border:1px solid #ddd;font-weight:600">${r.name}</td>
            <td style="padding:8px;border:1px solid #ddd">${r.desc}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right">${formatPrice(r.price)}</td>
          </tr>`
          )
          .join("")}
        <tr style="background:#f5f5f5;font-weight:700">
          <td colspan="3" style="padding:8px;border:1px solid #ddd;text-align:right">ИТОГО:</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right;font-size:15px">${formatPrice(total)}</td>
        </tr>
      </tbody>
    </table>

    ${data.comment ? `<div style="margin-top:20px;font-size:13px"><strong>Комментарий:</strong> ${data.comment}</div>` : ""}

    <p style="margin-top:32px;font-size:11px;color:#999;text-align:center">
      Данное коммерческое предложение носит информационный характер и не является публичной офертой.
    </p>
  `;

  document.body.appendChild(container);

  const canvas = await html2canvas(container, { scale: 2, useCORS: true });
  document.body.removeChild(container);

  const imgWidth = 190;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF("p", "mm", "a4");

  // Handle multi-page if content is tall
  const pageHeight = 277;
  let position = 10;

  if (imgHeight <= pageHeight) {
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, position, imgWidth, imgHeight);
  } else {
    let remainingHeight = imgHeight;
    while (remainingHeight > 0) {
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, position, imgWidth, imgHeight);
      remainingHeight -= pageHeight;
      if (remainingHeight > 0) {
        pdf.addPage();
        position = -(imgHeight - remainingHeight);
      }
    }
  }

  pdf.save(`КП_PIPE_${new Date().toLocaleDateString("ru-RU").replace(/\./g, "-")}.pdf`);
}
