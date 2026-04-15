export const generatePassword = (length = 16, options = { upper: true, lower: true, numbers: true, symbols: true }) => {
    const charset = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };
  
    let availableChars = '';
    if (options.upper) availableChars += charset.upper;
    if (options.lower) availableChars += charset.lower;
    if (options.numbers) availableChars += charset.numbers;
    if (options.symbols) availableChars += charset.symbols;
  
    if (availableChars === '') {
      return '';
    }
  
    let password = '';
    // Ensure at least one character of each selected type if length is sufficient
    if (options.upper) password += charset.upper[Math.floor(Math.random() * charset.upper.length)];
    if (options.lower) password += charset.lower[Math.floor(Math.random() * charset.lower.length)];
    if (options.numbers) password += charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
    if (options.symbols) password += charset.symbols[Math.floor(Math.random() * charset.symbols.length)];
  
    while (password.length < length) {
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      password += availableChars[randomIndex];
    }
  
    // Shuffle the result
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  };
  
  export const analyzePasswordStrength = (password) => {
    if (!password) return { score: 0, label: 'Ninguna', color: 'gray' };
    
    let score = 0;
    if (password.length > 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // symbols
  
    if (score < 3) return { score, label: 'Débil', color: 'var(--danger)' };
    if (score < 5) return { score, label: 'Media', color: '#f59e0b' }; // amber/orange
    return { score, label: 'Fuerte', color: 'var(--success)' };
  };
  
