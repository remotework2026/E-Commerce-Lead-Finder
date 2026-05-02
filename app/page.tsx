"use client";
import React, { useEffect, useState } from "react";

type Lead = {
  id: number;
  company: string;
  niche: string;
  email: string;
  signal: string;
};

const SHEET_API_URL = "https://sheets.googleapis.com/v4/spreadsheets/1sf9UHNwvOkFIvRU_N4L4RB9t6h4zy3OxYdNkJm98Od8/values/A2:D100?key=AIzaSyBUevc3gkpHN1c76OdG47NyFZE1kzpvMnM";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwhCtJjLPymxWjcZE_7nEXvhNmBP6sPK-1FSHg-NZJQVA7rTM3b5GDM6Onjilo5lhtoPg/exec";

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [form, setForm] = useState({
    company: "",
    niche: "",
    email: "",
    signal: "",
  });

  const loadLeads = () => {
    fetch(SHEET_API_URL)
      .then((res) => res.json())
      .then((data) => {
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
      });
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const addLead = async () => {
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

    setTimeout(loadLeads, 1500);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>E-commerce Lead Finder CRM</h1>

      <div style={{ marginBottom: 20 }}>
        <h2>Add New Lead</h2>

        <input
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          style={{ display: "block", marginBottom: 8, padding: 8, width: 300 }}
        />

        <input
          placeholder="Niche"
          value={form.niche}
          onChange={(e) => setForm({ ...form, niche: e.target.value })}
          style={{ display: "block", marginBottom: 8, padding: 8, width: 300 }}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ display: "block", marginBottom: 8, padding: 8, width: 300 }}
        />

        <input
          placeholder="Signal"
          value={form.signal}
          onChange={(e) => setForm({ ...form, signal: e.target.value })}
          style={{ display: "block", marginBottom: 8, padding: 8, width: 300 }}
        />

        <button onClick={addLead} style={{ padding: 10 }}>
          Add Lead
        </button>
      </div>

      <hr />

      <h2>Leads</h2>

      <div style={{ display: "flex", gap: 20 }}>
        <div>
          {leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              style={{
                border: "1px solid gray",
                margin: 5,
                padding: 10,
                cursor: "pointer",
              }}
            >
              <b>{lead.company}</b>
              <div>{lead.niche}</div>
            </div>
          ))}
        </div>

        {selectedLead && (
          <div>
            <h2>{selectedLead.company}</h2>
            <p>{selectedLead.signal}</p>
            <p>{selectedLead.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}