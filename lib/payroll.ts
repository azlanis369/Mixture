// Pengiraan gaji & potongan berkanun Malaysia (anggaran 2026).
// NOTA: Kadar dipermudahkan & boleh dikonfigurasi. Untuk penyata rasmi,
// sahkan dengan jadual terkini KWSP/PERKESO/SIP/LHDN.

const SOCSO_CEILING = 6000; // siling gaji caruman PERKESO & SIP
const EIS_CEILING = 6000;

export type PayrollInput = {
  basicSalary: number;
  allowance?: number;
  overtimePay?: number;
  claimsTotal?: number; // tuntutan diluluskan (tidak dikenakan caruman)
  age?: number; // untuk tentukan kadar EPF warga emas
};

export type PayrollResult = {
  basicSalary: number;
  allowance: number;
  overtimePay: number;
  claimsTotal: number;
  grossPay: number;
  epfEmployee: number;
  epfEmployer: number;
  socsoEmployee: number;
  socsoEmployer: number;
  eisEmployee: number;
  eisEmployer: number;
  pcb: number;
  totalDeduction: number;
  netPay: number;
};

function roundRM(n: number) {
  return Math.round(n * 100) / 100;
}

// EPF/KWSP: pekerja 11%, majikan 13% (gaji ≤ RM5000) atau 12% (> RM5000)
function calcEpf(wage: number) {
  const employee = Math.ceil(wage * 0.11);
  const employerRate = wage <= 5000 ? 0.13 : 0.12;
  const employer = Math.ceil(wage * employerRate);
  return { employee, employer };
}

// SOCSO/PERKESO Kategori 1: pekerja 0.5%, majikan 1.75% (siling RM6000)
function calcSocso(wage: number) {
  const capped = Math.min(wage, SOCSO_CEILING);
  return {
    employee: roundRM(capped * 0.005),
    employer: roundRM(capped * 0.0175),
  };
}

// EIS/SIP: pekerja 0.2%, majikan 0.2% (siling RM6000)
function calcEis(wage: number) {
  const capped = Math.min(wage, EIS_CEILING);
  return {
    employee: roundRM(capped * 0.002),
    employer: roundRM(capped * 0.002),
  };
}

// PCB (anggaran ringkas) — cukai pendapatan progresif tahunan individu bujang,
// selepas pelepasan peribadi RM9000 + pelepasan EPF (maks RM4000).
function calcPcb(monthlyGross: number, annualEpfEmployee: number) {
  const annualIncome = monthlyGross * 12;
  const epfRelief = Math.min(annualEpfEmployee, 4000);
  const chargeable = Math.max(0, annualIncome - 9000 - epfRelief);

  // Kadar cukai individu pemastautin (anggaran)
  const brackets = [
    { upTo: 5000, rate: 0 },
    { upTo: 20000, rate: 0.01 },
    { upTo: 35000, rate: 0.03 },
    { upTo: 50000, rate: 0.06 },
    { upTo: 70000, rate: 0.11 },
    { upTo: 100000, rate: 0.19 },
    { upTo: 400000, rate: 0.25 },
    { upTo: Infinity, rate: 0.26 },
  ];

  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (chargeable > prev) {
      const slice = Math.min(chargeable, b.upTo) - prev;
      tax += slice * b.rate;
      prev = b.upTo;
    } else break;
  }
  return roundRM(Math.max(0, tax / 12));
}

export function calcPayroll(input: PayrollInput): PayrollResult {
  const basicSalary = input.basicSalary || 0;
  const allowance = input.allowance || 0;
  const overtimePay = input.overtimePay || 0;
  const claimsTotal = input.claimsTotal || 0;

  // Gaji caruman = gaji asas + elaun + OT (tuntutan dikecualikan)
  const contributoryWage = basicSalary + allowance + overtimePay;
  const grossPay = contributoryWage + claimsTotal;

  const epf = calcEpf(contributoryWage);
  const socso = calcSocso(contributoryWage);
  const eis = calcEis(contributoryWage);
  const pcb = calcPcb(contributoryWage, epf.employee * 12);

  const totalDeduction = roundRM(
    epf.employee + socso.employee + eis.employee + pcb
  );
  const netPay = roundRM(grossPay - totalDeduction);

  return {
    basicSalary,
    allowance,
    overtimePay,
    claimsTotal,
    grossPay: roundRM(grossPay),
    epfEmployee: epf.employee,
    epfEmployer: epf.employer,
    socsoEmployee: socso.employee,
    socsoEmployer: socso.employer,
    eisEmployee: eis.employee,
    eisEmployer: eis.employer,
    pcb,
    totalDeduction,
    netPay,
  };
}

// Anggaran bayaran lebih masa: (gaji asas / 26 hari / 8 jam) * jam * kadar
export function overtimeRateHourly(basicSalary: number) {
  return basicSalary / 26 / 8;
}
