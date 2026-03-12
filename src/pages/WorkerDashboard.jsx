import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await api.getMyBookings();
        setBookings(data || []);
      } catch {
        toast.error("Could not load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.request(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status } : b)));
      toast.success(`Booking ${status}`);
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="pt-14">
      <section className="container py-10">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Worker Panel</p>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            ID: {user?.registrationId} · {user?.occupation}
          </p>
        </div>

        <h2 className="font-mono text-lg font-bold mb-4">Your Bookings</h2>

        {loading ? (
          <p className="font-mono text-sm text-muted-foreground text-center py-10">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="font-mono text-sm text-muted-foreground text-center py-10">No bookings yet.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b._id} className="bg-card border border-border p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-mono text-base font-bold">{b.customerName}</h3>
                    <p className="font-mono text-xs text-muted-foreground">{b.customerAddress}</p>
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-primary">{b.status || "pending"}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase">Date</p>
                    <p className="font-body">{new Date(b.serviceDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase">Price</p>
                    <p className="font-body font-bold">₹{b.agreedPrice}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase">Mobile</p>
                    <p className="font-body">{b.customerMobile}</p>
                  </div>
                </div>
                {b.status === "pending" && (
                  <div className="flex gap-2 pt-3 border-t border-border">
                    <button
                      onClick={() => updateStatus(b._id, "confirmed")}
                      className="px-4 py-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest hover:opacity-90"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(b._id, "cancelled")}
                      className="px-4 py-2 bg-destructive text-destructive-foreground font-mono text-xs uppercase tracking-widest hover:opacity-90"
                    >
                      Decline
                    </button>
                  </div>
                )}
                {b.status === "confirmed" && (
                  <div className="pt-3 border-t border-border">
                    <button
                      onClick={() => updateStatus(b._id, "completed")}
                      className="px-4 py-2 bg-secondary text-secondary-foreground font-mono text-xs uppercase tracking-widest hover:opacity-90"
                    >
                      Mark Complete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default WorkerDashboard;
