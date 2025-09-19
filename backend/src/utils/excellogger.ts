import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

const excelDir = path.join(__dirname, "../../uploads/excel");

//to ensure directory exist
if (!fs.existsSync(excelDir)) {
  fs.mkdirSync(excelDir, { recursive: true });
}

const WORKER_SHEET = "Work Hours";
const ADMIN_SHEET = "All Work Hours";

interface ExcelData {
  userId: string;
  date: Date;
  name: string;
  locale: string;
  workhour: string;
  totalSeconds?: number;
}

function ensureWorksheetExist(
  workbook: ExcelJS.Workbook,
  sheetName: string,
  isAdmin: boolean = false
): ExcelJS.Worksheet {
  let worksheet = workbook.getWorksheet(sheetName);

  if (!worksheet) {
    worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = [
      { header: "Date", key: "date", width: 20 },
      { header: "Name", key: "name", width: 20 },
      { header: "Locale", key: "locale", width: 20 },
      { header: "Work Hour", key: "workhour", width: 35 },
      { header: "Total Seconds", key: "totalSeconds", width: 20 },
    ];
    if (isAdmin) {
      worksheet.getRow(1).font = { bold: true, color: { argb: "1e3a8a" } };
    }
  }
  return worksheet;
}

export async function appendToWorkerExcel(data: ExcelData) {
  const filePath = path.join(excelDir, `user_${data.userId}.xlsx`);
  let workbook = new ExcelJS.Workbook();

  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
    console.log("Excel file loaded successfully");
  }

  const worksheet = ensureWorksheetExist(workbook, WORKER_SHEET);
  //remove existing Total row (if any) before appending new data
  // const lastRow = worksheet.lastRow;
  // if (lastRow && lastRow.getCell(1).value === "TOTAL") {
  //   worksheet.spliceRows(lastRow.number, 1);
  // }

  //add new worklog

  const excelRowData = {
    date: data.date.toISOString(),
    name: data.name,
    locale: data.locale,
    workhour: data.workhour,
    totalSeconds: data.totalSeconds,
  };

  const excelArrayData = Object.values(excelRowData);
  worksheet.addRow(excelArrayData);

  await workbook.xlsx.writeFile(filePath);

  // //Recalculate total seconds
  // const total = worksheet
  //   .getColumn("totalSeconds")
  //   .values.slice(2)
  //   .filter((v) => typeof v === "number")
  //   .reduce((acc: number, val: number) => acc + val, 0);

  // //convert total seconds to H:M:S
  // const hours = Math.floor(total / 3600);
  // const minutes = Math.floor((total % 3600) / 60);
  // const seconds = total % 60;
  // const totalFormated = `${hours}h ${minutes}m ${seconds}s`;

  // //append Total row
  // worksheet.addRow({
  //   date: "TOTAL",
  //   name: "",
  //   workhour: totalFormated,
  //   seconds: total,
  // });

  // await workbook.xlsx.writeFile(filePath);
  // console.log("written to excel on worker sheet");
}

//add entry to admin workbook
export async function appendToAdminExcel(data: ExcelData) {
  const filePath = path.join(excelDir, `admin.xlsx`);

  const workbook = new ExcelJS.Workbook();

  if (fs.existsSync(filePath)) {
    await workbook.xlsx.readFile(filePath);
    console.log("Admin sheet loaded successfuly");
  }

  console.log(
    "Sheets in Admin file before:",
    workbook.worksheets.map((ws) => ws.name)
  );
  const worksheet = ensureWorksheetExist(workbook, ADMIN_SHEET, true);

  //removes old TOTAL row for this user if exists
  // worksheet.eachRow((row, rowNumber) => {
  //   if (row.getCell("name").value === `TOTAL-${data.name}`) {
  //     worksheet.spliceRows(rowNumber, 1);
  //   }
  // });

  //add a new log row
  const excelRowData = {
    date: data.date.toISOString(),
    name: data.name,
    locale: data.locale,
    workhour: data.workhour,
    totalSeconds: data.totalSeconds,
  };

  const excelArrayData = Object.values(excelRowData);
  worksheet.addRow(excelArrayData);

  await workbook.xlsx.writeFile(filePath);

  // //recalculate user's total
  // const total = worksheet
  //   .getColumn("totalSeconds")
  //   .values.slice(2)
  //   .filter((val, i) => {
  //     const row = worksheet.getRow(i);
  //     return row.getCell("name").value === data.name;
  //   })
  //   .reduce(
  //     (acc: number, val: any) => acc + (typeof val === "number" ? val : 0),
  //     0
  //   );

  // //convert total seconds to H:M:S
  // const hours = Math.floor(Number(total) / 3600);
  // const minutes = Math.floor((Number(total) % 3600) / 60);
  // const seconds = Number(total) % 60;
  // const totalFormated = `${hours}h ${minutes}m ${seconds}s`;

  // //append TOTAL row
  // const totalRow = worksheet.addRow({
  //   date: "TOTAL",
  //   name: `TOTAL-${data.name}`,
  //   workhour: totalFormated,
  //   totalSeconds: total,
  // });

  // totalRow.eachCell((cell) => {
  //   cell.font = { bold: true, color: { argb: "1e3a8a" } };
  //   cell.fill = {
  //     type: "pattern",
  //     pattern: "solid",
  //     fgColor: { argb: "E5E7EB" },
  //   };
  // });
  // // await workbook.xlsx.writeFile(filePath);
  // console.log("written to admin sheet");
}
