
/**
 * Calculate Philippine tax based on the 8% flat rate option for freelancers
 * 
 * @param annualIncome Annual income in PHP
 * @returns Object with tax details
 */
export function calculatePhilippineTax(annualIncome: number) {
  const taxExemptThreshold = 250000; // PHP 250,000
  const flatTaxRate = 0.08; // 8%
  
  // No tax due if income is below threshold
  if (annualIncome <= taxExemptThreshold) {
    return {
      taxDue: 0,
      effectiveRate: 0,
      isExempt: true
    };
  }
  
  // Calculate tax using 8% flat rate
  const taxDue = annualIncome * flatTaxRate;
  const effectiveRate = (taxDue / annualIncome) * 100;
  
  return {
    taxDue,
    effectiveRate,
    isExempt: false
  };
}

/**
 * Calculate tax based on graduated rates (progressive tax)
 * This is the alternative to the 8% flat rate
 * 
 * @param annualIncome Annual income in PHP
 * @returns Object with tax details
 */
export function calculatePhilippineGraduatedTax(annualIncome: number) {
  let taxDue = 0;
  
  if (annualIncome <= 250000) {
    taxDue = 0;
  } else if (annualIncome <= 400000) {
    taxDue = (annualIncome - 250000) * 0.15;
  } else if (annualIncome <= 800000) {
    taxDue = 22500 + (annualIncome - 400000) * 0.20;
  } else if (annualIncome <= 2000000) {
    taxDue = 102500 + (annualIncome - 800000) * 0.25;
  } else if (annualIncome <= 8000000) {
    taxDue = 402500 + (annualIncome - 2000000) * 0.30;
  } else {
    taxDue = 2202500 + (annualIncome - 8000000) * 0.35;
  }
  
  const effectiveRate = annualIncome > 0 ? (taxDue / annualIncome) * 100 : 0;
  
  return {
    taxDue,
    effectiveRate,
    isExempt: annualIncome <= 250000
  };
}
