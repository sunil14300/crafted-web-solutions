import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await api.getMyBookings();
        setBookings(data || []);
      } catch (err) {
        toast.error("Could not load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case "confirmed": return "text-primary";
      case "completed": return "text-green-600";
      case "cancelled": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="pt-14">
      <section className="container py-10">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Your Bookings</p>
        <h1 className="text-3xl font-bold tracking-tight mb-8">My Bookings</h1>

        {loading ? (
          <p className="font-mono text-sm text-muted-foreground text-center py-10">Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono text-sm text-muted-foreground">No bookings yet. Search and book a worker!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b._id} className="bg-card border border-border p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-mono text-base font-bold">{b.customerName}</h3>
                    <p className="font-mono text-xs text-muted-foreground">{b.customerAddress}</p>
                  </div>
                  <span className={`font-mono text-xs uppercase tracking-widest ${statusColor(b.status)}`}>
                    {b.status || "pending"}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase">Date</p>
                    <p className="font-body">{new Date(b.serviceDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase">Price</p>
                    <p className="font-body font-bold">₹{b.agreedPrice}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase">Commission</p>
                    <p className="font-body">₹{b.commission?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase">Mobile</p>
                    <p className="font-body">{b.customerMobile}</p>
                  </div>
                </div>
                {b.description && (
                  <p className="font-body text-sm text-muted-foreground mt-3 border-t border-border pt-3">{b.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyBookingsPage;
