import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

export const syncUserCreation=inngest.createFunction(
    {
        id:'sync-user-from-clerk'
    },
    {event:'clerk/user.created'},
    async ({event})=>{
        const {id,first_name,last_name,email_addresses,image_url}=event.data;
        const userData={
            _id:id,
            name:first_name+" "+last_name,
            email:email_addresses[0].email_address,
            imageURL:image_url
        }
        await connectDB()
        await User.create(userData)
        console.log("Incoming user.created event:", event);
    }
)
// update user
export const syncUserUpdation=inngest.createFunction(
    {
        id:'update-user-from-clerk'
    },
    {event:'clerk/user.updated'},
    async ({event}) => {
        const {id,first_name,last_name,email_addresses,image_url}=event.data
        const userData={
            _id:id,
            email:email_addresses[0].email_address,
            name:first_name+" "+last_name,
            imageURL:image_url
        }
        await connectDB();
        await User.findByIdAndUpdate(id,userData)
    }
)

// delete user
export const syncUserDeletion=inngest.createFunction(
    {
        id:'delete-user-with-clerk',
    },
    {event:'clerk/user.deleted'},
    async ({event}) => {
        const {id}=event.data
        await connectDB()
        await User.findByIdAndDelete(id)

    }
)

//inngest function to create data Order in database
export const createUserOrder = inngest.createFunction(
  {
    id: 'create-user-order',
    batchEvents: {
      maxSize: 5,
      timeout: '5s'
    }
  },
  { event: 'order/created' },
  async ({ events }) => {
    // No DB insert here
    console.log("🔥 Inngest received events:", events);

    // Process orders for notifications, analytics, emails, etc.
    for (const event of events) {
      console.log("📦 Processing order:", event.data);
      // You can send emails, update analytics, trigger shipment, etc.
    }

    return { success: true, processed: events.length };
  }
);

