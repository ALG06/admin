type Campaign = {
    id: number;
    name: string;
    description: string;
    address: string;
    active: boolean;
    start_date: string;
    end_date: string;
    lat: number;
    lon: number;
  };

  type Donation = {
    id: number;
    date: string;
    pending: boolean;
    // Add other properties as needed
  };

  type CompleteDonation = {
    donation: {
      id: number;
      date: string;
      pending: boolean;
      created_at: string;
      id_donor: number;
      id_point: number | null;
      qr: string | null;
      state: string | null;
      time: string;
      type: string;
    }
    donor: {
      email: string;
      name: string;
      phone: string;
    }[];
    food_items: any[]; // Assuming food_items is an array of objects, replace `any` with the correct type if known
    total_food_items: number;
  };