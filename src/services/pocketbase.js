import PocketBase from 'pocketbase';

//const pb = new PocketBase('http://127.0.0.1:8090');
const pb = new PocketBase(
  import.meta.env.VITE_PB_URL || 'https://betpromo.pro'
);


// Désactiver l'auto-cancellation pour éviter les problèmes
pb.autoCancellation(false);

export default pb;

// Helper pour gérer les erreurs
export const handlePBError = (error) => {
  console.error('PocketBase error:', error);
  if (error.response?.data) {
    return error.response.data;
  }
  return { message: error.message };
};

// Services pour chaque collection
export const bookmarkersService = {
  async getAll() {
    try {
      const records = await pb.collection('bookmakers').getFullList({
        sort: '-created',
      });
      return records;
    } catch (error) {
      console.error('Error fetching bookmakers:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const record = await pb.collection('bookmakers').create(data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const record = await pb.collection('bookmakers').update(id, data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await pb.collection('bookmakers').delete(id);
      return true;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  }
};

export const statsService = {
  async get() {
    try {
      const records = await pb.collection('stats').getFullList();
      return records[0] || null;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  },

  async update(id, data) {
    try {
      const record = await pb.collection('stats').update(id, data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  },

  async create(data) {
    try {
      const record = await pb.collection('stats').create(data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  }
};

export const activitiesService = {
  async getAll(limit = 50) {
    try {
      const records = await pb.collection('activities').getList(1, limit, {
        sort: '-created',
      });
      return records.items;
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const record = await pb.collection('activities').create(data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  }
};

export const analyticsService = {
  async getAll() {
    try {
      const records = await pb.collection('analytics').getFullList({
        sort: 'dayIndex',
      });
      return records;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return [];
    }
  },

  async update(id, data) {
    try {
      const record = await pb.collection('analytics').update(id, data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  },

  async create(data) {
    try {
      const record = await pb.collection('analytics').create(data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  }
};

export const usersService = {
  async getAll() {
    try {
      const records = await pb.collection('users').getFullList({
        sort: '-created',
      });
      return records;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const record = await pb.collection('users').create(data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const record = await pb.collection('users').update(id, data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await pb.collection('users').delete(id);
      return true;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  }
};

export const monthlyStatsService = {
  async getAll() {
    try {
      const records = await pb.collection('monthly_stats').getFullList({
        sort: '-year,-month',
      });
      return records;
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const record = await pb.collection('monthly_stats').create(data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const record = await pb.collection('monthly_stats').update(id, data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  }
};

export const notificationsService = {
  async getAll() {
    try {
      const records = await pb.collection('notifications').getFullList({
        sort: '-created',
      });
      return records;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const record = await pb.collection('notifications').create(data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const record = await pb.collection('notifications').update(id, data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await pb.collection('notifications').delete(id);
      return true;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  }
};

export const settingsService = {
  async get() {
    try {
      const records = await pb.collection('settings').getFullList();
      return records[0] || null;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
  },

  async update(id, data) {
    try {
      const record = await pb.collection('settings').update(id, data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  },

  async create(data) {
    try {
      const record = await pb.collection('settings').create(data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  }
};

export const messagesService = {
  async getAll() {
    try {
      const records = await pb.collection('contact_messages').getFullList({
        sort: '-created',
      });
      return records;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  async create(data) {
    try {
      const record = await pb.collection('contact_messages').create(data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      const record = await pb.collection('contact_messages').update(id, data);
      return record;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await pb.collection('contact_messages').delete(id);
      return true;
    } catch (error) {
      handlePBError(error);
      throw error;
    }
  }
};
