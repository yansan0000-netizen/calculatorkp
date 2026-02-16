import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  calcCapPrice, calcBoxPrice, calcFlashingPrice, calcAddonPrice,
  capModels, boxModels, flashingModels, addonOptions,
  CapModel, BoxModel, FlashingModel, AddonId,
} from "@/data/calculatorData";

export interface CompanyInfo {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
}

interface PdfData {
  dimensionX: number;
  dimensionY: number;
  dimensionH: number;
  roofAngle: number;
  metalCoating: string;
  metalColor: string;
  metalPrice: number;
  meshPrice: number;
  stainlessPrice: number;
  zincPrice065: number;
  capModel: CapModel;
  boxModel: BoxModel;
  flashingModel: FlashingModel;
  selectedAddons: AddonId[];
  discount: number;
  comment: string;
  company: CompanyInfo;
}

export async function generateCommercialPdf(data: PdfData) {
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;left:-9999px;top:0;width:800px;padding:40px;background:#fff;font-family:sans-serif;color:#111;";

  const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " руб";

  const { dimensionX: X, dimensionY: Y, dimensionH: H,
    metalPrice, meshPrice, stainlessPrice, zincPrice065,
    capModel, boxModel, flashingModel, selectedAddons } = data;

  interface Row { name: string; price: number }
  const rows: Row[] = [];

  if (capModel !== "custom") {
    const info = capModels.find(c => c.id === capModel);
    rows.push({ name: `Колпак: ${info?.name}`, price: calcCapPrice(capModel, X, Y, metalPrice) });
  } else {
    rows.push({ name: "Колпак: по эскизу", price: 0 });
  }

  if (boxModel !== "none") {
    const info = boxModels.find(b => b.id === boxModel);
    rows.push({ name: `Короб: ${info?.name}`, price: calcBoxPrice(boxModel, X, Y, H, metalPrice) });
  }

  if (flashingModel !== "none") {
    const info = flashingModels.find(f => f.id === flashingModel);
    rows.push({ name: `Оклад: ${info?.name}`, price: calcFlashingPrice(flashingModel, X, Y, metalPrice) });
  }

  selectedAddons.forEach(id => {
    const opt = addonOptions.find(a => a.id === id);
    if (opt) {
      rows.push({
        name: opt.name,
        price: calcAddonPrice(id, capModel, X, Y, H, metalPrice, meshPrice, stainlessPrice, zincPrice065),
      });
    }
  });

  const total = rows.reduce((s, r) => s + r.price, 0);
  const discountedTotal = total * (1 - (data.discount || 0) / 100);
  const hasDiscount = (data.discount || 0) > 0;
  const co = data.company;
  const hasCompany = co.companyName || co.contactPerson || co.phone || co.email;

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:24px">
      <h1 style="font-size:22px;margin:0;font-weight:700">КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</h1>
      <p style="font-size:12px;color:#999;margin:4px 0 0">Дата: ${new Date().toLocaleDateString("ru-RU")}</p>
    </div>
    ${hasCompany ? `
    <div style="background:#f8f8f8;border:1px solid #e0e0e0;border-radius:6px;padding:14px 18px;margin-bottom:20px;font-size:13px">
      ${co.companyName ? `<div style="font-weight:700;font-size:15px;margin-bottom:6px">${co.companyName}</div>` : ""}
      ${co.contactPerson ? `<div style="color:#444">Контактное лицо: ${co.contactPerson}</div>` : ""}
      ${co.phone ? `<div style="color:#444">Тел: ${co.phone}</div>` : ""}
      ${co.email ? `<div style="color:#444">Email: ${co.email}</div>` : ""}
    </div>` : ""}
    <h3 style="font-size:14px;margin:20px 0 8px;border-bottom:1px solid #ddd;padding-bottom:6px">Параметры</h3>
    <table style="width:100%;font-size:13px;border-collapse:collapse;margin-bottom:20px">
      <tr><td style="padding:4px 0;color:#666;width:220px">Размеры (X × Y × H)</td>
          <td style="padding:4px 0;font-weight:600">${X} × ${Y} × ${H} мм</td></tr>
      <tr><td style="padding:4px 0;color:#666">Угол кровли</td>
          <td style="padding:4px 0;font-weight:600">${data.roofAngle}°</td></tr>
      <tr><td style="padding:4px 0;color:#666">Покрытие</td>
          <td style="padding:4px 0;font-weight:600">${data.metalCoating}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Цвет</td>
          <td style="padding:4px 0;font-weight:600">${data.metalColor}</td></tr>
      <tr><td style="padding:4px 0;color:#666">Цена металла</td>
          <td style="padding:4px 0;font-weight:600">${metalPrice} руб</td></tr>
    </table>
    <h3 style="font-size:14px;margin:20px 0 8px;border-bottom:1px solid #ddd;padding-bottom:6px">Состав</h3>
    <table style="width:100%;font-size:13px;border-collapse:collapse">
      <thead>
        <tr style="background:#f5f5f5">
          <th style="text-align:left;padding:8px;border:1px solid #ddd">№</th>
          <th style="text-align:left;padding:8px;border:1px solid #ddd">Наименование</th>
          <th style="text-align:right;padding:8px;border:1px solid #ddd">Стоимость</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((r, i) => `
          <tr>
            <td style="padding:8px;border:1px solid #ddd">${i + 1}</td>
            <td style="padding:8px;border:1px solid #ddd;font-weight:600">${r.name}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right">${r.price > 0 ? fmt(r.price) : "—"}</td>
          </tr>`).join("")}
        <tr style="background:#f5f5f5;font-weight:700">
          <td colspan="2" style="padding:8px;border:1px solid #ddd;text-align:right">ИТОГО:</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right;font-size:15px">${fmt(total)}</td>
        </tr>
        ${hasDiscount ? `
        <tr style="font-weight:700;color:#666">
          <td colspan="2" style="padding:8px;border:1px solid #ddd;text-align:right">Скидка ${data.discount}%:</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right">-${fmt(total - discountedTotal)}</td>
        </tr>
        <tr style="background:#e8f5e9;font-weight:700;color:#2e7d32">
          <td colspan="2" style="padding:8px;border:1px solid #ddd;text-align:right">ИТОГО СО СКИДКОЙ:</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right;font-size:16px">${fmt(discountedTotal)}</td>
        </tr>` : ""}
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

  pdf.save(`КП_${new Date().toLocaleDateString("ru-RU").replace(/\./g, "-")}.pdf`);
}
