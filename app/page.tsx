"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Mail, Phone, Globe, Users, Filter, Plus, CheckCircle2, Clock, AlertCircle, BriefcaseBusiness, ShoppingCart, Send, Download } from "lucide-react";

const sampleLeads = [
  {
    id: 1,
    company: "LunaSkin Co.",
    niche: "Beauty & Skincare",
    website: "lunaskin.example",
    country: "Australia",
    size: "11-50",
    signal: "Hiring CS reps and posting daily TikTok ads",
    roles: ["Customer Support VA", "Order Fulfillment VA"],
    email: "hello@lunaskin.example",
    phone: "+61 400 000 121",
    score: 92,
    stage: "New",
    status: "Ready for outreach",
  },
];

function generateEmail(lead: any) {
  return `Subject: Helping ${lead.company} handle more e-commerce work without hiring full-time

Hi ${lead.company} team,

I noticed ${lead.signal.toLowerCase()}. We help e-commerce brands add trained remote workers for roles like ${lead.roles.join(" and ")}, so owners can remove repetitive work.

Would you be open to a quick 15-minute call this week?

Best,
Boyet`;
}

export default function App() {
  const [leads, setLeads] = useState(sampleLeads);
  const [query, setQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState(sampleLeads[0]);

  const filtered = useMemo(() => {
    return leads.filter((lead) =>
      `${lead.company} ${lead.niche}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [leads, query]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">E-commerce Lead Finder</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search leads..."
        className="mb-4 w-full p-2 border rounded"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          {filtered.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="p-4 border rounded mb-2 cursor-pointer bg-white"
            >
              <h2 className="font-semibold">{lead.company}</h2>
              <p className="text-sm text-gray-600">{lead.niche}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border rounded bg-white">
          <h2 className="font-bold">{selectedLead.company}</h2>
          <p>{selectedLead.signal}</p>
          <p className="mt-2 text-sm">{selectedLead.email}</p>

          <textarea
            readOnly
            value={generateEmail(selectedLead)}
            className="w-full mt-4 p-2 border rounded h-40"
          />
        </div>
      </div>
    </div>
  );
}