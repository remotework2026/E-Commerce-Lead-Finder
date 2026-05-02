"use client";
import React, { useEffect, useMemo, useState } from "react";

type Lead = {
  id: number;
  company: string;
  niche: string;
  email: string;
  signal: string;
};

const PASSWORD = "1234";

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
  const [bulkText, setBulkText] = useState("");

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

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) =>
      `${lead.company} ${lead.niche} ${lead.email} ${lead.signal}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [leads, search]);

  const saveLead = async (lead: {
    company: string;
    niche: string;
    email: string;
    signal: string;
  }) => {
    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
  };

  const addLead = async () => {
    if (!form.company || !form.email) {
      alert("Company and Email are required");
      return;
    }

    setSaving(true);
    await saveLead(form);
    setForm({ company: "", niche: "", email: "", signal: "" });
    setSaving(false);

    setTimeout(loadLeads, 1500);
  };

  const importBulkLeads = async () => {
    if (!bulkText.trim()) {
      alert("Paste leads first.");
      return;
    }

    const lines = bulkText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    setSaving(true);

    for (const line of lines) {
      const parts = line.split(",").map((item) => item.trim());

      const lead = {
        company: parts[0] || "",
        niche: parts[1] || "E-commerce",
        email: parts[2] || "",
        signal: parts[3] || "Potential e-commerce staffing client",
      };

      if (lead.company && lead.email) {
        await saveLead(lead);
      }
    }

    setBulkText("");
    setSaving(false);

    setTimeout(loadLeads, 2000);
    alert("Bulk leads imported.");
  };

  const generateMessage = (lead: Lead): string => {
    return `Hi ${lead.company},

I saw you're in the ${lead.niche} space and growing.

We help e-commerce brands handle customer support, order tracking, and daily operations using trained remote staff.

This helps reduce costs and improve response time without hiring locally.

Would you be open to a quick 15-minute call this week?

Best,
Boyet Santos`;
  };

  const copyMessage = () => {
    if (!selectedLead) return;
    navigator.clipboard.writeText(generateMessage(selectedLead));
    alert("Message copied!");
  };

  if (!authenticated) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <h1>Lead CRM</h1>
          <input
            type="password"
            placeholder="Enter password"
            value={inputPassword}
            onChange={(e) => setInputPassword(e.target.value)}
            style={styles.input}
          />
          <button
            style={styles.primaryButton}
            onClick={() => {
              if (inputPassword === PASSWORD) setAuthenticated(true);
              else alert("Wrong password");
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <aside style={styles.sidebar}>
        <h2>Lead CRM</h2>
        <p>Total: {leads.length}</p>
        <button onClick={() => setAuthenticated(false)}>Logout</button>
      </aside>

      <main style={styles.content}>
        <h1>Client Pipeline</h1>

        <div style={styles.panel}>
          <h2>Add Single Lead</h2>

          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            style={styles.input}
          />

          <input
            placeholder="Niche"
            value={form.niche}
            onChange={(e) => setForm({ ...form, niche: e.target.value })}
            style={styles.input}
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={styles.input}
          />

          <input
            placeholder="Signal"
            value={form.signal}
            onChange={(e) => setForm({ ...form, signal: e.target.value })}
            style={styles.input}
          />

          <button onClick={addLead} disabled={saving}>
            {saving ? "Saving..." : "Add Lead"}
          </button>
        </div>

        <div style={styles.panel}>
          <h2>Bulk Lead Importer</h2>
          <p>
            Paste one lead per line using this format:
            <br />
            <b>Company, Niche, Email, Signal</b>
          </p>

          <textarea
            placeholder={`Example:\nLuna Skin, Beauty, hello@lunaskin.com, Hiring support\nPeak Gear, Outdoor Apparel, hello@peakgear.com, Running ads`}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            style={styles.textarea}
          />

          <button onClick={importBulkLeads} disabled={saving}>
            {saving ? "Importing..." : "Import Leads"}
          </button>
        </div>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ width: 300 }}>
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                style={styles.leadItem}
              >
                <b>{lead.company}</b>
                <div>{lead.niche}</div>
              </div>
            ))}
          </div>

          {selectedLead && (
            <div>
              <h2>{selectedLead.company}</h2>
              <p>{selectedLead.email}</p>

              <textarea
                value={generateMessage(selectedLead)}
                readOnly
                style={{ width: 350, height: 150 }}
              />

              <br />

              <button onClick={copyMessage}>Copy</button>

              <a
                target="_blank"
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedLead.email}&su=${encodeURIComponent(
                  `Quick help for ${selectedLead.company}`
                )}&body=${encodeURIComponent(generateMessage(selectedLead))}`}
                style={{ marginLeft: 10 }}
              >
                Open Gmail
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const styles: any = {
  app: { display: "flex", minHeight: "100vh", fontFamily: "Arial" },
  sidebar: { width: 200, background: "#111", color: "#fff", padding: 20 },
  content: { flex: 1, padding: 20 },
  panel: { border: "1px solid #ddd", padding: 20, marginBottom: 20 },
  input: { display: "block", marginBottom: 10, padding: 10, width: "100%" },
  textarea: {
    display: "block",
    width: "100%",
    height: 140,
    padding: 10,
    marginBottom: 10,
  },
  leadItem: {
    border: "1px solid #ccc",
    padding: 10,
    marginBottom: 5,
    cursor: "pointer",
  },
  loginPage: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  loginCard: { padding: 30, border: "1px solid #ddd" },
  primaryButton: { padding: 10 },
};