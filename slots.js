// The two sign-up sheets. Edit the text here; keep each id unique and don't
// change an id after students have started signing up (the Google Sheet
// records signups by id).

const SHEETS = {
  topics: {
    title: "Paper and Presentation Topic Sign-Up",
    intro: "Choose one topic for your paper and presentation. Each topic can be taken by one student.",
    slots: [
      { id: "T01", title: "Volcker Disinflation", detail: "Cause of the ’81 and ’82 recessions in the US" },
      { id: "T02", title: "2007–2009 Housing Market Bubble and Collapse" },
      { id: "T03", title: "2007–2009 Financial Crisis and Collapse" },
      { id: "T04", title: "Great Depression", detail: "Causes and consequences" },
      { id: "T05", title: "The Great Moderation", detail: "i.e., the low inflation and economic expansion of the 90s" },
      { id: "T06", title: "The technological causes of the 90s global expansion" },
      { id: "T07", title: "The rise of China", detail: "Chinese pro-market reforms of the 80s and 90s and resulting economic growth" },
      { id: "T08", title: "The rise of India", detail: "Indian pro-market reforms starting in 1991 and resulting economic growth" },
      { id: "T09", title: "The collapse of the Soviet Union", detail: "1989–1992 and subsequent economic collapse of the resulting countries" },
      { id: "T10", title: "The US–China Trade War and other US trade disputes", detail: "From 2017 until the present" },
      { id: "T11", title: "The creation of the European Monetary Union and its successes", detail: "Over the 2000s" },
      { id: "T12", title: "Brexit", detail: "Great Britain’s vote on leaving the EU – causes and possible consequences" },
      { id: "T13", title: "The United States–Mexico–Canada Agreement (USMCA)", detail: "The replacement for NAFTA" },
      { id: "T14", title: "The 1973 Oil Crisis and subsequent recession" },
      { id: "T15", title: "The New Deal and other post–Great Depression spending policies" },
      { id: "T16", title: "The creation of the Bretton Woods institutions", detail: "WTO, World Bank, and IMF" },
      { id: "T17", title: "The 1997 Asian Financial Crisis and its impact on the rest of the world" },
      { id: "T18", title: "The “golden age of capitalism”", detail: "Post-WWII global economic boom, 1950–1973" },
      { id: "T19", title: "Dot-Com Bubble", detail: "The United States, 1994–2000" },
      { id: "T20", title: "COVID impacts on the economy" },
      { id: "T21", title: "Post-COVID recovery" }
    ]
  },

  times: {
    title: "Presentation Time Slot Sign-Up",
    intro: "Presentations are on Tuesday, December 8, during class. Each slot is 10 minutes. Choose one slot.",
    slots: [
      { id: "S01", title: "10:35 – 10:45 AM", detail: "Tuesday, December 8" },
      { id: "S02", title: "10:45 – 10:55 AM", detail: "Tuesday, December 8" },
      { id: "S03", title: "10:55 – 11:05 AM", detail: "Tuesday, December 8" },
      { id: "S04", title: "11:05 – 11:15 AM", detail: "Tuesday, December 8" },
      { id: "S05", title: "11:15 – 11:25 AM", detail: "Tuesday, December 8" },
      { id: "S06", title: "11:25 – 11:35 AM", detail: "Tuesday, December 8" },
      { id: "S07", title: "11:40 – 11:50 AM", detail: "Tuesday, December 8" },
      { id: "S08", title: "11:50 – 12:00 PM", detail: "Tuesday, December 8" },
      { id: "S09", title: "12:00 – 12:10 PM", detail: "Tuesday, December 8" },
      { id: "S10", title: "12:10 – 12:20 PM", detail: "Tuesday, December 8" },
      { id: "S11", title: "12:20 – 12:30 PM", detail: "Tuesday, December 8" }
    ]
  }
};
