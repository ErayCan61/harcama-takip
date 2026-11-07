import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function App() {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('harcamalar');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('harcamalar', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (!text || !amount) return;

    const newTransaction = {
      id: Math.floor(Math.random() * 100000000),
      text,
      amount: +amount
    };

    setTransactions([...transactions, newTransaction]);
    setText('');
    setAmount('');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  // Grafik için verileri hazırlıyoruz
  const chartData = [
    { name: 'Gelir', value: parseFloat(income) },
    { name: 'Gider', value: parseFloat(expense) }
  ];
  const COLORS = ['#22c55e', '#ef4444']; // Tailwind yeşil ve kırmızı renk kodları

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Cüzdanım</h1>

        {/* Bakiye Özeti */}
        <div className="text-center mb-6">
          <h2 className="text-gray-500 text-sm uppercase tracking-wide">Toplam Bakiye</h2>
          <p className={`text-4xl font-bold ${total < 0 ? 'text-red-500' : 'text-gray-800'}`}>
            {total} ₺
          </p>
        </div>

        <div className="flex justify-between bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
          <div className="text-center w-1/2 border-r border-gray-200">
            <h3 className="text-sm text-gray-500 uppercase">Gelir</h3>
            <p className="text-lg font-bold text-green-500">+{income} ₺</p>
          </div>
          <div className="text-center w-1/2">
            <h3 className="text-sm text-gray-500 uppercase">Gider</h3>
            <p className="text-lg font-bold text-red-500">-{expense} ₺</p>
          </div>
        </div>

        {/* Harcama Grafiği (Eğer işlem varsa görünür) */}
        {transactions.length > 0 && (
          <div className="mb-6" style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} ₺`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Harcama Ekleme Formu */}
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Yeni İşlem Ekle</h3>
        <form onSubmit={addTransaction} className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Açıklama</label>
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              placeholder="Örn: Market, Maaş..." 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tutar <br/><span className="text-xs text-gray-400 font-normal">(Gider için başına eksi "-" koyun)</span>
            </label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Örn: -150 veya 5000" 
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
            İşlemi Ekle
          </button>
        </form>

        {/* İşlem Geçmişi */}
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">İşlem Geçmişi</h3>
        <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {transactions.map(transaction => (
            <li 
              key={transaction.id} 
              className={`flex justify-between items-center p-3 rounded-lg shadow-sm border-r-4 ${transaction.amount < 0 ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}
            >
              <span className="font-medium text-gray-700">{transaction.text}</span>
              <div className="flex items-center gap-3">
                <span className={`font-bold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} ₺
                </span>
                <button 
                  onClick={() => deleteTransaction(transaction.id)}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  ✖
                </button>
              </div>
            </li>
          ))}
          {transactions.length === 0 && (
            <p className="text-gray-500 text-sm text-center">Henüz bir işlem eklenmedi.</p>
          )}
        </ul>
      </div>
    </div>
  )
}

export default App