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

  const addLead = async () => {
    if (!form.company || !form.email) {
      alert("Company and email are required.");
      return;
    }

    setSaving(true);

    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ company: "", niche: "", email: "", signal: "" });
    setSaving(false);

    setTimeout(loadLeads, 1500);
  };

  const generateMessage = (lead: Lead): string => {
    return `Hi ${lead.company},

I saw you're in the ${lead.niche} space.

We help e-commerce brands hire trained remote workers for customer support, order tracking, admin tasks, and daily operations.

This helps store owners save time, reply faster to customers, and reduce hiring costs without hiring locally.

Would you be open to a quick 15-minute call this week?

Best,
Boyet`;
  };

  const copyMessage = () => {
    if (!selectedLead) return;
    navigator.clipboard.writeText(generateMessage(selectedLead));
    alert("Message copied!");
  };

  if (!authenticated) {
    return (
      <main style={styles.loginPage}>
        <div style={styles.loginCard}>
          <h1 style={styles.logo}>E-Commerce Lead Finder</h1>
          <p style={styles.muted}>Private CRM for staffing agency leads</p>

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
      </main>
    );
  }

  return (
    <main style={styles.app}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Lead CRM</h2>
        <p style={styles.sidebarText}>Remote staffing agency</p>

        <div style={styles.sidebarStat}>
          <span>Total Leads</span>
          <b>{leads.length}</b>
        </div>

        <div style={styles.sidebarStat}>
          <span>Visible</span>
          <b>{filteredLeads.length}</b>
        </div>

        <button style={styles.logoutButton} onClick={() => setAuthenticated(false)}>
          Logout
        </button>
      </aside>

      <section style={styles.content}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>E-commerce Client Pipeline</h1>
            <p style={styles.muted}>
              Add leads, track prospects, and generate outreach messages.
            </p>
          </div>

          <button style={styles.secondaryButton} onClick={loadLeads}>
            Refresh
          </button>
        </header>

        <section style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Leads</p>
            <h2>{leads.length}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Search Results</p>
            <h2>{filteredLeads.length}</h2>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Selected Lead</p>
            <h2>{selectedLead ? selectedLead.company : "None"}</h2>
          </div>
        </section>

        <section style={styles.grid}>
          <div style={styles.panel}>
            <h2>Add New Lead</h2>

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
              placeholder="Signal / buying reason"
              value={form.signal}
              onChange={(e) => setForm({ ...form, signal: e.target.value })}
              style={styles.input}
            />

            <button style={styles.primaryButton} onClick={addLead} disabled={saving}>
              {saving ? "Saving..." : "Add Lead"}
            </button>
          </div>

          <div style={styles.panel}>
            <h2>Lead Search</h2>

            <input
              placeholder="Search company, niche, email, signal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.input}
            />

            <div style={styles.leadList}>
              {filteredLeads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  style={{
                    ...styles.leadItem,
                    background:
                      selectedLead?.id === lead.id ? "#eef2ff" : "#ffffff",
                    borderColor:
                      selectedLead?.id === lead.id ? "#4f46e5" : "#e5e7eb",
                  }}
                >
                  <b>{lead.company}</b>
                  <span>{lead.niche}</span>
                  <small>{lead.email}</small>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.panelWide}>
            {selectedLead ? (
              <>
                <h2>{selectedLead.company}</h2>

                <div style={styles.detailBox}>
                  <p><b>Niche:</b> {selectedLead.niche}</p>
                  <p><b>Email:</b> {selectedLead.email}</p>
                  <p><b>Signal:</b> {selectedLead.signal}</p>
                </div>

                <h3>Outreach Message</h3>

                <textarea
                  readOnly
                  value={generateMessage(selectedLead)}
                  style={styles.textarea}
                />

                <div style={styles.actions}>
                  <button style={styles.primaryButton} onClick={copyMessage}>
                    Copy Message
                  </button>

                  <a
                    style={styles.darkButton}
                    href={`mailto:${selectedLead.email}?subject=Quick help for ${selectedLead.company}&body=${encodeURIComponent(
                      generateMessage(selectedLead)
                    )}`}
                  >
                    Open Email
                  </a>
                </div>
              </>
            ) : (
              <p>No lead selected.</p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  loginPage: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial",
  },
  loginCard: {
    width: 380,
    background: "white",
    padding: 32,
    borderRadius: 18,
    boxShadow: "0 20px 60px rgba(0,0,0,.25)",
  },
  app: {
    minHeight: "100vh",
    display: "flex",
    background: "#f8fafc",
    fontFamily: "Arial",
    color: "#0f172a",
  },
  sidebar: {
    width: 250,
    background: "#0f172a",
    color: "white",
    padding: 24,
  },
  sidebarTitle: {
    margin: 0,
    fontSize: 24,
  },
  sidebarText: {
    color: "#cbd5e1",
    marginBottom: 28,
  },
  sidebarStat: {
    background: "#1e293b",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    padding: 28,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    margin: 0,
    fontSize: 30,
  },
  muted: {
    color: "#64748b",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
    marginBottom: 24,
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 18,
    border: "1px solid #e5e7eb",
  },
  cardLabel: {
    color: "#64748b",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "360px 380px 1fr",
    gap: 18,
    alignItems: "start",
  },
  panel: {
    background: "white",
    padding: 20,
    borderRadius: 18,
    border: "1px solid #e5e7eb",
  },
  panelWide: {
    background: "white",
    padding: 20,
    borderRadius: 18,
    border: "1px solid #e5e7eb",
    minHeight: 460,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    fontSize: 14,
  },
  primaryButton: {
    padding: "12px 16px",
    background: "#4f46e5",
    color: "white",
    border: 0,
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
  },
  secondaryButton: {
    padding: "10px 14px",
    background: "white",
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    cursor: "pointer",
  },
  darkButton: {
    padding: "12px 16px",
    background: "#0f172a",
    color: "white",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 20,
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: 0,
    cursor: "pointer",
  },
  leadList: {
    maxHeight: 500,
    overflowY: "auto",
  },
  leadItem: {
    width: "100%",
    textAlign: "left",
    display: "block",
    padding: 14,
    marginBottom: 10,
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    cursor: "pointer",
  },
  detailBox: {
    background: "#f8fafc",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  textarea: {
    width: "100%",
    height: 220,
    padding: 12,
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    boxSizing: "border-box",
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 14,
  },
};