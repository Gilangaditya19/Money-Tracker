const API_URL = 'https://script.google.com/macros/s/AKfycbx5DZcMwgjSp8HrkvHL1lCFWOnHrwSiih_uWCZWIAvXMxU1l0wuq7OLQR7K6ag85QRkjQ/exec';

// Standardized fetch wrapper
async function fetchGasAPI(method, payload = null) {
  try {
    const options = {
      method: method,
    };

    // For GET requests, GAS requires params in URL. For POST, we use text/plain to avoid CORS preflight.
    let url = API_URL;

    if (method === 'POST') {
      options.body = JSON.stringify(payload);
      // It is important to send as text/plain so GAS doesn't trigger CORS preflight
      options.headers = {
        'Content-Type': 'text/plain;charset=utf-8',
      };
    } else if (method === 'GET' && payload) {
      const params = new URLSearchParams(payload);
      url = `${API_URL}?${params.toString()}`;
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return { status: 'error', message: 'Failed to connect to server.' };
  }
}

export const api = {
  login: async (email, password) => {
    return await fetchGasAPI('POST', { action: 'login', email, password });
  },

  register: async (username, email, password) => {
    return await fetchGasAPI('POST', { action: 'register', username, email, password });
  },

  getDashboard: async (userId) => {
    return await fetchGasAPI('GET', { action: 'getDashboard', user_id: userId });
  },

  addTransaction: async (userId, type, amount, title, category) => {
    return await fetchGasAPI('POST', {
      action: 'addTransaction',
      user_id: userId,
      type,
      amount,
      title,
      category
    });
  },

  addGoal: async (userId, goalName, targetAmount) => {
    return await fetchGasAPI('POST', {
      action: 'addGoal',
      user_id: userId,
      goal_name: goalName,
      target_amount: targetAmount
    });
  },

  updateGoal: async (goalId, amount) => {
    return await fetchGasAPI('POST', {
      action: 'updateGoal',
      goal_id: goalId,
      amount
    });
  },

  deleteTransaction: async (txId) => {
    return await fetchGasAPI('POST', {
      action: 'deleteTransaction',
      tx_id: txId
    });
  },

  deleteGoal: async (goalId) => {
    return await fetchGasAPI('POST', {
      action: 'deleteGoal',
      goal_id: goalId
    });
  }
};
