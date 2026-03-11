import { useState } from "react";
import { Link } from "react-router-dom";

const OCCUPATIONS = [
  "Plumber", "Electrician", "Painter", "Mechanic", "Cook", "Carpenter",
  "Barber", "Sweeper", "Mason", "Driver", "Helper", "Cobbler", "Technical Person", "Labour",
];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "", address: "", dob: "", mobile: "", email: "",
    state: "", occupation: "", aadhaar: "", pan: "", priceCharge: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [regId, setRegId] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = "SEVA" + Math.floor(100000 + Math.random() * 900000);
    setRegId(id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-14 min-h-screen flex items-center justify-center">
        <div className="form-panel text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">Registration Complete</p>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome, {formData.name}</h2>
          <div className="workshop-panel inline-block my-6 px-8 py-4">
            <p className="font-mono text-xs text-secondary-foreground/60 uppercase tracking-widest mb-1">Your Registration ID</p>
            <p className="font-mono text-2xl font-bold text-primary">{regId}</p>
          </div>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Save this ID. You'll need it to login and manage your profile.
          </p>
          <Link to="/login" className="inline-block px-6 py-3 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14">
      <section className="container py-10">
        <div className="max-w-lg mx-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">Join as a worker</p>
          <h1 className="text-3xl font-bold tracking-tight mb-8">Registration</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", label: "Full Name", type: "text", required: true },
              { name: "address", label: "Address", type: "text", required: true },
              { name: "dob", label: "Date of Birth", type: "date", required: true },
              { name: "mobile", label: "Mobile Number", type: "tel", required: true },
              { name: "email", label: "E-mail (optional)", type: "email", required: false },
              { name: "state", label: "State", type: "text", required: true },
              { name: "aadhaar", label: "Aadhaar Number", type: "text", required: true },
              { name: "pan", label: "PAN Card Number", type: "text", required: false },
              { name: "priceCharge", label: "Price Charge (per task/day)", type: "text", required: true },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  {field.label} {field.required && <span className="text-primary">*</span>}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full h-11 px-4 bg-card border border-border font-body text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Occupation <span className="text-primary">*</span>
              </label>
              <select
                name="occupation"
                required
                value={formData.occupation}
                onChange={handleChange}
                className="w-full h-11 px-4 bg-card border border-border font-body text-sm focus:outline-none focus:border-primary transition-colors"
              >
                <option value="">Select occupation</option>
                {OCCUPATIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full h-12 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Register
              </button>
            </div>

            <p className="text-center font-body text-sm text-muted-foreground">
              Already registered?{" "}
              <Link to="/login" className="safety-link font-mono text-xs uppercase">Login</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default RegisterPage;
