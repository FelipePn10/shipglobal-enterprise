// Product categories
export const productCategories = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing & Apparel" },
    { value: "home", label: "Home & Garden" },
    { value: "beauty", label: "Beauty & Personal Care" },
    { value: "sports", label: "Sports & Outdoors" },
    { value: "automotive", label: "Automotive" },
    { value: "toys", label: "Toys & Games" },
    { value: "books", label: "Books & Media" },
    { value: "jewelry", label: "Jewelry & Watches" },
    { value: "health", label: "Health & Wellness" },
    { value: "office", label: "Office Supplies" },
    { value: "other", label: "Other" },
  ]
  
  // Popular countries for imports
  export const popularCountries = [
    { value: "CN", label: "China" },
    { value: "US", label: "United States" },
    { value: "JP", label: "Japan" },
    { value: "DE", label: "Germany" },
    { value: "KR", label: "South Korea" },
    { value: "UK", label: "United Kingdom" },
    { value: "IT", label: "Italy" },
    { value: "FR", label: "France" },
    { value: "TW", label: "Taiwan" },
    { value: "VN", label: "Vietnam" },
    { value: "IN", label: "India" },
    { value: "MX", label: "Mexico" },
    { value: "TH", label: "Thailand" },
    { value: "MY", label: "Malaysia" },
    { value: "SG", label: "Singapore" },
    { value: "ES", label: "Spain" },
    { value: "CA", label: "Canada" },
    { value: "BR", label: "Brazil" },
    { value: "AU", label: "Australia" },
    { value: "NL", label: "Netherlands" },
    { value: "CH", label: "Switzerland" },
    { value: "SE", label: "Sweden" },
    { value: "BE", label: "Belgium" },
    { value: "AT", label: "Austria" },
    { value: "PL", label: "Poland" },
    { value: "ID", label: "Indonesia" },
    { value: "TR", label: "Turkey" },
    { value: "RU", label: "Russia" },
    { value: "AE", label: "United Arab Emirates" },
    { value: "PT", label: "Portugal" },
  ]
  
  // CPF validation helper
  export const isCPFValid = (cpf: string) => {
    const cleanCPF = cpf.replace(/[^\d]/g, "")
  
    if (cleanCPF.length !== 11) return false
  
    // Check for known invalid patterns
    if (/^(.)\1+$/.test(cleanCPF)) return false
  
    // Validation algorithm for CPF
    let sum = 0
    let remainder
  
    for (let i = 1; i <= 9; i++) {
      sum += Number.parseInt(cleanCPF.substring(i - 1, i)) * (11 - i)
    }
  
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cleanCPF.substring(9, 10))) return false
  
    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += Number.parseInt(cleanCPF.substring(i - 1, i)) * (12 - i)
    }
  
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cleanCPF.substring(10, 11))) return false
  
    return true
  }
  
  