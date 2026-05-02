"use client";
import React, { useEffect, useState } from "react";

type Lead = {
  id: number;
  company: string;
  niche: string;
  email: string;
  signal: string;
};

const PASSWORD = "1234"; // change this

const SHEET_API_URL =
  "https://sheets.googleapis.com/v4/spreadsheets/1sf9UHNwvOkFIvRU_N4L4RB9t6h4zy3OxYdNkJm98Od8/values/A2:D100?key=AIzaSyBUevc3gkpHN1c76OdG47NyFZE1kzpvMnM";

const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbwhCtJjLPymxWjcZE_7nEXvhNmBP6sPK-1FSHg-NZJQVA7rTM3b5GDM6Onjilo5lhtoPg/exec";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    company: "",
    niche: "",
    email: "",
    signal: "",
  });

  const loadLeads = async () => {
    const res = await fetch(SHEET_API_URL);
    const data = await res.json();

    const rows = data.values || [];

    const formatted: Lead[] = rows.map((row: string[], i: number) => ({
      id: i,
      company: row[0] || "",
      niche: row[1] || "",
      email: row[2] || "",
      signal: row[3] || "",
    }));

    setLeads(formatted);
    setSelectedLead(formatted[0] || null);
  };

  useEffect(() => {
    if (authenticated) loadLeads();
  }, [authenticated]);

  const addLead = async () => {
    if (!form.company || !form.email) {
      alert("Company and Email are required");
      return;
    }

    setSaving(true);

    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      company: "",
      niche: "",
      email: "",
      signal: "",
    });

    setSaving(false);
    setTimeout(loadLeads, 1500);
  };

  const generateMessage = (lead: Lead) => {
    return `Hi ${lead.company},

I saw that you're in the ${lead.niche} space.

We help e-commerce brands like yours hire trained remote workers for customer support, admin work, order tracking, and daily operations.

This helps store owners save time, reply faster to customers, and reduce hiring costs.

Would you be open to a quick 15-minute call this week?

Best,
Boyet Santos`;
  };

  const copyMessage = () => {
    if (!selectedLead) return;
    navigator.clipboard.writeText(generateMessage(selectedLead));
    alert("Message copied!");
  };

  const filteredLeads = leads.filter((lead) =>
    `${lead.company} ${lead.niche} ${lead.email} ${lead.signal}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (!authenticated) {
    return (
      <div style={{ padding: 50, fontFamily: "Arial" }}>
        <h1>E-commerce Lead Finder CRM</h1>
        <h2>Login Required</h2>

        <input
          type="password"
          placeholder="Enter password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          style={{
            padding: 12,
            width: 300,
            marginBottom: 10,
            display: "block",
          }}
        />

        <button
          onClick={() => {
            if (inputPassword === PASSWORD) {
              setAuthenticated(true);
            } else {
              alert("Wrong password");
            }
          }}
          style={{ padding: 12 }}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>E-commerce Lead Finder CRM</h1>

      <button
        onClick={() => setAuthenticated(false)}
        style={{ marginBottom: 20, padding: 8 }}
      >
        Logout
      </button>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 20,
          marginBottom: 20,
          maxWidth: 420,
        }}
      >
        <h2>Add New Lead</h2>

        <input
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          style={{ display: "block", marginBottom: 8, padding: 10, width: "100%" }}
        />

        <input
          placeholder="Niche"
          value={form.niche}
          onChange={(e) => setForm({ ...form, niche: e.target.value })}
          style={{ display: "block", marginBottom: 8, padding: 10, width: "100%" }}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ display: "block", marginBottom: 8, padding: 10, width: "100%" }}
        />

        <input
          placeholder="Signal"
          value={form.signal}
          onChange={(e) => setForm({ ...form, signal: e.target.value })}
          style={{ display: "block", marginBottom: 8, padding: 10, width: "100%" }}
        />

        <button onClick={addLead} disabled={saving} style={{ padding: 12 }}>
          {saving ? "Saving..." : "Add Lead"}
        </button>
      </div>

      <input
        placeholder="Search leads..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: 10,
          width: 350,
          marginBottom: 20,
          display: "block",
        }}
      />

      <div style={{ display: "flex", gap: 30 }}>
        <div style={{ width: 350 }}>
          <h2>Leads</h2>

          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              style={{
                border: "1px solid gray",
                marginBottom: 8,
                padding: 12,
                cursor: "pointer",
                background:
                  selectedLead?.id === lead.id ? "#f0f0f0" : "white",
              }}
            >
              <b>{lead.company}</b>
              <div>{lead.niche}</div>
              <small>{lead.email}</small>
            </div>
          ))}
        </div>

        {selectedLead && (
          <div style={{ width: 450 }}>
            <h2>{selectedLead.company}</h2>
            <p>
              <b>Niche:</b> {selectedLead.niche}
            </p>
            <p>
              <b>Email:</b> {selectedLead.email}
            </p>
            <p>
              <b>Signal:</b> {selectedLead.signal}
            </p>

            <h3>Outreach Message</h3>

            <textarea
              value={generateMessage(selectedLead)}
              readOnly
              style={{
                width: "100%",
                height: 220,
                padding: 10,
                marginTop: 10,
                display: "block",
              }}
            />

            <button onClick={copyMessage} style={{ marginTop: 10, padding: 12 }}>
              Copy Message
            </button>

            <a
              href={`mailto:${selectedLead.email}?subject=Quick help for ${selectedLead.company}&body=${encodeURIComponent(
                generateMessage(selectedLead)
              )}`}
              style={{
                display: "inline-block",
                marginLeft: 10,
                padding: 12,
                background: "#222",
                color: "white",
                textDecoration: "none",
              }}
            >
              Open Email
            </a>
          </div>
        )}
      </div>
    </div>
  );
}