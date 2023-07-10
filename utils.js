export const formatDate = (data) => {
  const jsDate = new Date(data);

  const day = jsDate.getDate().toString().padStart(2, '0');
  const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
  const year = jsDate.getFullYear().toString();
  const hour = jsDate.getHours().toString().padStart(2, '0');
  const minute = jsDate.getMinutes().toString().padStart(2, '0');

  const data_formatada = `${day}/${month}/${year} ${hour}:${minute}`;

  return data_formatada
}

// Accept the example formats to get the month name. Ex: 1, '1', 'January', 'january'
export const getMonthName = (month) => {  
  
  const months = {
    1: 'January', 
    2: 'February', 
    3: 'March', 
    4: 'April', 
    5: 'May', 
    6: 'June', 
    7: 'July', 
    8: 'August', 
    9: 'September', 
    10: 'October', 
    11: 'November', 
    12: 'December'
  }

  if (month && !months[month]) {
    return capitalize(month)
  }

  if (!month) {
    return months
  }

  return capitalize(months[month])
}

export const capitalize = (string) => {
  if (!string) return string
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const validateInputNumber = (e) => {
  const value = e.target.value;
  const regex = /^\d+(\.\d{0,2})?$/;

  if (value !== '' && !regex.test(value)) {
    e.target.value = value.slice(0, -1)
  }
}

export const getCurrencySymbol = (currency) => {
  const currencySymbols = {
    'BRL': 'R$',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  }

  if (currency && currencySymbols[currency]) {
    return currencySymbols[currency]
  }
}


export const expensesMock = new Map()
expensesMock.set('January', [{
  id: 1,
  title: 'Expense 1',
  amount: 2,
  created_at: '2021-01-01 00:00:00'
}, 
{ 
    id: 2,
    title: 'Expense 2',
    amount: 3,
    created_at: '2021-01-01 00:00:00'
}])

expensesMock.set('February', [{
  id: 3,
  title: 'Expense 3',
  amount: 4,
  created_at: '2021-02-02 00:00:00'
}, 
{ 
    id: 4,
    title: 'Expense 4',
    amount: 5,
    created_at: '2021-02-02 00:00:00'
}])

expensesMock.set('March', [{
  id: 5,
  title: 'Expense 5',
  amount: 4,
  created_at: '2021-03-03 00:00:00'
}, 
{ 
    id: 6,
    title: 'Expense 6',
    amount: 5,
    created_at: '2021-03-03 00:00:00'
},
{ 
  id: 7,
  title: 'Expense 7',
  amount: 5,
  created_at: '2021-03-03 00:00:00'
}
])
