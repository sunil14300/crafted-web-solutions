import { Search, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const MOCK_WORKERS = [
  { id: "SEVA123456", name: "Ankit Kumar", occupation: "Plumber", location: "Chinhat, Lucknow", state: "Uttar Pradesh", age: 22, price: "₹300/task", rating: 4.5, available: true },
  { id: "SEVA123457", name: "Pawan Kumar", occupation: "Bike Mechanic", location: "Gomti Nagar, Lucknow", state: "Uttar Pradesh", age: 32, price: "₹200/task", rating: 4.2, available: true },
  { id: "SEVA123458", name: "Ravi Singh", occupation: "Electrician", location: "Aliganj, Lucknow", state: "Uttar Pradesh", age: 28, price: "₹350/task", rating: 4.8, available: false },
  { id: "SEVA123459", name: "Deepak Verma", occupation: "Painter", location: "Hazratganj, Lucknow", state: "Uttar Pradesh", age: 35, price: "₹500/day", rating: 4.0, available: true },
  { id: "SEVA123460", name: "Suresh Yadav", occupation: "Cook", location: "Indira Nagar, Lucknow", state: "Uttar Pradesh", age: 40, price: "₹400/day", rating: 4.6, available: true },
  { id: "SEVA123461", name: "Ramesh Gupta", occupation: "Carpenter", location: "Mahanagar, Lucknow", state: "Uttar Pradesh", age: 45, price: "₹600/day", rating: 4.3, available: true },
];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const filteredWorkers = MOCK_WORKERS.filter(
    (w) =>
      !query ||
      w.occupation.toLowerCase().includes(query.toLowerCase()) ||
      w.name.toLowerCase().includes(query.toLowerCase()) ||
      w.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="pt-14">
      <section className="container py-10">
        <div className="mb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Search Results {query && `for "${query}"`}
          </p>
          <div className="flex gap-0 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search workers..."
                className="w-full h-12 pl-11 pr-4 bg-card border border-border font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <p className="font-mono text-xs text-muted-foreground mb-6">
          {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? "s" : ""} found
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredWorkers.map((worker) => (
            <div key={worker.id} className="worker-card">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-mono text-base font-bold">{worker.name}</h3>
                    <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                      {worker.occupation}
                    </p>
                  </div>
                  <span className={worker.available ? "status-available" : "status-booked"}>
                    {worker.available ? "Available" : "Booked"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="font-body text-sm">{worker.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 text-primary" />
                    <span className="font-body text-sm">{worker.rating} / 5.0</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="font-mono text-sm font-bold">{worker.price}</span>
                  <button
                    disabled={!worker.available}
                    className="px-4 py-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  >
                    Book Now
                  </button>
                </div>

                <p className="font-mono text-[10px] text-muted-foreground mt-3 uppercase tracking-wider">
                  ID: {worker.id} · Age: {worker.age} · {worker.state}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredWorkers.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-sm text-muted-foreground">
              No workers found for "{query}". Try a different search.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchPage;
